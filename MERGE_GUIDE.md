# دمج مشروع UniGuide مع QueenLastVersion
# Merging UniGuide Project with QueenLastVersion

[العربية](#arabic) | [English](#english)

---

## Arabic

<div dir="rtl">

### 📋 نظرة عامة

هذا الدليل يشرح كيفية دمج مشروع **UniGuide** (المشروع الحالي - React Frontend) مع مشروع **QueenLastVersion** (Laravel 12 Backend مع Inertia.js). المشروعان متكاملان:

- **UniGuide (المشروع الحالي)**: واجهة React كاملة للطلاب لاستكشاف الجامعات
- **QueenLastVersion**: Laravel 12 Backend مع قاعدة البيانات والـ Models الجاهزة

### 🎯 ما يحتويه QueenLastVersion

المشروع يحتوي على:
- ✅ **Laravel 12** مع Inertia.js مُعد بالكامل
- ✅ **Models جاهزة**: University, College, Major, UniversityPost, Application, Student
- ✅ **نظام مصادقة** (Laravel Fortify)
- ✅ **لوحة تحكم إدارية** (Filament)
- ✅ **React + TypeScript** في `resources/js`
- ✅ **Tailwind CSS 4** و Radix UI Components
- ✅ **Database Migrations** جاهزة

### 🔄 استراتيجية الدمج

هناك خياران للدمج:

#### الخيار 1: نقل واجهة UniGuide إلى QueenLastVersion (موصى به ⭐)
نقل جميع صفحات ومكونات UniGuide إلى مجلد `resources/js` في QueenLastVersion.

#### الخيار 2: إضافة Backend من QueenLastVersion إلى UniGuide
نسخ Models و Controllers من QueenLastVersion إلى المشروع الحالي.

**سنتبع الخيار 1** لأنه الأسهل والأكثر فعالية.

---

## خطوات الدمج

### 📦 الخطوة 1: استنساخ QueenLastVersion

```bash
# في مجلد جديد
git clone https://github.com/jihad3ali3/QueenLastVersion.git
cd QueenLastVersion
```

### 📦 الخطوة 2: تثبيت Dependencies

```bash
# تثبيت Composer dependencies
composer install

# تثبيت NPM dependencies
npm install
```

### 📦 الخطوة 3: إعداد البيئة

```bash
# نسخ ملف البيئة
cp .env.example .env

# توليد Application Key
php artisan key:generate

# إعداد قاعدة البيانات في .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=uniguide
# DB_USERNAME=root
# DB_PASSWORD=
```

### 📦 الخطوة 4: تشغيل Migrations

```bash
php artisan migrate
```

### 📦 الخطوة 5: نقل صفحات UniGuide

الآن ننقل صفحات ومكونات UniGuide إلى QueenLastVersion:

#### نقل المكونات

```bash
# في مجلد UniGuide الحالي، انسخ المكونات
cp -r client/src/components/* [path-to-QueenLastVersion]/resources/js/components/

# انسخ الصفحات
cp -r client/src/pages/* [path-to-QueenLastVersion]/resources/js/pages/

# انسخ السياقات
cp -r client/src/contexts/* [path-to-QueenLastVersion]/resources/js/

# انسخ الـ hooks
cp -r client/src/hooks/* [path-to-QueenLastVersion]/resources/js/hooks/

# انسخ المكتبات المساعدة
cp -r client/src/lib/* [path-to-QueenLastVersion]/resources/js/lib/
```

#### نقل الأصول (Assets)

```bash
# انسخ الصور
cp -r attached_assets/* [path-to-QueenLastVersion]/public/images/
```

### 📦 الخطوة 6: تحديث الصفحات لتعمل مع Inertia

كل صفحة في UniGuide تحتاج تعديل بسيط:

**مثال: تحويل `Home.tsx`**

**قبل (UniGuide - Wouter):**
```tsx
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  // ...
}
```

**بعد (QueenLastVersion - Inertia):**
```tsx
import { Link, Head } from "@inertiajs/react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HomeProps {
  universities?: University[];
  articles?: Article[];
}

export default function Home({ universities = [], articles = [] }: HomeProps) {
  const { t } = useLanguage();
  
  return (
    <>
      <Head title={t('home')} />
      {/* باقي الكود */}
    </>
  );
}
```

**التغييرات المطلوبة:**
1. ✅ استبدال `import { Link } from "wouter"` بـ `import { Link } from "@inertiajs/react"`
2. ✅ إضافة `Head` من `@inertiajs/react`
3. ✅ إضافة Props interface لاستقبال البيانات من Laravel
4. ✅ استخدام البيانات من Props بدلاً من mockData

### 📦 الخطوة 7: إنشاء Controllers في Laravel

الآن نحتاج إنشاء Controllers لإرسال البيانات للصفحات:

#### HomeController

```bash
php artisan make:controller HomeController
```

في `app/Http/Controllers/HomeController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\University;
use App\Models\UniversityPost;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $universities = University::with(['images', 'colleges.majors'])
            ->where('is_active', true)
            ->orderBy('rating', 'desc')
            ->limit(6)
            ->get();

        $articles = UniversityPost::with(['university'])
            ->latest()
            ->limit(6)
            ->get();

        return Inertia::render('Home', [
            'universities' => $universities,
            'articles' => $articles,
        ]);
    }
}
```

#### UniversityController

```bash
php artisan make:controller UniversityController
```

في `app/Http/Controllers/UniversityController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\University;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UniversityController extends Controller
{
    public function index(Request $request): Response
    {
        $query = University::with(['images', 'colleges'])
            ->where('is_active', true);

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name_en', 'like', "%{$request->search}%")
                  ->orWhere('name_ar', 'like', "%{$request->search}%");
            });
        }

        // Filter by location
        if ($request->location) {
            $query->where('location', $request->location);
        }

        // Sort by rating or fees
        if ($request->sort === 'rating') {
            $query->orderBy('rating', 'desc');
        } elseif ($request->sort === 'fees') {
            $query->orderBy('fees', 'asc');
        }

        $universities = $query->paginate(12);

        return Inertia::render('Universities', [
            'universities' => $universities,
            'filters' => $request->only(['search', 'location', 'sort']),
        ]);
    }

    public function show(University $university): Response
    {
        $university->load([
            'images',
            'colleges.majors' => function ($query) {
                $query->withPivot(['fees', 'required_gpa', 'study_years']);
            },
            'posts' => function ($query) {
                $query->latest()->limit(5);
            }
        ]);

        return Inertia::render('UniversityDetails', [
            'university' => $university,
        ]);
    }
}
```

### 📦 الخطوة 8: تحديث Routes

في `routes/web.php`:

```php
<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\UniversityController;
use App\Http\Controllers\CollegeController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ApplicationController;
use Illuminate\Support\Facades\Route;

// Home
Route::get('/', [HomeController::class, 'index'])->name('home');

// Universities
Route::get('/universities', [UniversityController::class, 'index'])->name('universities.index');
Route::get('/universities/{university}', [UniversityController::class, 'show'])->name('universities.show');

// Colleges
Route::get('/colleges', [CollegeController::class, 'index'])->name('colleges.index');
Route::get('/colleges/{college}', [CollegeController::class, 'show'])->name('colleges.show');

// Articles
Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
Route::get('/articles/{post}', [ArticleController::class, 'show'])->name('articles.show');

// Smart Guidance
Route::get('/guidance', function () {
    return Inertia::render('Guidance');
})->name('guidance');

// Applications
Route::middleware('auth:student')->group(function () {
    Route::get('/apply/{university?}', [ApplicationController::class, 'create'])->name('apply.create');
    Route::post('/apply', [ApplicationController::class, 'store'])->name('apply.store');
});

// Authentication routes (already exist in QueenLastVersion)
require __DIR__.'/auth.php';
```

### 📦 الخطوة 9: تحديث App.tsx

في `resources/js/app.tsx` (QueenLastVersion)، تأكد من إعدادها بشكل صحيح:

```tsx
import '../css/app.css';
import './bootstrap';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'UniGuide';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
```

### 📦 الخطوة 10: نقل LanguageContext

أضف LanguageContext إلى Layout الرئيسي أو إلى كل صفحة:

في `resources/js/layouts/AppLayout.tsx`:

```tsx
import { PropsWithChildren } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AppLayout({ children }: PropsWithChildren) {
    return (
        <LanguageProvider>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </LanguageProvider>
    );
}
```

ثم استخدمه في الصفحات:

```tsx
import AppLayout from '@/layouts/AppLayout';

export default function Home({ universities, articles }) {
    return (
        <AppLayout>
            {/* محتوى الصفحة */}
        </AppLayout>
    );
}
```

### 📦 الخطوة 11: تحديث Types

في `resources/js/types/index.d.ts`:

```typescript
export interface University {
    id: number;
    name_en: string;
    name_ar: string;
    location: string;
    rating: number;
    fees: number;
    description_en: string;
    description_ar: string;
    images?: UniversityImage[];
    colleges?: College[];
    posts?: UniversityPost[];
}

export interface College {
    id: number;
    name_en: string;
    name_ar: string;
    university_id: number;
    image?: string;
    majors?: Major[];
}

export interface Major {
    id: number;
    name_en: string;
    name_ar: string;
    college_id: number;
    description_en: string;
    description_ar: string;
    pivot?: {
        fees: number;
        required_gpa: number;
        study_years: number;
    };
}

export interface UniversityPost {
    id: number;
    title: string;
    content: string;
    image?: string;
    university_id: number;
    university?: University;
    created_at: string;
    likes_count?: number;
}

export interface Application {
    id: number;
    student_id: number;
    university_id: number;
    major_id: number;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
}

export interface Student {
    id: number;
    name: string;
    email: string;
    phone?: string;
    gpa?: number;
}
```

### 📦 الخطوة 12: تشغيل المشروع

```bash
# في terminal أول - Laravel server
php artisan serve

# في terminal ثاني - Vite dev server
npm run dev
```

الآن افتح المتصفح على: `http://localhost:8000`

---

## 🎨 تخصيصات إضافية

### إضافة Seeders للبيانات التجريبية

يمكنك نقل البيانات التجريبية من `mockData.ts` إلى Laravel Seeders:

```bash
php artisan make:seeder UniversitiesSeeder
```

في `database/seeders/UniversitiesSeeder.php`:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\University;
use App\Models\College;
use App\Models\Major;

class UniversitiesSeeder extends Seeder
{
    public function run(): void
    {
        $ksu = University::create([
            'name_en' => 'King Saud University',
            'name_ar' => 'جامعة الملك سعود',
            'location' => 'Riyadh, Saudi Arabia',
            'rating' => 4.8,
            'fees' => 0,
            'description_en' => 'A premier public university in Riyadh, known for its extensive research programs.',
            'description_ar' => 'جامعة حكومية رائدة في الرياض، تشتهر ببرامجها البحثية المكثفة.',
            'is_active' => true,
        ]);

        // إضافة الكليات
        $engineering = College::create([
            'name_en' => 'College of Engineering',
            'name_ar' => 'كلية الهندسة',
            'university_id' => $ksu->id,
        ]);

        // إضافة التخصصات
        $cs = Major::create([
            'name_en' => 'Computer Science',
            'name_ar' => 'علوم الحاسب',
            'college_id' => $engineering->id,
            'description_en' => 'Study of computation and information processing.',
            'description_ar' => 'دراسة الحوسبة ومعالجة المعلومات.',
        ]);

        // ربط التخصص بالجامعة
        $ksu->majors()->attach($cs->id, [
            'fees' => 0,
            'required_gpa' => 3.5,
            'study_years' => 4,
        ]);
    }
}
```

تشغيل Seeder:
```bash
php artisan db:seed --class=UniversitiesSeeder
```

### إضافة Middleware للغة

يمكن إضافة middleware لتحديد اللغة بناءً على تفضيلات المستخدم:

```bash
php artisan make:middleware SetLocale
```

في `app/Http/Middleware/SetLocale.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->session()->get('locale', 'en');
        App::setLocale($locale);
        
        return $next($request);
    }
}
```

### إضافة API للموبايل (اختياري)

إذا كنت تريد API للتطبيقات المحمولة:

في `routes/api.php`:

```php
<?php

