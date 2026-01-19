<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\University;
use App\Models\Major;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

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
            $university->load(['colleges.majors']);
            $universityData = [
                'id' => $university->id,
                'name' => $university->name_en,
                'nameAr' => $university->name_ar,
                'colleges' => $university->colleges->map(function ($college) {
                    return [
                        'id' => $college->id,
                        'name' => $college->name_en,
                        'nameAr' => $college->name_ar,
                        'majors' => $college->majors->map(function ($major) {
                            return [
                                'id' => $major->id,
                                'name' => $major->name_en,
                                'nameAr' => $major->name_ar,
                            ];
                        }),
                    ];
                }),
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
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phoneNumber' => 'nullable|string|max:20',
            'universityId' => 'required|exists:universities,id',
            'majorId' => 'required|exists:majors,id',
            'gpa' => 'required|numeric|min:0|max:4',
            'certificate' => 'nullable|string',
            'academicYear' => 'nullable|string',
        ]);

        // Create or update student record
        $student = Auth::guard('student')->user();
        
        if (!$student) {
            // If not authenticated, you might want to create a guest application
            // or require authentication
        }

        // Create application
        $application = Application::create([
            'student_id' => $student?->id,
            'university_id' => $validated['universityId'],
            'major_id' => $validated['majorId'],
            'first_name' => $validated['firstName'],
            'last_name' => $validated['lastName'],
            'email' => $validated['email'],
            'phone_number' => $validated['phoneNumber'],
            'gpa' => $validated['gpa'],
            'certificate' => $validated['certificate'],
            'academic_year' => $validated['academicYear'],
            'status' => 'pending',
        ]);

        return redirect()->route('home')->with('message', 'Application submitted successfully!');
    }
}
