# دمج المشروع مع Laravel 12 باستخدام Inertia.js
# Laravel 12 Integration with Inertia.js

[العربية](#arabic) | [English](#english)

---

## Arabic

<div dir="rtl">

### 📋 نظرة عامة

هذا الدليل يشرح كيفية دمج الواجهة الأمامية React الحالية مع Laravel 12 باستخدام Inertia.js. سيسمح لك هذا باستخدام Laravel كـ backend مع الحفاظ على واجهة React الموجودة.

### 🎯 ما هو Inertia.js؟

Inertia.js هو إطار عمل يسمح لك ببناء تطبيقات صفحة واحدة (SPA) باستخدام كلاسيكي server-side routing و controllers. بدلاً من بناء API منفصل، يمكنك:
- استخدام Laravel controllers و routing
- إرسال البيانات مباشرة من Controllers إلى React components
- الحفاظ على جميع مزايا SPA (بدون إعادة تحميل الصفحة)

### 📦 الخطوة 1: إعداد Laravel 12

#### تثبيت Laravel

```bash
composer create-project laravel/laravel uniguide-backend
cd uniguide-backend
```

#### تثبيت Inertia.js للـ Laravel

```bash
composer require inertiajs/inertia-laravel
```

#### نشر ملف التكوين

```bash
php artisan inertia:middleware
```

#### إضافة Middleware

في `app/Http/Kernel.php` أو `bootstrap/app.php` (Laravel 11+)، أضف:

```php
'web' => [
    // ...
    \App\Http\Middleware\HandleInertiaRequests::class,
],
```

#### إنشاء HandleInertiaRequests Middleware

```bash
php artisan make:middleware HandleInertiaRequests
```

في `app/Http/Middleware/HandleInertiaRequests.php`:

```php
<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message')
            ],
        ]);
    }
}
```

### 📦 الخطوة 2: إعداد React Frontend

#### تثبيت Inertia.js للـ React

في مجلد المشروع الحالي:

```bash
npm install @inertiajs/react @inertiajs/inertia
```

#### تعديل `client/src/main.tsx`

استبدل المحتوى بالكود التالي:

```tsx
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import './index.css';

const appName = import.meta.env.VITE_APP_NAME || 'UniGuide';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(
    `./pages/${name}.tsx`,
    import.meta.glob('./pages/**/*.tsx')
  ),
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
  progress: {
    color: '#4B5563',
  },
});
```

#### تعديل `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    laravel({
      input: 'client/src/main.tsx',
      refresh: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@assets': path.resolve(__dirname, './attached_assets'),
    },
  },
});
```

### 📦 الخطوة 3: إعادة هيكلة المكونات

#### تحويل Pages إلى Inertia Pages

بدلاً من استخدام React Router (Wouter)، كل صفحة ستستقبل البيانات من Laravel:

**مثال: `client/src/pages/Home.tsx`**

```tsx
import { Head } from '@inertiajs/react';
import { Layout } from '@/components/layout/Layout';
import { University, Article } from '@/lib/types';

interface HomeProps {
  universities: University[];
  articles: Article[];
}

export default function Home({ universities, articles }: HomeProps) {
  return (
    <>
      <Head title="Home" />
      <Layout>
        {/* محتوى الصفحة الحالي */}
        <div>
          {universities.map(uni => (
            <div key={uni.id}>{uni.name}</div>
          ))}
        </div>
      </Layout>
    </>
  );
}
```

#### استخدام Inertia Links بدلاً من Wouter

استبدل `<Link>` من wouter بـ `<Link>` من Inertia:

```tsx
import { Link } from '@inertiajs/react';

// بدلاً من
// import { Link } from 'wouter';

<Link href="/universities">استكشف الجامعات</Link>
```

### 📦 الخطوة 4: إنشاء Laravel Controllers و Routes

#### إنشاء Controllers

```bash
php artisan make:controller UniversityController
php artisan make:controller CollegeController
php artisan make:controller ArticleController
```

#### مثال Controller: `app/Http/Controllers/UniversityController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\University;
use Inertia\Inertia;
use Illuminate\Http\Request;

