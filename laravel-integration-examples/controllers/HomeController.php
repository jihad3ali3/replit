<?php

namespace App\Http\Controllers;

use App\Models\University;
use App\Models\UniversityPost;
use Inertia\Inertia;
use Inertia\Response;

/**
 * HomeController - Main landing page controller
 * 
 * This controller handles the home page display, showing featured universities
 * and latest articles to provide an overview of the platform.
 */
class HomeController extends Controller
{
    /**
     * Display the home page with featured universities and latest articles
     *
     * @return Response
     */
    public function index(): Response
    {
        // Fetch top 6 universities ordered by star rating
        $universities = University::with(['images', 'universityMajors.major.college'])
            ->where('status', 'active')
            ->limit(6)
            ->get()
            ->map(function ($university) {
                return [
                    'id' => $university->public_id,
                    'name' => $university->name,
                    'location' => $university->location,
                    'rating' => $university->averageStarSum() ?? 0, // Using Star package
                    'image' => $university->avatar_url ?? '/images/default-university.png',
                    'description' => $university->description,
                ];
            });

        // Fetch latest 6 articles
        $articles = UniversityPost::with(['university'])
            ->latest()
            ->limit(6)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->public_id,
                    'title' => $post->title,
                    'image' => '/images/default-article.png', // No image field in model
                    'universityId' => $post->university->public_id ?? null,
                    'universityName' => $post->university->name ?? '',
                    'date' => $post->created_at->toISOString(),
                    'content' => $post->content,
                ];
            });

        return Inertia::render('Home', [
            'universities' => $universities,
            'articles' => $articles,
        ]);
    }
}
