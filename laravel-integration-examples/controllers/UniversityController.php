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
        $query = University::with(['images', 'universityMajors'])
            ->where('status', 'active');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by location
        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        // Filter by minimum tuition fee (from university majors)
        if ($request->filled('maxFees')) {
            $query->whereHas('universityMajors', function ($q) use ($request) {
                $q->where('tuition_fee', '<=', $request->maxFees);
            });
        }

        // Sorting
        $sortBy = $request->get('sort', 'name');
        $sortDirection = $request->get('direction', 'asc');
        
        switch ($sortBy) {
            case 'name':
                $query->orderBy('name', $sortDirection);
                break;
            default:
                $query->orderBy('name', 'asc');
        }

        // Paginate results
        $universities = $query->paginate(12)->through(function ($university) {
            $minFee = $university->universityMajors->min('tuition_fee') ?? 0;
            
            return [
                'id' => $university->public_id,
                'name' => $university->name,
                'location' => $university->location,
                'rating' => $university->averageStarSum() ?? 0,
                'fees' => $minFee,
                'image' => $university->avatar_url ?? '/images/default-university.png',
                'description' => $university->description,
            ];
        });

        return Inertia::render('Universities', [
            'universities' => $universities,
            'filters' => $request->only(['search', 'location', 'maxFees', 'sort', 'direction']),
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
            'universityMajors.major.college',
            'universityPosts' => function ($query) {
                $query->latest()->limit(5);
            }
        ]);

        // Group majors by college
        $collegesWithMajors = [];
        foreach ($university->universityMajors as $univMajor) {
            if (!$univMajor->major || !$univMajor->major->college) continue;
            
            $college = $univMajor->major->college;
            $collegeId = $college->public_id;
            
            if (!isset($collegesWithMajors[$collegeId])) {
                $collegesWithMajors[$collegeId] = [
                    'id' => $college->public_id,
                    'name' => $college->name,
                    'image' => '/storage/' . $college->image_path,
                    'majors' => []
                ];
            }
            
            $collegesWithMajors[$collegeId]['majors'][] = [
                'id' => $univMajor->major->public_id,
                'name' => $univMajor->major->name,
                'description' => $univMajor->major->description,
                'years' => $univMajor->study_years,
                'fees' => $univMajor->tuition_fee,
                'seats' => $univMajor->number_of_seats,
                'admissionRate' => $univMajor->admission_rate,
            ];
        }

        // Format university data
        $universityData = [
            'id' => $university->public_id,
            'name' => $university->name,
            'location' => $university->location,
            'rating' => $university->averageStarSum() ?? 0,
            'description' => $university->description,
            'images' => $university->images->map(fn($img) => '/storage/' . $img->image_path),
            'colleges' => array_values($collegesWithMajors),
            'articles' => $university->universityPosts->map(function ($post) {
                return [
                    'id' => $post->public_id,
                    'title' => $post->title,
                    'image' => '/images/default-article.png',
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

        // Using JobMetric\Star package that QueenLastVersion has
        $user = auth()->user(); // or auth()->guard('web')->user()
        if ($user) {
            $university->setStar($user, $request->rating);
        }
        
        return back()->with('message', 'Rating submitted successfully!');
    }
}
