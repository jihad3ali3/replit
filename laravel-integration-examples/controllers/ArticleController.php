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

        // Filter by university
        if ($request->filled('university')) {
            $query->where('university_id', $request->university);
        }

        // Search in title
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('title_ar', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Sort by date or likes
        $sortBy = $request->get('sort', 'date');
        if ($sortBy === 'likes') {
            $query->orderBy('likes_count', 'desc');
        } else {
            $query->latest();
        }

        // Paginate results
        $articles = $query->paginate(12)->through(function ($post) {
            return [
                'id' => $post->id,
                'title' => $post->title,
                'titleAr' => $post->title_ar ?? $post->title,
                'image' => $post->image ?? '/images/default-article.png',
                'universityId' => $post->university_id,
                'universityName' => $post->university->name_en ?? '',
                'universityNameAr' => $post->university->name_ar ?? '',
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

        return Inertia::render('ArticleDetail', [
            'article' => [
                'id' => $article->id,
                'title' => $article->title,
                'titleAr' => $article->title_ar ?? $article->title,
                'content' => $article->content,
                'image' => $article->image,
                'universityId' => $article->university_id,
                'universityName' => $article->university->name_en ?? '',
                'universityNameAr' => $article->university->name_ar ?? '',
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
        // Implement like logic here
        // For example, toggle like for the authenticated user
        
        return back()->with('message', 'Article liked!');
    }
}