use App\Http\Controllers\Api\UniversityController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('universities', [UniversityController::class, 'index']);
    Route::get('universities/{university}', [UniversityController::class, 'show']);
    Route::get('colleges', [CollegeController::class, 'index']);
    Route::get('articles', [ArticleController::class, 'index']);
});
```

---

## ✅ قائمة التحقق النهائية

- [ ] استنساخ QueenLastVersion
- [ ] تثبيت Dependencies
- [ ] إعداد قاعدة البيانات
- [ ] تشغيل Migrations
- [ ] نقل صفحات UniGuide
- [ ] نقل مكونات UniGuide
- [ ] تحديث Imports (Wouter → Inertia)
- [ ] إنشاء Controllers
- [ ] تحديث Routes
- [ ] إضافة Types
- [ ] نقل الأصول (الصور)
- [ ] تشغيل Seeders
- [ ] اختبار جميع الصفحات
- [ ] التأكد من عمل اللغتين (EN/AR)

---

## 📚 الموارد

- [مستودع QueenLastVersion](https://github.com/jihad3ali3/QueenLastVersion)
- [دليل دمج Laravel](./LARAVEL_INTEGRATION.md)
- [Inertia.js Documentation](https://inertiajs.com/)
- [Laravel 12 Documentation](https://laravel.com/docs/12.x)

</div>

---

## English

### 📋 Overview

This guide explains how to merge the **UniGuide** project (current - React Frontend) with the **QueenLastVersion** project (Laravel 12 Backend with Inertia.js). The projects are complementary:

- **UniGuide (Current Project)**: Complete React frontend for students to explore universities
- **QueenLastVersion**: Laravel 12 Backend with ready database and Models

### 🎯 What QueenLastVersion Contains

The project includes:
- ✅ **Laravel 12** with Inertia.js fully configured
- ✅ **Ready Models**: University, College, Major, UniversityPost, Application, Student
- ✅ **Authentication System** (Laravel Fortify)
- ✅ **Admin Panel** (Filament)
- ✅ **React + TypeScript** in `resources/js`
- ✅ **Tailwind CSS 4** and Radix UI Components
- ✅ **Database Migrations** ready

### 🔄 Merge Strategy

There are two options for merging:

#### Option 1: Move UniGuide UI to QueenLastVersion (Recommended ⭐)
Transfer all UniGuide pages and components to the `resources/js` folder in QueenLastVersion.

#### Option 2: Add Backend from QueenLastVersion to UniGuide
Copy Models and Controllers from QueenLastVersion to the current project.

**We'll follow Option 1** as it's easier and more effective.

---

## Merge Steps

### 📦 Step 1: Clone QueenLastVersion

```bash
# In a new folder
git clone https://github.com/jihad3ali3/QueenLastVersion.git
cd QueenLastVersion
```

### 📦 Step 2: Install Dependencies

```bash
# Install Composer dependencies
composer install

