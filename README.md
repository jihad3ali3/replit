# UniGuide - University Exploration & Application Platform
# منصة استكشاف الجامعات والتقديم

[English](#english) | [العربية](#arabic)

> **📘 Laravel Integration Guide**: Want to connect this project with Laravel 12 using Inertia.js? Check out the [Laravel Integration Guide](./LARAVEL_INTEGRATION.md) | **دليل دمج Laravel**: تريد ربط المشروع مع Laravel 12 باستخدام Inertia.js؟ راجع [دليل دمج Laravel](./LARAVEL_INTEGRATION.md)

---

## English

### 📚 Project Overview

UniGuide is a modern, professional web platform designed to help students explore universities, colleges, and academic majors, read educational articles, and receive smart guidance based on their interests and academic qualifications.

### 🎯 Purpose

The platform provides a comprehensive solution for students seeking higher education by:
- Browsing universities and colleges with detailed information
- Exploring academic majors and career opportunities
- Reading articles and educational content
- Receiving personalized academic guidance based on GPA and interests
- Submitting applications directly to universities

### 🏗️ Technical Architecture

#### **Technology Stack**
- **Frontend**: React 19.2 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS 4.1 with custom components
- **UI Components**: Radix UI primitives + shadcn/ui
- **Animations**: Framer Motion
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod validation
- **Backend**: Express.js (Node.js)
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite 7.1

#### **Project Structure**
```
/client               # Frontend React application
  /src
    /components       # Reusable UI components
      /ui            # Shadcn UI components
      /layout        # Layout components (Header, Footer)
    /pages           # Page components (routes)
    /contexts        # React contexts (LanguageContext)
    /hooks           # Custom React hooks
    /lib             # Utilities and mock data
    /assets          # Images and static assets

/server              # Backend Express application
  index.ts           # Server entry point
  routes.ts          # API routes
  storage.ts         # Database interface
  
/shared              # Shared code between client and server
  schema.ts          # Database schema (Drizzle)

/script              # Build scripts
```

### 🌟 Key Features

#### 1. **Home Page (Landing)**
- Hero section with professional university imagery
- Clear call-to-action buttons
- Platform highlights and benefits
- Featured universities and latest articles

#### 2. **University Browsing**
- **Universities Listing Page**
  - Card-based display with images, ratings, and locations
  - Advanced filtering (by rating, location, fees)
  - Search functionality
  - Pagination support

- **University Details Page**
  - Image gallery with RTL carousel
  - Comprehensive university information
  - Colleges and majors table with details:
    - Study duration
    - Tuition fees
    - Required GPA
  - Direct application button
  - User rating system

#### 3. **Colleges & Majors**
- **Colleges Page**
  - Expandable college cards showing majors
  - Major details including:
    - Description
    - Career opportunities
    - Study duration
    - Application options

- **Universities Offering Major Page**
  - List of universities offering specific majors
  - Filtering by cost, rating, and location
  - Interactive map integration

#### 4. **Articles**
- Educational articles related to universities
- Filtering by university and date
- Search functionality
- Like/favorite system

#### 5. **Smart Guidance**
- Interactive questionnaire flow
- Personalized recommendations based on:
  - Academic GPA
  - Student interests and hobbies
- Suggested colleges and majors
- Eligibility information
- Direct application links

#### 6. **Application System**
- Comprehensive application form
- Required fields:
  - First and last name
  - Email (validated)
  - Phone number (optional)
  - Academic data (GPA, certificates, year)

### 🌐 Internationalization

- **Bilingual Support**: Full English and Arabic support
- **RTL/LTR**: Automatic direction switching
- **Language Toggle**: Easy language switching in navigation
- **Contextual Content**: All content available in both languages

### 🎨 UI/UX Features

- **Professional Design**: Clean, modern, and intuitive interface
- **Responsive Design**: Mobile-first approach, works on all devices
- **Smooth Animations**: Framer Motion animations throughout
- **Theme Support**: Light/dark mode (extendable to custom colors)
- **Accessibility**: Built with Radix UI primitives for better accessibility

### 🚀 Getting Started

#### Prerequisites
- Node.js 20.x or higher
- PostgreSQL 16 (configured in .replit for Replit environment)

#### Installation

1. Clone the repository:
```bash
git clone https://github.com/jihad3ali3/replit.git
cd replit
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:push
```

#### Development

Run the development server:
```bash
npm run dev
```

This starts the Express server with Vite dev server integrated. The application will be available at `http://localhost:5000`.

For client-only development:
```bash
npm run dev:client
```

#### Production Build

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

### 📋 Available Scripts

- `npm run dev` - Start development server (backend + frontend)
- `npm run dev:client` - Start Vite dev server only
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

### 🗂️ Database Schema

Currently minimal schema with users table:
- `id` - UUID primary key
- `username` - Unique username
- `password` - Hashed password

*Note: The schema is designed to be extended with university, college, major, and application tables.*

### 📦 Key Dependencies

**Frontend:**
- React 19.2 - UI library
- Wouter - Routing
- TanStack Query - Server state management
- React Hook Form - Form handling
- Zod - Schema validation
- Framer Motion - Animations
- Radix UI - Accessible component primitives
- Tailwind CSS - Styling

**Backend:**
- Express 5 - Web framework
- Drizzle ORM - Database toolkit
- PostgreSQL - Database
- Passport - Authentication (configured)

### 🔒 Security Features

- Input validation using Zod schemas
- Password hashing (Passport.js ready)
- Session management (Express Session configured)
- SQL injection protection (Drizzle ORM)

### 🎯 Current Implementation Status

The application currently includes:
- ✅ Complete frontend UI for all pages
- ✅ Routing system with Wouter
- ✅ Bilingual support (EN/AR) with RTL
- ✅ Mock data for universities, colleges, majors, and articles
- ✅ Responsive design with Tailwind CSS
- ✅ Database schema foundation
- ⏳ Backend API routes (ready to implement)
- ⏳ Database integration (structure ready)
- ⏳ Authentication system (partially configured)

### 🔮 Future Enhancements

- Complete backend API implementation
- Database population and management
- User authentication and profiles
- Admin dashboard for content management
- Advanced search with Elasticsearch
- Real-time notifications
- Integration with university application systems
- Analytics and reporting

### 📝 Code Quality

- TypeScript for type safety
- Clean, modular component architecture
- Reusable components following DRY principle
- Consistent code formatting
- Prepared for scalability

---

## Arabic

<div dir="rtl">

### 📚 نظرة عامة على المشروع

UniGuide هي منصة ويب عصرية واحترافية مصممة لمساعدة الطلاب على استكشاف الجامعات والكليات والتخصصات الأكاديمية، وقراءة المقالات التعليمية، والحصول على توجيه ذكي بناءً على اهتماماتهم ومؤهلاتهم الأكاديمية.

### 🎯 الهدف

توفر المنصة حلاً شاملاً للطلاب الباحثين عن التعليم العالي من خلال:
- تصفح الجامعات والكليات مع معلومات تفصيلية
- استكشاف التخصصات الأكاديمية والفرص المهنية
- قراءة المقالات والمحتوى التعليمي
- الحصول على إرشاد أكاديمي شخصي بناءً على المعدل والاهتمامات
- تقديم الطلبات مباشرة إلى الجامعات

### 🏗️ البنية التقنية

#### **التقنيات المستخدمة**
- **الواجهة الأمامية**: React 19.2 مع TypeScript
- **التوجيه**: Wouter (موجه React خفيف)
- **التنسيق**: Tailwind CSS 4.1 مع مكونات مخصصة
- **مكونات الواجهة**: Radix UI + shadcn/ui
- **الحركات**: Framer Motion
- **إدارة الحالة**: TanStack Query (React Query)
- **معالجة النماذج**: React Hook Form + Zod للتحقق
- **الخادم**: Express.js (Node.js)
- **قاعدة البيانات**: PostgreSQL مع Drizzle ORM
- **أداة البناء**: Vite 7.1

#### **هيكل المشروع**
```
/client               # تطبيق React الأمامي
  /src
    /components       # مكونات واجهة قابلة لإعادة الاستخدام
      /ui            # مكونات Shadcn UI
      /layout        # مكونات التخطيط (الرأس، التذييل)
    /pages           # مكونات الصفحات (المسارات)
    /contexts        # سياقات React (سياق اللغة)
    /hooks           # خطافات React مخصصة
    /lib             # أدوات مساعدة وبيانات تجريبية
    /assets          # الصور والملفات الثابتة

/server              # تطبيق Express الخلفي
  index.ts           # نقطة دخول الخادم
  routes.ts          # مسارات API
  storage.ts         # واجهة قاعدة البيانات
  
/shared              # كود مشترك بين العميل والخادم
  schema.ts          # مخطط قاعدة البيانات (Drizzle)

/script              # سكريبتات البناء
```

### 🌟 الميزات الرئيسية

#### 1. **الصفحة الرئيسية**
- قسم البطل بصور جامعية احترافية
- أزرار دعوة واضحة للعمل
- أبرز نقاط المنصة والفوائد
- الجامعات المميزة وأحدث المقالات

#### 2. **تصفح الجامعات**
- **صفحة قائمة الجامعات**
  - عرض بطاقات مع صور وتقييمات ومواقع
  - تصفية متقدمة (حسب التقييم، الموقع، الرسوم)
  - وظيفة البحث
  - دعم التقسيم على صفحات

- **صفحة تفاصيل الجامعة**
  - معرض صور مع دوار RTL
  - معلومات شاملة عن الجامعة
  - جدول الكليات والتخصصات مع التفاصيل:
    - مدة الدراسة
    - الرسوم الدراسية
    - المعدل المطلوب
  - زر التقديم المباشر
  - نظام تقييم المستخدم

#### 3. **الكليات والتخصصات**
- **صفحة الكليات**
  - بطاقات كليات قابلة للتوسيع تعرض التخصصات
  - تفاصيل التخصص بما في ذلك:
    - الوصف
    - الفرص المهنية
    - مدة الدراسة
    - خيارات التقديم

- **صفحة الجامعات التي تقدم التخصص**
  - قائمة الجامعات التي تقدم تخصصات محددة
  - التصفية حسب التكلفة والتقييم والموقع
  - تكامل الخرائط التفاعلية

#### 4. **المقالات**
- مقالات تعليمية متعلقة بالجامعات
- التصفية حسب الجامعة والتاريخ
- وظيفة البحث
- نظام الإعجاب/المفضلة

#### 5. **التوجيه الذكي**
- استبيان تفاعلي
- توصيات مخصصة بناءً على:
  - المعدل الأكاديمي
  - اهتمامات وهوايات الطالب
- الكليات والتخصصات المقترحة
- معلومات الأهلية
- روابط التقديم المباشر

#### 6. **نظام التقديم**
- نموذج تقديم شامل
- الحقول المطلوبة:
  - الاسم الأول والأخير
  - البريد الإلكتروني (محقق منه)
  - رقم الهاتف (اختياري)
  - البيانات الأكاديمية (المعدل، الشهادات، السنة)

### 🌐 الدعم الدولي

- **دعم لغتين**: دعم كامل للإنجليزية والعربية
- **RTL/LTR**: تبديل اتجاه تلقائي
- **تبديل اللغة**: تبديل سهل للغة في التنقل
- **محتوى سياقي**: جميع المحتويات متاحة بكلتا اللغتين

### 🎨 ميزات واجهة المستخدم

- **تصميم احترافي**: واجهة نظيفة وحديثة وبديهية
- **تصميم متجاوب**: نهج الموبايل أولاً، يعمل على جميع الأجهزة
- **حركات سلسة**: حركات Framer Motion في جميع أنحاء التطبيق
- **دعم الثيمات**: وضع فاتح/داكن (قابل للتوسع لألوان مخصصة)
- **إمكانية الوصول**: مبني باستخدام Radix UI لإمكانية وصول أفضل

### 🚀 البدء

#### المتطلبات الأساسية
- Node.js 20.x أو أعلى
- PostgreSQL 16 (مهيأ في .replit لبيئة Replit)

#### التثبيت

1. استنساخ المستودع:
```bash
git clone https://github.com/jihad3ali3/replit.git
cd replit
```

2. تثبيت الاعتماديات:
```bash
npm install
```

3. إعداد قاعدة البيانات:
```bash
npm run db:push
```

#### التطوير

تشغيل خادم التطوير:
```bash
npm run dev
```

هذا يبدأ خادم Express مع خادم Vite المدمج. سيكون التطبيق متاحاً على `http://localhost:5000`.

للتطوير على الواجهة الأمامية فقط:
```bash
npm run dev:client
```

#### بناء الإنتاج

بناء التطبيق:
```bash
npm run build
```

بدء خادم الإنتاج:
```bash
npm start
```

### 📋 الأوامر المتاحة

- `npm run dev` - بدء خادم التطوير (الخلفي + الأمامي)
- `npm run dev:client` - بدء خادم Vite فقط
- `npm run build` - البناء للإنتاج
- `npm start` - بدء خادم الإنتاج
- `npm run check` - تشغيل فحص أنواع TypeScript
- `npm run db:push` - دفع تغييرات مخطط قاعدة البيانات

### 🗂️ مخطط قاعدة البيانات

حالياً مخطط أساسي مع جدول المستخدمين:
- `id` - مفتاح أساسي UUID
- `username` - اسم مستخدم فريد
- `password` - كلمة مرور مشفرة

*ملاحظة: المخطط مصمم ليتم توسيعه بجداول الجامعات والكليات والتخصصات والتقديمات.*

### 📦 الاعتماديات الرئيسية

**الواجهة الأمامية:**
- React 19.2 - مكتبة واجهة المستخدم
- Wouter - التوجيه
- TanStack Query - إدارة حالة الخادم
- React Hook Form - معالجة النماذج
- Zod - التحقق من المخطط
- Framer Motion - الحركات
- Radix UI - مكونات أساسية يمكن الوصول إليها
- Tailwind CSS - التنسيق

**الواجهة الخلفية:**
- Express 5 - إطار عمل الويب
- Drizzle ORM - مجموعة أدوات قاعدة البيانات
- PostgreSQL - قاعدة البيانات
- Passport - المصادقة (مهيأ)

### 🔒 ميزات الأمان

- التحقق من المدخلات باستخدام مخططات Zod
- تشفير كلمات المرور (جاهز لـ Passport.js)
- إدارة الجلسات (Express Session مهيأ)
- الحماية من حقن SQL (Drizzle ORM)

### 🎯 حالة التنفيذ الحالية

التطبيق حالياً يتضمن:
- ✅ واجهة مستخدم أمامية كاملة لجميع الصفحات
- ✅ نظام توجيه مع Wouter
- ✅ دعم لغتين (EN/AR) مع RTL
- ✅ بيانات تجريبية للجامعات والكليات والتخصصات والمقالات
- ✅ تصميم متجاوب مع Tailwind CSS
- ✅ أساس مخطط قاعدة البيانات
- ⏳ مسارات API الخلفية (جاهزة للتنفيذ)
- ⏳ تكامل قاعدة البيانات (الهيكل جاهز)
- ⏳ نظام المصادقة (مهيأ جزئياً)

### 🔮 التحسينات المستقبلية

- إكمال تنفيذ API الخلفي
- تعبئة وإدارة قاعدة البيانات
- مصادقة المستخدم والملفات الشخصية
- لوحة تحكم المسؤول لإدارة المحتوى
- بحث متقدم مع Elasticsearch
- إشعارات في الوقت الفعلي
- التكامل مع أنظمة تقديم الجامعات
- التحليلات والتقارير

### 📝 جودة الكود

- TypeScript لسلامة الأنواع
- بنية مكونات نظيفة ومعيارية
- مكونات قابلة لإعادة الاستخدام تتبع مبدأ DRY
- تنسيق كود متسق
- جاهز للتوسع

</div>

---

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and Express**