class UniversityController extends Controller
{
    public function index()
    {
        $universities = University::with('colleges.majors')
            ->paginate(12);

        return Inertia::render('Universities', [
            'universities' => $universities
        ]);
    }

    public function show($id)
    {
        $university = University::with(['colleges.majors', 'articles'])
            ->findOrFail($id);

        return Inertia::render('UniversityDetails', [
            'university' => $university
        ]);
    }
}
```

#### Routes: `routes/web.php`

```php
<?php

use App\Http\Controllers\UniversityController;
use App\Http\Controllers\CollegeController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// الصفحة الرئيسية
Route::get('/', [HomeController::class, 'index'])->name('home');

// الجامعات
Route::get('/universities', [UniversityController::class, 'index'])->name('universities.index');
Route::get('/universities/{id}', [UniversityController::class, 'show'])->name('universities.show');

// الكليات
Route::get('/colleges', [CollegeController::class, 'index'])->name('colleges.index');
Route::get('/colleges/{id}/majors', [CollegeController::class, 'majors'])->name('colleges.majors');

// المقالات
Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
Route::get('/articles/{id}', [ArticleController::class, 'show'])->name('articles.show');

// التوجيه الذكي
Route::get('/guidance', function () {
    return Inertia::render('Guidance');
})->name('guidance');

// التقديم
Route::get('/apply/{uniId?}', function ($uniId = null) {
    return Inertia::render('Apply', [
        'universityId' => $uniId
    ]);
})->name('apply');

Route::post('/apply', [UniversityController::class, 'submitApplication'])
    ->name('apply.submit');
```

### 📦 الخطوة 5: إنشاء Laravel Models

#### Models الأساسية

```bash
php artisan make:model University -m
php artisan make:model College -m
php artisan make:model Major -m
php artisan make:model Article -m
```

#### مثال Model: `app/Models/University.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class University extends Model
{
    protected $fillable = [
        'name',
        'name_ar',
        'location',
        'location_ar',
        'rating',
        'fees',
        'image',
        'description',
        'description_ar',
    ];

    protected $casts = [
        'rating' => 'float',
        'fees' => 'integer',
    ];

    public function colleges(): HasMany
    {
        return $this->hasMany(College::class);
    }

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }
}
```

### 📦 الخطوة 6: Migrations

#### مثال Migration: `database/migrations/xxxx_create_universities_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('universities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('name_ar');
            $table->string('location');
            $table->string('location_ar');
            $table->decimal('rating', 2, 1)->default(0);
            $table->integer('fees')->default(0);
            $table->string('image')->nullable();
            $table->text('description');
            $table->text('description_ar');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('universities');
    }
};
```

### 📦 الخطوة 7: إعداد Laravel View

أنشئ `resources/views/app.blade.php`:

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name', 'UniGuide') }}</title>

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['client/src/main.tsx'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
```

### 📦 الخطوة 8: هيكل المجلدات النهائي

```
uniguide-backend/           # Laravel backend
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── UniversityController.php
│   │   │   ├── CollegeController.php
│   │   │   └── ArticleController.php
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php
│   └── Models/
│       ├── University.php
│       ├── College.php
│       ├── Major.php
│       └── Article.php
├── database/
│   └── migrations/
├── routes/
│   └── web.php
├── resources/
│   └── views/
│       └── app.blade.php
├── client/                 # React frontend (من المشروع الحالي)
│   └── src/
│       ├── pages/          # Inertia pages
│       ├── components/
│       └── main.tsx
├── vite.config.ts
└── package.json
```

### 🚀 الخطوة 9: تشغيل المشروع

#### تثبيت Dependencies

```bash
# Laravel dependencies
composer install

# Node dependencies
npm install
```

#### تشغيل Migrations

```bash
php artisan migrate
```

#### تشغيل Development Servers

