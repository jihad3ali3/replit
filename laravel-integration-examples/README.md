# Laravel Integration Examples

This directory contains ready-to-use Laravel Controllers and Routes for integrating the UniGuide React frontend with a Laravel backend using Inertia.js.

## 📁 Contents

### Controllers (`/controllers`)

All controllers are complete and production-ready:

1. **HomeController.php**
   - Displays featured universities and latest articles
   - Used for the landing page

2. **UniversityController.php**
   - Lists universities with search, filters, and sorting
   - Shows individual university details with colleges, majors, and articles
   - Handles university ratings

3. **CollegeController.php**
   - Lists all colleges with their majors
   - Shows universities offering specific majors

4. **ArticleController.php**
   - Lists articles with filtering and search
   - Displays individual article details
   - Handles article likes

5. **ApplicationController.php**
   - Shows application form
   - Processes application submissions

### Routes (`/routes`)

- **web.php** - Complete route definitions for all features

## 🚀 How to Use

### Option 1: Copy to Existing Laravel Project

1. Copy all controller files to your Laravel project:
   ```bash
   cp laravel-integration-examples/controllers/* [your-laravel-project]/app/Http/Controllers/
   ```

2. Copy the routes file or merge with your existing `routes/web.php`:
   ```bash
   cp laravel-integration-examples/routes/web.php [your-laravel-project]/routes/web.php
   ```

### Option 2: Use with QueenLastVersion

Since QueenLastVersion already has the necessary Models, you can:

1. Copy these controllers to `QueenLastVersion/app/Http/Controllers/`
2. Update `QueenLastVersion/routes/web.php` with the routes
3. Copy the React pages from `client/src/pages/*` to `QueenLastVersion/resources/js/pages/`
4. Copy components from `client/src/components/*` to `QueenLastVersion/resources/js/components/`

## 📋 Required Models

These controllers expect the following Eloquent Models (already available in QueenLastVersion):

- `University`
- `College`
- `Major`
- `UniversityPost`
- `Application`
- `Student`
- `UniversityImage`

## 🔧 Model Relationships Required

### University Model
```php
public function images() // hasMany
public function colleges() // hasMany
public function majors() // belongsToMany with pivot (fees, required_gpa, study_years)
public function posts() // hasMany
```

### College Model
```php
public function university() // belongsTo
public function majors() // hasMany
```

### Major Model
```php
public function college() // belongsTo
public function universities() // belongsToMany with pivot
```

### UniversityPost Model
```php
public function university() // belongsTo
```

## 📝 Database Fields Expected

### Universities Table
- `id`, `name_en`, `name_ar`, `location`, `location_ar`, `rating`, `fees`
- `description_en`, `description_ar`, `is_active`

### Colleges Table
- `id`, `name_en`, `name_ar`, `university_id`, `image`

### Majors Table
- `id`, `name_en`, `name_ar`, `college_id`, `description_en`, `description_ar`

### University_Major Pivot Table
- `university_id`, `major_id`, `fees`, `required_gpa`, `study_years`

### University_Posts Table
- `id`, `title`, `title_ar`, `content`, `image`, `university_id`, `likes_count`

### Applications Table
- `id`, `student_id`, `university_id`, `major_id`, `first_name`, `last_name`
- `email`, `phone_number`, `gpa`, `certificate`, `academic_year`, `status`

## 🎯 Features Implemented

✅ **Universities**
- Listing with pagination
- Search by name/location
- Filter by rating and fees
- Sort by rating, fees, name
- Detailed view with colleges, majors, and articles

✅ **Colleges & Majors**
- Browse all colleges with majors
- Find universities offering specific majors
- Sort by cost

✅ **Articles**
- List with filtering
- Search functionality
- Like system

✅ **Applications**
- Application form
- Validation
- Submission handling

✅ **Smart Guidance**
- Route prepared (implement recommendation logic as needed)

## 🔄 Next Steps

1. **Copy files to your Laravel project**
2. **Run migrations** (if using QueenLastVersion, already done)
3. **Update React pages** to work with Inertia.js (see MERGE_GUIDE.md)
4. **Test the integration**
5. **Customize as needed**

## 📚 Additional Resources

- See `MERGE_GUIDE.md` for complete integration steps
- See `LARAVEL_INTEGRATION.md` for Laravel setup from scratch
- QueenLastVersion repository: https://github.com/jihad3ali3/QueenLastVersion

## 🛠️ Customization

These controllers are templates. You may need to:

- Adjust field names to match your database
- Add authentication logic
- Implement additional features (ratings, likes, etc.)
- Add validation rules
- Customize data transformations

---

**Note**: These are working examples compatible with the QueenLastVersion backend structure.