# Install NPM dependencies
npm install
```

### 📦 Step 3: Setup Environment

```bash
# Copy environment file
cp .env.example .env

# Generate Application Key
php artisan key:generate

# Setup database in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=uniguide
# DB_USERNAME=root
# DB_PASSWORD=
```

### 📦 Step 4: Run Migrations

```bash
php artisan migrate
```

### 📦 Step 5: Transfer UniGuide Pages

Now transfer UniGuide pages and components to QueenLastVersion:

#### Transfer Components

```bash
# In current UniGuide folder, copy components
cp -r client/src/components/* [path-to-QueenLastVersion]/resources/js/components/

# Copy pages
cp -r client/src/pages/* [path-to-QueenLastVersion]/resources/js/pages/

# Copy contexts
cp -r client/src/contexts/* [path-to-QueenLastVersion]/resources/js/

# Copy hooks
cp -r client/src/hooks/* [path-to-QueenLastVersion]/resources/js/hooks/

# Copy utilities
cp -r client/src/lib/* [path-to-QueenLastVersion]/resources/js/lib/
```

#### Transfer Assets

```bash
# Copy images
cp -r attached_assets/* [path-to-QueenLastVersion]/public/images/
```

### 📦 Step 6: Update Pages for Inertia

Each page in UniGuide needs minor modifications:

**Example: Converting `Home.tsx`**

**Before (UniGuide - Wouter):**
```tsx
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  // ...
}
```

**After (QueenLastVersion - Inertia):**
```tsx
import { Link, Head } from "@inertiajs/react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HomeProps {
  universities?: University[];
  articles?: Article[];
}

export default function Home({ universities = [], articles = [] }: HomeProps) {
  const { t } = useLanguage();
  
  return (
    <>
      <Head title={t('home')} />
      {/* rest of code */}
    </>
  );
}
```

**Required Changes:**
1. ✅ Replace `import { Link } from "wouter"` with `import { Link } from "@inertiajs/react"`
2. ✅ Add `Head` from `@inertiajs/react`
3. ✅ Add Props interface to receive data from Laravel
4. ✅ Use data from Props instead of mockData

### 📦 Step 7: Create Controllers in Laravel

Now we need to create Controllers to send data to pages:

#### HomeController

```bash
php artisan make:controller HomeController
```

In `app/Http/Controllers/HomeController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\University;
use App\Models\UniversityPost;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $universities = University::with(['images', 'colleges.majors'])
            ->where('is_active', true)
            ->orderBy('rating', 'desc')
            ->limit(6)
            ->get();

        $articles = UniversityPost::with(['university'])
            ->latest()
            ->limit(6)
            ->get();

        return Inertia::render('Home', [
            'universities' => $universities,
            'articles' => $articles,
        ]);
    }
}
```

#### UniversityController

```bash
php artisan make:controller UniversityController
```

In `app/Http/Controllers/UniversityController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\University;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UniversityController extends Controller
{
    public function index(Request $request): Response
    {
        $query = University::with(['images', 'colleges'])
            ->where('is_active', true);

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name_en', 'like', "%{$request->search}%")
                  ->orWhere('name_ar', 'like', "%{$request->search}%");
            });
        }

        // Filter by location
        if ($request->location) {
            $query->where('location', $request->location);
        }

        // Sort by rating or fees
        if ($request->sort === 'rating') {
            $query->orderBy('rating', 'desc');
        } elseif ($request->sort === 'fees') {
            $query->orderBy('fees', 'asc');
        }

        $universities = $query->paginate(12);

        return Inertia::render('Universities', [
            'universities' => $universities,
            'filters' => $request->only(['search', 'location', 'sort']),
        ]);
    }

    public function show(University $university): Response
    {
        $university->load([
            'images',
            'colleges.majors' => function ($query) {
                $query->withPivot(['fees', 'required_gpa', 'study_years']);
            },
            'posts' => function ($query) {
                $query->latest()->limit(5);
            }
        ]);

        return Inertia::render('UniversityDetails', [
            'university' => $university,
        ]);
    }
}
```

### 📦 Step 8: Update Routes

In `routes/web.php`:

```php
<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\UniversityController;
use App\Http\Controllers\CollegeController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ApplicationController;
use Illuminate\Support\Facades\Route;

