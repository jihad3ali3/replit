<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\University;
use App\Models\UniversityMajor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

/**
 * ApplicationController - Handles university applications
 * 
 * This controller manages the application submission process.
 */
class ApplicationController extends Controller
{
    /**
     * Show the application form
     *
     * @param Request $request
     * @param University|null $university
     * @return Response
     */
    public function create(Request $request, University $university = null): Response
    {
        $universityData = null;
        
        if ($university) {
            $university->load(['universityMajors.major.college']);
            
            // Group majors by college
            $collegesWithMajors = [];
            foreach ($university->universityMajors as $univMajor) {
                if (!$univMajor->major || !$univMajor->major->college || !$univMajor->published) continue;
                
                $college = $univMajor->major->college;
                $collegeId = $college->public_id;
                
                if (!isset($collegesWithMajors[$collegeId])) {
                    $collegesWithMajors[$collegeId] = [
                        'id' => $college->public_id,
                        'name' => $college->name,
                        'majors' => []
                    ];
                }
                
                $collegesWithMajors[$collegeId]['majors'][] = [
                    'id' => $univMajor->public_id, // Use UniversityMajor ID for application
                    'name' => $univMajor->major->name,
                    'tuitionFee' => $univMajor->tuition_fee,
                    'studyYears' => $univMajor->study_years,
                ];
            }
            
            $universityData = [
                'id' => $university->public_id,
                'name' => $university->name,
                'colleges' => array_values($collegesWithMajors),
            ];
        }

        return Inertia::render('Apply', [
            'university' => $universityData,
        ]);
    }

    /**
     * Store a new application
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'universityMajorId' => 'required|exists:university_majors,public_id',
            // Other fields based on your Student model or anonymous applications
        ]);

        $user = Auth::user(); // or Auth::guard('web')->user()
        
        // Find the UniversityMajor
        $universityMajor = UniversityMajor::where('public_id', $validated['universityMajorId'])->firstOrFail();
        
        // Create application
        $application = Application::create([
            'user_id' => $user?->id,
            'student_id' => $user?->student?->id ?? null, // If user has student relation
            'university_major_id' => $universityMajor->id,
            'application_code' => strtoupper(Str::random(10)),
            'status' => Application::STATUS_PROCESSING,
            'is_active' => true,
        ]);

        return redirect()->route('home')->with('message', 'Application submitted successfully! Your application code is: ' . $application->application_code);
    }
}
