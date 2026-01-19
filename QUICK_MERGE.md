# دمج UniGuide (replit) إلى QueenLastVersion - دليل سريع
# Quick Merge Guide: UniGuide (replit) into QueenLastVersion

[العربية](#arabic) | [English](#english)

---

## Arabic

<div dir="rtl">

### ✨ الهدف

دمج واجهة **UniGuide** (المشروع الحالي في replit) مع **QueenLastVersion** (Laravel Backend)، مع استخدام **QueenLastVersion كأساس**.

### 🎯 لماذا QueenLastVersion كأساس؟

- ✅ يحتوي على Laravel 12 + Inertia.js جاهز
- ✅ قاعدة البيانات والـ Models موجودة
- ✅ نظام المصادقة جاهز
- ✅ لوحة تحكم إدارية (Filament)
- ✅ بنية المشروع منظمة

### 📋 خطوات سريعة (10 دقائق)

#### الخطوة 1: تحضير QueenLastVersion

```bash
# استنسخ المشروع
git clone https://github.com/jihad3ali3/QueenLastVersion.git
cd QueenLastVersion

# تثبيت Dependencies
composer install
npm install

# إعداد البيئة
cp .env.example .env
php artisan key:generate

# (اختياري) إعداد قاعدة البيانات
php artisan migrate
```

#### الخطوة 2: نقل Controllers الجاهزة

من مشروع UniGuide (replit)، انسخ الـ Controllers:

```bash
# من مجلد replit
cp laravel-integration-examples/controllers/*.php [path-to-QueenLastVersion]/app/Http/Controllers/
```

الملفات المنسوخة:
- ✅ `HomeController.php`
- ✅ `UniversityController.php`
- ✅ `CollegeController.php`
- ✅ `ArticleController.php`
- ✅ `ApplicationController.php`

#### الخطوة 3: تحديث Routes

افتح `QueenLastVersion/routes/web.php` وأضف المسارات من:
`replit/laravel-integration-examples/routes/web.php`

أو انسخ الملف كاملاً (بعد حفظ نسخة احتياطية):

```bash
# نسخة احتياطية
cp routes/web.php routes/web.php.backup

# نسخ المسارات الجديدة
cp [path-to-replit]/laravel-integration-examples/routes/web.php routes/web.php
```

#### الخطوة 4: نقل صفحات React

انسخ صفحات UniGuide إلى QueenLastVersion:

```bash
# من مجلد replit
cd client/src

# نقل الصفحات
cp -r pages/* [path-to-QueenLastVersion]/resources/js/pages/

# نقل المكونات
cp -r components/* [path-to-QueenLastVersion]/resources/js/components/

# نقل السياقات
cp -r contexts/* [path-to-QueenLastVersion]/resources/js/

# نقل الـ hooks
cp -r hooks/* [path-to-QueenLastVersion]/resources/js/hooks/

# نقل المكتبات المساعدة
cp -r lib/* [path-to-QueenLastVersion]/resources/js/lib/
```

#### الخطوة 5: نقل الصور والأصول

```bash
# نقل الصور
cp -r [path-to-replit]/attached_assets/generated_images/* [path-to-QueenLastVersion]/public/images/
```

#### الخطوة 6: تحديث الصفحات لـ Inertia.js

في كل صفحة من `resources/js/pages/*.tsx`، قم بالتعديلات التالية:

**تعديل 1: تحديث Imports**

```tsx
// قبل (Wouter)
import { Link } from "wouter";

// بعد (Inertia)
import { Link, Head } from "@inertiajs/react";
```

**تعديل 2: إضافة Props Interface**

```tsx
// في بداية كل صفحة
interface HomeProps {
  universities?: University[];
  articles?: Article[];
}

export default function Home({ universities = [], articles = [] }: HomeProps) {
  // ...
}
```

**تعديل 3: إضافة Head Component**

```tsx
export default function Home({ universities, articles }: HomeProps) {
  return (
    <>
      <Head title="Home" />
      {/* باقي المحتوى */}
    </>
  );
}
```

**تعديل 4: حذف استيراد mockData**

```tsx
// احذف هذا السطر
import { universities, articles } from "@/lib/mockData";

// واستخدم البيانات من Props بدلاً من ذلك
```

#### الخطوة 7: تحديث App.tsx (اختياري)

إذا لزم الأمر، تأكد من أن `resources/js/app.tsx` في QueenLastVersion مُعد بشكل صحيح:

```tsx
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
    title: (title) => `${title} - UniGuide`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
```

#### الخطوة 8: تحديث package.json Dependencies

تأكد من وجود جميع Dependencies المطلوبة في `package.json`:

```json
{
  "dependencies": {
    "@inertiajs/react": "^2.3.7",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    // ... باقي Dependencies من UniGuide
  }
}
```

ثم:
```bash
npm install
```

#### الخطوة 9: إنشاء Layout مع LanguageContext

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

#### الخطوة 10: تشغيل المشروع

```bash
# Terminal 1 - Laravel
php artisan serve

# Terminal 2 - Vite
npm run dev
```

افتح المتصفح على: `http://localhost:8000`

### ✅ قائمة التحقق النهائية

- [ ] ✅ QueenLastVersion مستنسخ وجاهز
- [ ] ✅ Controllers منسوخة (5 ملفات)
- [ ] ✅ Routes محدثة
- [ ] ✅ صفحات React منسوخة
- [ ] ✅ المكونات منسوخة
- [ ] ✅ الصور منسوخة
- [ ] ✅ Imports محدثة (Wouter → Inertia)
- [ ] ✅ Props interfaces مضافة
- [ ] ✅ mockData محذوف
- [ ] ✅ Dependencies مثبتة
- [ ] ✅ المشروع يعمل على http://localhost:8000

### 🎉 النتيجة

الآن لديك:
- ✅ QueenLastVersion كأساس
- ✅ واجهة UniGuide الكاملة
- ✅ جميع الميزات: جامعات، كليات، مقالات، تقديمات، إرشاد
- ✅ قاعدة بيانات Laravel
- ✅ نظام مصادقة
- ✅ لوحة تحكم إدارية

### 🔧 إضافة بيانات تجريبية (اختياري)

إذا كنت تريد بيانات تجريبية:

```bash
php artisan make:seeder UniversitiesSeeder
```

ثم في `database/seeders/UniversitiesSeeder.php`، انسخ البيانات من `client/src/lib/mockData.ts`.

```bash
php artisan db:seed --class=UniversitiesSeeder
```

### 📚 موارد إضافية

- **دليل تفصيلي**: `MERGE_GUIDE.md` (خطوات أكثر تفصيلاً)
- **دمج Laravel**: `LARAVEL_INTEGRATION.md`
- **Controllers جاهزة**: `laravel-integration-examples/`

</div>

---

## English

### ✨ Goal

Merge **UniGuide** (current replit project) with **QueenLastVersion** (Laravel Backend), using **QueenLastVersion as the base**.

### 🎯 Why QueenLastVersion as Base?

- ✅ Has Laravel 12 + Inertia.js ready
- ✅ Database and Models already exist
- ✅ Authentication system ready
- ✅ Admin panel (Filament)
- ✅ Organized project structure

### 📋 Quick Steps (10 minutes)

#### Step 1: Prepare QueenLastVersion

```bash
# Clone the project
git clone https://github.com/jihad3ali3/QueenLastVersion.git
cd QueenLastVersion

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# (Optional) Setup database
php artisan migrate
```

#### Step 2: Copy Ready Controllers

From UniGuide (replit) project, copy the Controllers:

```bash
# From replit folder
cp laravel-integration-examples/controllers/*.php [path-to-QueenLastVersion]/app/Http/Controllers/
```

Copied files:
- ✅ `HomeController.php`
- ✅ `UniversityController.php`
- ✅ `CollegeController.php`
- ✅ `ArticleController.php`
- ✅ `ApplicationController.php`

#### Step 3: Update Routes

Open `QueenLastVersion/routes/web.php` and add routes from:
`replit/laravel-integration-examples/routes/web.php`

Or copy the entire file (after backing up):

```bash
# Backup
cp routes/web.php routes/web.php.backup

# Copy new routes
cp [path-to-replit]/laravel-integration-examples/routes/web.php routes/web.php
```

#### Step 4: Copy React Pages

Copy UniGuide pages to QueenLastVersion:

```bash
# From replit folder
cd client/src

# Copy pages
cp -r pages/* [path-to-QueenLastVersion]/resources/js/pages/

# Copy components
cp -r components/* [path-to-QueenLastVersion]/resources/js/components/

# Copy contexts
cp -r contexts/* [path-to-QueenLastVersion]/resources/js/

# Copy hooks
cp -r hooks/* [path-to-QueenLastVersion]/resources/js/hooks/

# Copy utilities
cp -r lib/* [path-to-QueenLastVersion]/resources/js/lib/
```

#### Step 5: Copy Images and Assets

```bash
# Copy images
cp -r [path-to-replit]/attached_assets/generated_images/* [path-to-QueenLastVersion]/public/images/
```

#### Step 6: Update Pages for Inertia.js

In each page from `resources/js/pages/*.tsx`, make these changes:

**Change 1: Update Imports**

```tsx
// Before (Wouter)
import { Link } from "wouter";

// After (Inertia)
import { Link, Head } from "@inertiajs/react";
```

**Change 2: Add Props Interface**

```tsx
// At the beginning of each page
interface HomeProps {
  universities?: University[];
  articles?: Article[];
}

export default function Home({ universities = [], articles = [] }: HomeProps) {
  // ...
}
```

**Change 3: Add Head Component**

```tsx
export default function Home({ universities, articles }: HomeProps) {
  return (
    <>
      <Head title="Home" />
      {/* rest of content */}
    </>
  );
}
```

**Change 4: Remove mockData imports**

```tsx
// Delete this line
import { universities, articles } from "@/lib/mockData";

// Use data from Props instead
```

#### Step 7: Update App.tsx (Optional)

If needed, ensure `resources/js/app.tsx` in QueenLastVersion is configured correctly:

```tsx
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
    title: (title) => `${title} - UniGuide`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
```

#### Step 8: Update package.json Dependencies

Ensure all required dependencies are in `package.json`:

```json
{
  "dependencies": {
    "@inertiajs/react": "^2.3.7",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    // ... rest of dependencies from UniGuide
  }
}
```

Then:
```bash
npm install
```

#### Step 9: Create Layout with LanguageContext

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

#### Step 10: Run the Project

```bash
# Terminal 1 - Laravel
php artisan serve

# Terminal 2 - Vite
npm run dev
```

Open browser at: `http://localhost:8000`

### ✅ Final Checklist

- [ ] ✅ QueenLastVersion cloned and ready
- [ ] ✅ Controllers copied (5 files)
- [ ] ✅ Routes updated
- [ ] ✅ React pages copied
- [ ] ✅ Components copied
- [ ] ✅ Images copied
- [ ] ✅ Imports updated (Wouter → Inertia)
- [ ] ✅ Props interfaces added
- [ ] ✅ mockData removed
- [ ] ✅ Dependencies installed
- [ ] ✅ Project running on http://localhost:8000

### 🎉 Result

You now have:
- ✅ QueenLastVersion as base
- ✅ Complete UniGuide interface
- ✅ All features: universities, colleges, articles, applications, guidance
- ✅ Laravel database
- ✅ Authentication system
- ✅ Admin panel

### 🔧 Add Mock Data (Optional)

If you want mock data:

```bash
php artisan make:seeder UniversitiesSeeder
```

Then in `database/seeders/UniversitiesSeeder.php`, copy data from `client/src/lib/mockData.ts`.

```bash
php artisan db:seed --class=UniversitiesSeeder
```

### 📚 Additional Resources

- **Detailed Guide**: `MERGE_GUIDE.md` (more detailed steps)
- **Laravel Integration**: `LARAVEL_INTEGRATION.md`
- **Ready Controllers**: `laravel-integration-examples/`

---

**Happy Coding! 🚀**
