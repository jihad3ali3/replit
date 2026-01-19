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
                    'id' => $college->public_id,
                    'name' => $college->name,
                    'image' => '/storage/' . $college->image_path,
                    'majors' => $college->majors->map(function ($major) {
                        return [
                            'id' => $major->public_id,
                            'name' => $major->name,
                            'collegeId' => $major->college->public_id,
                            'description' => $major->description,
                            'designationJobs' => $major->designation_jobs,
                            'studyYears' => $major->study_years,
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
        // Get universities through UniversityMajor
        $universityMajors = $major->universityMajors()
            ->with(['university.images'])
            ->whereHas('university', function ($q) {
                $q->where('status', 'active');
            })
            ->where('published', true)
            ->get();

        $universities = $universityMajors->map(function ($univMajor) {
            $university = $univMajor->university;
            
            return [
                'id' => $university->public_id,
                'name' => $university->name,
                'location' => $university->location,
                'rating' => $university->averageStarSum() ?? 0,
                'image' => $university->avatar_url ?? '/images/default-university.png',
                'fees' => $univMajor->tuition_fee,
                'admissionRate' => $univMajor->admission_rate,
                'studyYears' => $univMajor->study_years,
                'seats' => $univMajor->number_of_seats,
            ];
        })
        ->sortBy('fees')
        ->values();

        return Inertia::render('UniversitiesOfferingMajor', [
            'major' => [
                'id' => $major->public_id,
                'name' => $major->name,
                'description' => $major->description,
                'designationJobs' => $major->designation_jobs,
            ],
            'universities' => $universities,
        ]);
    }
}
