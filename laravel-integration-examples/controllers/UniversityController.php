<?php

namespace App\Http\Controllers;

use App\Models\University;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * UniversityController - Handles university browsing and details
 * 
 * This controller manages the university listing page with search, filters,
 * and sorting, as well as individual university detail pages.
 */
class UniversityController extends Controller
{
    /**
     * Display a listing of universities with search and filters
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $query = University::with(['images', 'colleges'])
            ->where('is_active', true);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name_en', 'like', "%{$search}%")
                  ->orWhere('name_ar', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        // Filter by location
        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // Filter by minimum rating
        if ($request->filled('minRating')) {
            $query->where('rating', '>=', $request->minRating);
        }

        // Filter by maximum fees
        if ($request->filled('maxFees')) {
            $query->where('fees', '<=', $request->maxFees);
        }

        // Sorting
        $sortBy = $request->get('sort', 'rating');
        $sortDirection = $request->get('direction', 'desc');
        
        switch ($sortBy) {
            case 'rating':
                $query->orderBy('rating', $sortDirection);
                break;
            case 'fees':
                $query->orderBy('fees', $sortDirection === 'desc' ? 'desc' : 'asc');
                break;
            case 'name':
                $query->orderBy('name_en', $sortDirection);
                break;
            default:
                $query->orderBy('rating', 'desc');
        }

        // Paginate results
        $universities = $query->paginate(12)->through(function ($university) {
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

        return Inertia::render('Universities', [
            'universities' => $universities,
            'filters' => $request->only(['search', 'location', 'minRating', 'maxFees', 'sort', 'direction']),
        ]);
    }

    /**
     * Display the specified university with full details
     *
     * @param University $university
     * @return Response
     */
    public function show(University $university): Response
    {
        // Load all related data
        $university->load([
            'images',
            'colleges.majors' => function ($query) {
                $query->withPivot(['fees', 'required_gpa', 'study_years']);
            },
            'posts' => function ($query) {
                $query->latest()->limit(5);
            }
        ]);

        // Format university data
        $universityData = [
            'id' => $university->id,
            'name' => $university->name_en,
            'nameAr' => $university->name_ar,
            'location' => $university->location,
            'locationAr' => $university->location_ar ?? $university->location,
            'rating' => $university->rating,
            'fees' => $university->fees,
            'description' => $university->description_en,
            'descriptionAr' => $university->description_ar,
            'images' => $university->images->map(fn($img) => $img->url),
            'colleges' => $university->colleges->map(function ($college) {
                return [
                    'id' => $college->id,
                    'name' => $college->name_en,
                    'nameAr' => $college->name_ar,
                    'image' => $college->image,
                    'majors' => $college->majors->map(function ($major) {
                        return [
                            'id' => $major->id,
                            'name' => $major->name_en,
                            'nameAr' => $major->name_ar,
                            'description' => $major->description_en,
                            'descriptionAr' => $major->description_ar,
                            'years' => $major->pivot->study_years ?? 4,
                            'fees' => $major->pivot->fees ?? 0,
                            'gpa' => $major->pivot->required_gpa ?? 0,
                        ];
                    }),
                ];
            }),
            'articles' => $university->posts->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'titleAr' => $post->title_ar ?? $post->title,
                    'image' => $post->image,
                    'date' => $post->created_at->toISOString(),
                    'content' => $post->content,
                ];
            }),
        ];

        return Inertia::render('UniversityDetails', [
            'university' => $universityData,
        ]);
    }

    /**
     * Submit user rating for a university
     *
     * @param Request $request
     * @param University $university
     * @return \Illuminate\Http\RedirectResponse
     */
    public function rate(Request $request, University $university)
    {
        $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
        ]);

        // Here you would implement the rating logic
        // For example, saving to a ratings table and recalculating average
        
        return back()->with('message', 'Rating submitted successfully!');
    }
}