// Home
Route::get('/', [HomeController::class, 'index'])->name('home');

// Universities
Route::get('/universities', [UniversityController::class, 'index'])->name('universities.index');
Route::get('/universities/{university}', [UniversityController::class, 'show'])->name('universities.show');

// Colleges
Route::get('/colleges', [CollegeController::class, 'index'])->name('colleges.index');
Route::get('/colleges/{college}', [CollegeController::class, 'show'])->name('colleges.show');

// Articles
Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
Route::get('/articles/{post}', [ArticleController::class, 'show'])->name('articles.show');

// Smart Guidance
Route::get('/guidance', function () {
    return Inertia::render('Guidance');
})->name('guidance');

// Applications
Route::middleware('auth:student')->group(function () {
    Route::get('/apply/{university?}', [ApplicationController::class, 'create'])->name('apply.create');
    Route::post('/apply', [ApplicationController::class, 'store'])->name('apply.store');
});

// Authentication routes (already exist in QueenLastVersion)
require __DIR__.'/auth.php';
```

### 📦 Step 9: Update App.tsx

In `resources/js/app.tsx` (QueenLastVersion), ensure it's properly configured:

```tsx
import '../css/app.css';
import './bootstrap';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'UniGuide';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
```

### 📦 Step 10: Transfer LanguageContext

Add LanguageContext to main Layout or to each page:

In `resources/js/layouts/AppLayout.tsx`:

```tsx
import { PropsWithChildren } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AppLayout({ children }: PropsWithChildren) {
    return (
        <LanguageProvider>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </LanguageProvider>
    );
}
```

Then use it in pages:

```tsx
import AppLayout from '@/layouts/AppLayout';

