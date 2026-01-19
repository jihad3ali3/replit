<?php

namespace App\Http\Controllers;

use App\Models\UniversityPost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * ArticleController - Handles university articles/posts
 * 
 * This controller manages the articles listing and individual article display.
 */
class ArticleController extends Controller
{
    /**
     * Display a listing of articles with filters
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $query = UniversityPost::with(['university']);

        // Filter by university (using public_id)
        if ($request->filled('university')) {
            $query->whereHas('university', function ($q) use ($request) {
                $q->where('public_id', $request->university);
            });
        }

        // Search in title and content
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Sort by date or likes
        $sortBy = $request->get('sort', 'date');
        if ($sortBy === 'likes') {
            $query->withCount('likes')->orderBy('likes_count', 'desc');
        } else {
            $query->latest();
        }

        // Paginate results
        $articles = $query->paginate(12)->through(function ($post) {
            return [
                'id' => $post->public_id,
                'title' => $post->title,
                'image' => '/images/default-article.png',
                'universityId' => $post->university->public_id ?? null,
                'universityName' => $post->university->name ?? '',
                'date' => $post->created_at->toISOString(),
                'publishDate' => $post->created_at->format('Y-m-d'),
                'likesCount' => $post->likes_count ?? 0,
            ];
        });

        return Inertia::render('Articles', [
            'articles' => $articles,
            'filters' => $request->only(['university', 'search', 'sort']),
        ]);
    }

    /**
     * Display the specified article
     *
     * @param UniversityPost $article
     * @return Response
     */
    public function show(UniversityPost $article): Response
    {
        $article->load(['university']);
        $article->loadCount('likes');

        return Inertia::render('ArticleDetail', [
            'article' => [
                'id' => $article->public_id,
                'title' => $article->title,
                'content' => $article->content,
                'image' => '/images/default-article.png',
                'universityId' => $article->university->public_id ?? null,
                'universityName' => $article->university->name ?? '',
                'date' => $article->created_at->toISOString(),
                'likesCount' => $article->likes_count ?? 0,
            ],
        ]);
    }

    /**
     * Like an article
     *
     * @param Request $request
     * @param UniversityPost $article
     * @return \Illuminate\Http\RedirectResponse
     */
    public function like(Request $request, UniversityPost $article)
    {
        $user = auth()->user();
        
        if ($user) {
            // Toggle like
            if ($article->likes()->where('user_id', $user->id)->exists()) {
                $article->likes()->detach($user->id);
            } else {
                $article->likes()->attach($user->id);
            }
        }
        
        return back()->with('message', 'Article liked!');
    }
}