في terminal أول:
```bash
php artisan serve
```

في terminal ثاني:
```bash
npm run dev
```

الآن التطبيق يعمل على `http://localhost:8000`

### 📋 نقل البيانات من Mock Data

يمكنك إنشاء Seeder لنقل البيانات التجريبية:

```bash
php artisan make:seeder UniversitySeeder
```

في `database/seeders/UniversitySeeder.php`:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\University;

class UniversitySeeder extends Seeder
{
    public function run(): void
    {
        $universities = [
            [
                'name' => 'King Saud University',
                'name_ar' => 'جامعة الملك سعود',
                'location' => 'Riyadh, Saudi Arabia',
                'location_ar' => 'الرياض، المملكة العربية السعودية',
                'rating' => 4.8,
                'fees' => 0,
                'image' => '/images/universities/ksu.png',
                'description' => 'A premier public university in Riyadh...',
                'description_ar' => 'جامعة حكومية رائدة في الرياض...',
            ],
            // المزيد من الجامعات...
        ];

        foreach ($universities as $university) {
            University::create($university);
        }
    }
}
```

تشغيل Seeder:
```bash
php artisan db:seed --class=UniversitySeeder
```

### ✨ المزايا

1. **Server-Side Rendering**: بيانات من Laravel مباشرة
2. **Type Safety**: استخدام TypeScript مع Laravel props
3. **SEO Friendly**: محتوى يتم تحميله من الخادم
4. **Authentication**: استخدام نظام Laravel Auth
5. **Database**: قوة Eloquent ORM
6. **Validation**: Laravel Form Requests
7. **APIs**: سهولة إنشاء APIs للموبايل لاحقاً

### 🔧 التخصيصات الإضافية

#### إضافة Authentication

```bash
composer require laravel/breeze --dev
php artisan breeze:install react
```

#### إضافة Pagination Component

```tsx
import { Link } from '@inertiajs/react';

export function Pagination({ links }) {
  return (
    <div className="flex gap-2">
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.url}
          className={link.active ? 'font-bold' : ''}
          dangerouslySetInnerHTML={{ __html: link.label }}
        />
      ))}
    </div>
  );
}
```

### 📚 مصادر مفيدة

- [Inertia.js Documentation](https://inertiajs.com/)
- [Laravel 12 Documentation](https://laravel.com/docs/12.x)
- [Laravel Inertia Package](https://github.com/inertiajs/inertia-laravel)
- [Inertia React Adapter](https://github.com/inertiajs/inertia/tree/master/packages/react)

</div>

---

## English

### 📋 Overview

This guide explains how to integrate the current React frontend with Laravel 12 using Inertia.js. This will allow you to use Laravel as your backend while maintaining your existing React interface.

### 🎯 What is Inertia.js?

Inertia.js is a framework that allows you to build single-page applications (SPAs) using classic server-side routing and controllers. Instead of building a separate API, you can:
- Use Laravel controllers and routing
- Pass data directly from Controllers to React components
- Maintain all SPA benefits (no page reloads)

### 📦 Step 1: Setup Laravel 12

#### Install Laravel

```bash
composer create-project laravel/laravel uniguide-backend
cd uniguide-backend
```

#### Install Inertia.js for Laravel

```bash
composer require inertiajs/inertia-laravel
```

#### Publish Configuration

```bash
php artisan inertia:middleware
```

#### Add Middleware

In `app/Http/Kernel.php` or `bootstrap/app.php` (Laravel 11+), add:

```php
'web' => [
    // ...
    \App\Http\Middleware\HandleInertiaRequests::class,
],
```

#### Create HandleInertiaRequests Middleware

```bash
php artisan make:middleware HandleInertiaRequests
```

In `app/Http/Middleware/HandleInertiaRequests.php`:

```php
<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message')
            ],
        ]);
    }
}
```

### 📦 Step 2: Setup React Frontend

#### Install Inertia.js for React

In the current project folder:

```bash
npm install @inertiajs/react @inertiajs/inertia
```

#### Modify `client/src/main.tsx`

Replace content with:

```tsx
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import './index.css';