export default function Home({ universities, articles }) {
    return (
        <AppLayout>
            {/* page content */}
        </AppLayout>
    );
}
```

### 📦 Step 11: Update Types

In `resources/js/types/index.d.ts`:

```typescript
export interface University {
    id: number;
    name_en: string;
    name_ar: string;
    location: string;
    rating: number;
    fees: number;
    description_en: string;
    description_ar: string;
    images?: UniversityImage[];
    colleges?: College[];
    posts?: UniversityPost[];
}

export interface College {
    id: number;
    name_en: string;
    name_ar: string;
    university_id: number;
    image?: string;
    majors?: Major[];
}

export interface Major {
    id: number;
    name_en: string;
    name_ar: string;
    college_id: number;
    description_en: string;
    description_ar: string;
    pivot?: {
        fees: number;
        required_gpa: number;
        study_years: number;
    };
}

export interface UniversityPost {
    id: number;
    title: string;
    content: string;
    image?: string;
    university_id: number;
    university?: University;
    created_at: string;
    likes_count?: number;
}

export interface Application {
    id: number;
    student_id: number;
    university_id: number;
    major_id: number;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
}

export interface Student {
    id: number;
    name: string;
    email: string;
    phone?: string;
    gpa?: number;
}
```

### 📦 Step 12: Run the Project

```bash
# In first terminal - Laravel server
php artisan serve

