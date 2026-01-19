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
        // Fetch top 6 universities ordered by rating
        $universities = University::with(['images', 'colleges.majors'])
            ->where('is_active', true)
            ->orderBy('rating', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($university) {
                return [
                    'id' => $university->id,
                    'name' => $university->name_en,
                    'nameAr' => $university->name_ar,
                    'location' => $university->location,
                    'locationAr' => $university->location_ar ?? $university->location,
                    'rating' => $university->rating,
                    'fees' => $university->fees,
                    'image' => $university->images->first()?->url ?? '/images/default-university.png',
                    'description' => $university->description_en,
                    'descriptionAr' => $university->description_ar,
                ];
            });

        // Fetch latest 6 articles
        $articles = UniversityPost::with(['university'])
            ->latest()
            ->limit(6)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'titleAr' => $post->title_ar ?? $post->title,
                    'image' => $post->image ?? '/images/default-article.png',
                    'universityId' => $post->university_id,
                    'universityName' => $post->university->name_en ?? '',
                    'universityNameAr' => $post->university->name_ar ?? '',
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