const appName = import.meta.env.VITE_APP_NAME || 'UniGuide';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(
    `./pages/${name}.tsx`,
    import.meta.glob('./pages/**/*.tsx')
  ),
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
  progress: {
    color: '#4B5563',
  },
});
```

#### Modify `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    laravel({
      input: 'client/src/main.tsx',
      refresh: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@assets': path.resolve(__dirname, './attached_assets'),
    },
  },
});
```

### 📦 Step 3: Restructure Components

#### Convert Pages to Inertia Pages

Instead of using React Router (Wouter), each page will receive data from Laravel:

**Example: `client/src/pages/Home.tsx`**

```tsx
import { Head } from '@inertiajs/react';
import { Layout } from '@/components/layout/Layout';
import { University, Article } from '@/lib/types';

interface HomeProps {
  universities: University[];
  articles: Article[];
}

export default function Home({ universities, articles }: HomeProps) {
  return (
    <>
      <Head title="Home" />
      <Layout>
        {/* Your existing page content */}
        <div>
          {universities.map(uni => (
            <div key={uni.id}>{uni.name}</div>
          ))}
        </div>
      </Layout>
    </>
  );
}
```

#### Use Inertia Links Instead of Wouter

Replace `<Link>` from wouter with `<Link>` from Inertia:

```tsx
import { Link } from '@inertiajs/react';

// Instead of
// import { Link } from 'wouter';

<Link href="/universities">Explore Universities</Link>
```

### 📦 Step 4: Create Laravel Controllers & Routes

#### Create Controllers

```bash
php artisan make:controller UniversityController
php artisan make:controller CollegeController
php artisan make:controller ArticleController
```

#### Example Controller: `app/Http/Controllers/UniversityController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\University;
use Inertia\Inertia;
use Illuminate\Http\Request;

class UniversityController extends Controller
{
    public function index()
    {
        $universities = University::with('colleges.majors')
            ->paginate(12);

        return Inertia::render('Universities', [
            'universities' => $universities
        ]);
    }

    public function show($id)
    {
        $university = University::with(['colleges.majors', 'articles'])
            ->findOrFail($id);

        return Inertia::render('UniversityDetails', [
            'university' => $university
        ]);
    }
}
```

#### Routes: `routes/web.php`

```php
<?php

use App\Http\Controllers\UniversityController;
use App\Http\Controllers\CollegeController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home page
Route::get('/', [HomeController::class, 'index'])->name('home');

// Universities
Route::get('/universities', [UniversityController::class, 'index'])->name('universities.index');
Route::get('/universities/{id}', [UniversityController::class, 'show'])->name('universities.show');

// Colleges
Route::get('/colleges', [CollegeController::class, 'index'])->name('colleges.index');
Route::get('/colleges/{id}/majors', [CollegeController::class, 'majors'])->name('colleges.majors');

// Articles
Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
Route::get('/articles/{id}', [ArticleController::class, 'show'])->name('articles.show');

// Smart Guidance
Route::get('/guidance', function () {
    return Inertia::render('Guidance');
})->name('guidance');

// Apply
Route::get('/apply/{uniId?}', function ($uniId = null) {
    return Inertia::render('Apply', [
        'universityId' => $uniId
    ]);
})->name('apply');

Route::post('/apply', [UniversityController::class, 'submitApplication'])
    ->name('apply.submit');
