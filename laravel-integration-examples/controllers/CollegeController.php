<?php

namespace App\Http\Controllers;

use App\Models\College;
use App\Models\Major;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * CollegeController - Handles college and major browsing
 * 
 * This controller manages the colleges listing and major exploration features.
 */
class CollegeController extends Controller
{
    /**
     * Display a listing of colleges with their majors
     *
     * @return Response
     */
    public function index(): Response
    {
        $colleges = College::with(['majors'])
            ->get()
            ->map(function ($college) {
                return [
                    'id' => $college->id,
                    'name' => $college->name_en,
                    'nameAr' => $college->name_ar,
                    'image' => $college->image ?? '/images/default-college.png',
                    'majors' => $college->majors->map(function ($major) {
                        return [
                            'id' => $major->id,
                            'name' => $major->name_en,
                            'nameAr' => $major->name_ar,
                            'collegeId' => $major->college_id,
                            'description' => $major->description_en,
                            'descriptionAr' => $major->description_ar,
                        ];
                    }),
                ];
            });

        return Inertia::render('Colleges', [
            'colleges' => $colleges,
        ]);
    }

    /**
     * Display universities offering a specific major
     *
     * @param Major $major
     * @return Response
     */
    public function universitiesByMajor(Major $major): Response
    {
        $universities = $major->universities()
            ->with(['images'])
            ->where('is_active', true)
            ->get()
            ->map(function ($university) use ($major) {
                $pivot = $university->pivot;
                
                return [
                    'id' => $university->id,
                    'name' => $university->name_en,
                    'nameAr' => $university->name_ar,
                    'location' => $university->location,
                    'locationAr' => $university->location_ar ?? $university->location,
                    'rating' => $university->rating,
                    'image' => $university->images->first()?->url ?? '/images/default-university.png',
                    'fees' => $pivot->fees ?? $university->fees,
                    'requiredGpa' => $pivot->required_gpa ?? 0,
                    'studyYears' => $pivot->study_years ?? 4,
                ];
            })
            ->sortBy('fees')
            ->values();

        return Inertia::render('UniversitiesOfferingMajor', [
            'major' => [
                'id' => $major->id,
                'name' => $major->name_en,
                'nameAr' => $major->name_ar,
                'description' => $major->description_en,
                'descriptionAr' => $major->description_ar,
            ],
            'universities' => $universities,
        ]);
    }
}