# In second terminal - Vite dev server
npm run dev
```

Now open browser at: `http://localhost:8000`

---

## 🎨 Additional Customizations

### Add Seeders for Mock Data

You can transfer mock data from `mockData.ts` to Laravel Seeders:

```bash
php artisan make:seeder UniversitiesSeeder
```

In `database/seeders/UniversitiesSeeder.php`:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\University;
use App\Models\College;
use App\Models\Major;

class UniversitiesSeeder extends Seeder
{
    public function run(): void
    {
        $ksu = University::create([
            'name_en' => 'King Saud University',
            'name_ar' => 'جامعة الملك سعود',
            'location' => 'Riyadh, Saudi Arabia',
            'rating' => 4.8,
            'fees' => 0,
            'description_en' => 'A premier public university in Riyadh, known for its extensive research programs.',
            'description_ar' => 'جامعة حكومية رائدة في الرياض، تشتهر ببرامجها البحثية المكثفة.',
            'is_active' => true,
        ]);

        // Add colleges
        $engineering = College::create([
            'name_en' => 'College of Engineering',
            'name_ar' => 'كلية الهندسة',
            'university_id' => $ksu->id,
        ]);

        // Add majors
        $cs = Major::create([
            'name_en' => 'Computer Science',
            'name_ar' => 'علوم الحاسب',
            'college_id' => $engineering->id,
            'description_en' => 'Study of computation and information processing.',
            'description_ar' => 'دراسة الحوسبة ومعالجة المعلومات.',
        ]);

        // Attach major to university
        $ksu->majors()->attach($cs->id, [
            'fees' => 0,
            'required_gpa' => 3.5,
            'study_years' => 4,
        ]);
    }
}
```

Run Seeder:
```bash
php artisan db:seed --class=UniversitiesSeeder
```

### Add Language Middleware

You can add middleware to set language based on user preferences:

```bash
php artisan make:middleware SetLocale
```

In `app/Http/Middleware/SetLocale.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->session()->get('locale', 'en');
        App::setLocale($locale);
        
        return $next($request);
    }
}
```

### Add API for Mobile (Optional)

If you want API for mobile applications:

In `routes/api.php`:

```php
<?php

use App\Http\Controllers\Api\UniversityController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('universities', [UniversityController::class, 'index']);
    Route::get('universities/{university}', [UniversityController::class, 'show']);
    Route::get('colleges', [CollegeController::class, 'index']);
    Route::get('articles', [ArticleController::class, 'index']);
});
```

---

## ✅ Final Checklist

- [ ] Clone QueenLastVersion
- [ ] Install Dependencies
- [ ] Setup Database
- [ ] Run Migrations
- [ ] Transfer UniGuide pages
- [ ] Transfer UniGuide components
- [ ] Update Imports (Wouter → Inertia)
- [ ] Create Controllers
- [ ] Update Routes
- [ ] Add Types
- [ ] Transfer Assets (images)
- [ ] Run Seeders
- [ ] Test all pages
- [ ] Verify both languages work (EN/AR)

---

## 📚 Resources

- [QueenLastVersion Repository](https://github.com/jihad3ali3/QueenLastVersion)
- [Laravel Integration Guide](./LARAVEL_INTEGRATION.md)
- [Inertia.js Documentation](https://inertiajs.com/)
- [Laravel 12 Documentation](https://laravel.com/docs/12.x)

---

**Happy Merging! 🚀**
