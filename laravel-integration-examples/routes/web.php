<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\UniversityController;
use App\Http\Controllers\CollegeController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\GuidanceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/**
 * Web Routes for UniGuide Application
 * 
 * This file contains all the web routes for the UniGuide platform.
 * All routes use Inertia.js to render React components.
 */

// Home Route
Route::get('/', [HomeController::class, 'index'])->name('home');

// University Routes
Route::prefix('universities')->name('universities.')->group(function () {
    Route::get('/', [UniversityController::class, 'index'])->name('index');
    Route::get('/{university}', [UniversityController::class, 'show'])->name('show');
    Route::post('/{university}/rate', [UniversityController::class, 'rate'])
        ->name('rate')
        ->middleware('auth:student');
});

// College and Major Routes
Route::prefix('colleges')->name('colleges.')->group(function () {
    Route::get('/', [CollegeController::class, 'index'])->name('index');
    Route::get('/majors/{major}/universities', [CollegeController::class, 'universitiesByMajor'])
        ->name('majors.universities');
});

// Article Routes
Route::prefix('articles')->name('articles.')->group(function () {
    Route::get('/', [ArticleController::class, 'index'])->name('index');
    Route::get('/{article}', [ArticleController::class, 'show'])->name('show');
    Route::post('/{article}/like', [ArticleController::class, 'like'])
        ->name('like')
        ->middleware('auth:student');
});

// Smart Guidance Route
Route::get('/guidance', function () {
    return Inertia::render('Guidance');
})->name('guidance');

// Alternatively, with a dedicated controller:
// Route::get('/guidance', [GuidanceController::class, 'index'])->name('guidance');
// Route::post('/guidance/recommend', [GuidanceController::class, 'recommend'])->name('guidance.recommend');

// Application Routes
Route::prefix('apply')->name('apply.')->group(function () {
    Route::get('/{university?}', [ApplicationController::class, 'create'])->name('create');
    Route::post('/', [ApplicationController::class, 'store'])->name('store');
});

// Static Pages (if needed)
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

// Authentication routes would be included here
// require __DIR__.'/auth.php';