```

### 📦 Step 5: Create Laravel Models

#### Basic Models

```bash
php artisan make:model University -m
php artisan make:model College -m
php artisan make:model Major -m
php artisan make:model Article -m
```

#### Example Model: `app/Models/University.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class University extends Model
{
    protected $fillable = [
        'name',
        'name_ar',
        'location',
        'location_ar',
        'rating',
        'fees',
        'image',
        'description',
        'description_ar',
    ];

    protected $casts = [
        'rating' => 'float',
        'fees' => 'integer',
    ];

    public function colleges(): HasMany
    {
        return $this->hasMany(College::class);
    }

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }
}
```

### 📦 Step 6: Migrations

#### Example Migration: `database/migrations/xxxx_create_universities_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('universities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('name_ar');
            $table->string('location');
            $table->string('location_ar');
            $table->decimal('rating', 2, 1)->default(0);
            $table->integer('fees')->default(0);
            $table->string('image')->nullable();
            $table->text('description');
            $table->text('description_ar');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('universities');
    }
};
```

### 📦 Step 7: Setup Laravel View

Create `resources/views/app.blade.php`:

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title inertia>{{ config('app.name', 'UniGuide') }}</title>

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['client/src/main.tsx'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
```

### 📦 Step 8: Final Folder Structure

```
uniguide-backend/           # Laravel backend
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── UniversityController.php
│   │   │   ├── CollegeController.php
│   │   │   └── ArticleController.php
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php
│   └── Models/
│       ├── University.php
│       ├── College.php
│       ├── Major.php
│       └── Article.php
├── database/
│   └── migrations/
├── routes/
│   └── web.php
├── resources/
│   └── views/
│       └── app.blade.php
├── client/                 # React frontend (from current project)
│   └── src/
│       ├── pages/          # Inertia pages
│       ├── components/
│       └── main.tsx
├── vite.config.ts
└── package.json
```

### 🚀 Step 9: Running the Project

#### Install Dependencies

```bash
# Laravel dependencies
composer install

# Node dependencies
npm install
```

#### Run Migrations

```bash
php artisan migrate
```

#### Run Development Servers

In first terminal:
```bash
php artisan serve
```

In second terminal:
```bash
npm run dev
```

Now the app runs on `http://localhost:8000`

### 📋 Migrating Data from Mock Data

You can create a Seeder to migrate the mock data:

```bash
php artisan make:seeder UniversitySeeder
```

In `database/seeders/UniversitySeeder.php`:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\University;

class UniversitySeeder extends Seeder
{
    public function run(): void
    {
        $universities = [
            [
                'name' => 'King Saud University',
                'name_ar' => 'جامعة الملك سعود',
                'location' => 'Riyadh, Saudi Arabia',
                'location_ar' => 'الرياض، المملكة العربية السعودية',
                'rating' => 4.8,
                'fees' => 0,
                'image' => '/images/universities/ksu.png',
                'description' => 'A premier public university in Riyadh...',
                'description_ar' => 'جامعة حكومية رائدة في الرياض...',
            ],
            // More universities...
        ];

        foreach ($universities as $university) {
            University::create($university);
        }
    }
}
```

Run Seeder:
```bash
php artisan db:seed --class=UniversitySeeder
```

### ✨ Benefits

1. **Server-Side Rendering**: Data directly from Laravel
2. **Type Safety**: Use TypeScript with Laravel props
3. **SEO Friendly**: Content loaded from server
4. **Authentication**: Use Laravel Auth system
5. **Database**: Power of Eloquent ORM
6. **Validation**: Laravel Form Requests
7. **APIs**: Easy to create APIs for mobile later

### 🔧 Additional Customizations

#### Add Authentication

```bash
composer require laravel/breeze --dev
php artisan breeze:install react
```

#### Add Pagination Component

```tsx
import { Link } from '@inertiajs/react';

export function Pagination({ links }) {
  return (
    <div className="flex gap-2">
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.url}
          className={link.active ? 'font-bold' : ''}
          dangerouslySetInnerHTML={{ __html: link.label }}
        />
      ))}
    </div>
  );
}
```

### 📚 Useful Resources

- [Inertia.js Documentation](https://inertiajs.com/)
- [Laravel 12 Documentation](https://laravel.com/docs/12.x)
- [Laravel Inertia Package](https://github.com/inertiajs/inertia-laravel)
- [Inertia React Adapter](https://github.com/inertiajs/inertia/tree/master/packages/react)

---

**Happy Coding! 🚀**
