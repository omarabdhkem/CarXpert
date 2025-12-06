# 🚀 دليل النشر والتشغيل الشامل
# Complete Deployment and Operations Guide

**المشروع / Project:** CarXpert - Car Marketplace Platform  
**التاريخ / Date:** ديسمبر 2025 / December 2025  
**الإصدار / Version:** 1.0.0

---

## 📋 جدول المحتويات / Table of Contents

1. [متطلبات النظام / System Requirements](#متطلبات-النظام--system-requirements)
2. [التثبيت المحلي / Local Installation](#التثبيت-المحلي--local-installation)
3. [التطوير / Development](#التطوير--development)
4. [البناء / Building](#البناء--building)
5. [الاختبار / Testing](#الاختبار--testing)
6. [النشر / Deployment](#النشر--deployment)
7. [الاستضافة / Hosting Options](#الاستضافة--hosting-options)
8. [قاعدة البيانات / Database](#قاعدة-البيانات--database)
9. [المتغيرات البيئية / Environment Variables](#المتغيرات-البيئية--environment-variables)
10. [المراقبة والصيانة / Monitoring & Maintenance](#المراقبة-والصيانة--monitoring--maintenance)
11. [استكشاف الأخطاء / Troubleshooting](#استكشاف-الأخطاء--troubleshooting)

---

## 1️⃣ متطلبات النظام / System Requirements

### الحد الأدنى / Minimum Requirements:
```
- Node.js: v20.x أو أحدث / or higher
- npm: v10.x أو أحدث / or higher
- RAM: 2 GB
- المساحة / Storage: 1 GB
- نظام التشغيل / OS: Windows, macOS, Linux
```

### الموصى به / Recommended:
```
- Node.js: v20.16.11
- npm: v10.8.x
- RAM: 4 GB+
- المساحة / Storage: 2 GB+
- معالج / CPU: 2 cores+
```

### التحقق من النسخة / Check Versions:
```bash
node --version   # يجب أن تكون v20.x أو أحدث / Should be v20.x+
npm --version    # يجب أن تكون v10.x أو أحدث / Should be v10.x+
```

---

## 2️⃣ التثبيت المحلي / Local Installation

### الخطوة 1: استنساخ المستودع / Clone Repository
```bash
# استنساخ المشروع / Clone the project
git clone https://github.com/omarabdhkem/CarXpert.git

# الدخول للمجلد / Enter directory
cd CarXpert
```

### الخطوة 2: تثبيت التبعيات / Install Dependencies
```bash
# تثبيت جميع الحزم / Install all packages
npm install

# أو استخدام / Or use
npm ci  # للتثبيت النظيف / For clean install
```

**الوقت المتوقع / Expected Time:** 1-3 دقائق / minutes

### الخطوة 3: التحقق من التثبيت / Verify Installation
```bash
# التحقق من TypeScript
npm run check

# يجب أن يظهر / Should show:
# ✓ No errors found
```

---

## 3️⃣ التطوير / Development

### تشغيل خادم التطوير / Run Development Server

```bash
# بدء خادم التطوير / Start dev server
npm run dev
```

**النتيجة / Output:**
```
serving on port 5000
```

### الوصول للتطبيق / Access Application

افتح المتصفح على / Open browser at:
```
http://localhost:5000
```

### الميزات في وضع التطوير / Development Mode Features:

✅ **Hot Module Replacement (HMR)**
   - تحديث تلقائي عند تغيير الكود
   - Automatic updates when code changes

✅ **Source Maps**
   - تسهيل التصحيح
   - Easier debugging

✅ **Error Overlays**
   - عرض الأخطاء في المتصفح
   - Display errors in browser

✅ **Fast Refresh**
   - تحديث سريع للمكونات
   - Quick component updates

### الأوامر المفيدة في التطوير / Useful Dev Commands

```bash
# التحقق من أخطاء TypeScript
# Check TypeScript errors
npm run check

# تشغيل الاختبارات في وضع المراقبة
# Run tests in watch mode
npm test

# تشغيل الاختبارات مع واجهة
# Run tests with UI
npm run test:ui

# تغطية الاختبارات
# Test coverage
npm run test:coverage
```

---

## 4️⃣ البناء / Building

### بناء للإنتاج / Build for Production

```bash
# بناء المشروع / Build project
npm run build
```

**ما يحدث / What Happens:**

1. **Vite Build** - بناء الواجهة الأمامية
   ```
   ✓ Client built to: dist/public/
   - index.html: 1.95 kB
   - CSS: 67.25 kB
   - JavaScript: 853.73 kB
   ```

2. **ESBuild Server** - بناء الخادم
   ```
   ✓ Server built to: dist/index.js
   - Size: 29.1 kB
   ```

### ملفات البناء / Build Output

```
dist/
├── public/              # ملفات الواجهة الأمامية / Frontend files
│   ├── index.html
│   └── assets/
│       ├── index.css
│       └── index.js
└── index.js            # ملف الخادم / Server file
```

### تشغيل نسخة الإنتاج / Run Production Build

```bash
# تشغيل الخادم
# Start server
npm start

# أو مباشرة / Or directly
NODE_ENV=production node dist/index.js
```

---

## 5️⃣ الاختبار / Testing

### تشغيل الاختبارات / Run Tests

```bash
# تشغيل جميع الاختبارات مرة واحدة
# Run all tests once
npm test -- --run

# تشغيل في وضع المراقبة
# Run in watch mode
npm test

# تشغيل مع واجهة المستخدم
# Run with UI
npm run test:ui

# تقرير التغطية
# Coverage report
npm run test:coverage
```

### الاختبارات الحالية / Current Tests

✅ **Schema Validation Tests** (5 tests)
- User schema validation
- Email validation
- Password validation
- Car schema validation
- Optional fields

### إضافة اختبارات جديدة / Add New Tests

إنشاء ملف بامتداد `.test.ts` أو `.test.tsx`:

```typescript
// مثال: client/src/components/MyComponent.test.tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('should render', () => {
    const { container } = render(<MyComponent />)
    expect(container).toBeInTheDocument()
  })
})
```

---

## 6️⃣ النشر / Deployment

### خيار 1: Replit (الأسهل / Easiest) ⭐

**المشروع جاهز للنشر على Replit!**

#### الخطوات / Steps:

1. **افتح المشروع في Replit**
   ```
   https://replit.com/@yourusername/CarXpert
   ```

2. **اضغط على زر "Deploy"**
   - اختر "Reserved VM Deployment"
   - أو اختر "Autoscale Deployment"

3. **انتظر اكتمال النشر**
   - يستغرق 2-5 دقائق
   - سيتم بناء المشروع تلقائياً

4. **احصل على الرابط**
   ```
   https://carxpert-yourname.repl.co
   ```

**التكلفة / Cost:**
- Free Tier: محدود
- Hacker Plan: $7/month
- Reserved VM: $25+/month

---

### خيار 2: Vercel (موصى به / Recommended) ⭐⭐⭐

**مناسب لـ / Best for:** Full-stack applications

#### الخطوات / Steps:

1. **تثبيت Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **تسجيل الدخول**
   ```bash
   vercel login
   ```

3. **النشر**
   ```bash
   vercel
   ```

4. **للإنتاج**
   ```bash
   vercel --prod
   ```

#### إعداد vercel.json:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "dist/public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "dist/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "dist/public/$1"
    }
  ]
}
```

**التكلفة / Cost:**
- Free: Hobby projects
- Pro: $20/month
- Enterprise: Custom

---

### خيار 3: Netlify

**مناسب لـ / Best for:** Static sites + Serverless

#### الخطوات / Steps:

1. **تثبيت Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **تسجيل الدخول**
   ```bash
   netlify login
   ```

3. **النشر**
   ```bash
   netlify deploy --prod
   ```

#### إعداد netlify.toml:

```toml
[build]
  command = "npm run build"
  publish = "dist/public"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**التكلفة / Cost:**
- Free: 100GB bandwidth
- Pro: $19/month
- Business: $99/month

---

### خيار 4: Railway

**مناسب لـ / Best for:** Full-stack + Database

#### الخطوات / Steps:

1. **إنشاء حساب على Railway**
   ```
   https://railway.app
   ```

2. **ربط GitHub Repository**
   - اختر CarXpert repository

3. **إضافة متغيرات البيئة**
   - PORT=5000
   - NODE_ENV=production

4. **النشر التلقائي**
   - يتم تلقائياً عند git push

**التكلفة / Cost:**
- Free: $5 credit/month
- Developer: $5/month + usage
- Team: $20/month + usage

---

### خيار 5: DigitalOcean App Platform

#### الخطوات / Steps:

1. **إنشاء حساب DigitalOcean**

2. **إنشاء App من GitHub**
   - اربط repository
   - اختر branch

3. **إعداد Build Command**
   ```bash
   npm run build
   ```

4. **إعداد Run Command**
   ```bash
   npm start
   ```

**التكلفة / Cost:**
- Basic: $5/month
- Professional: $12/month
- Production: $25+/month

---

### خيار 6: AWS (Amazon Web Services)

**مناسب لـ / Best for:** Enterprise scale

#### الخطوات المختصرة / Quick Steps:

1. **استخدام Elastic Beanstalk**
   ```bash
   eb init
   eb create
   eb deploy
   ```

2. **أو استخدام EC2**
   - إنشاء EC2 instance
   - تثبيت Node.js
   - استنساخ المشروع
   - تشغيل مع PM2

**التكلفة / Cost:**
- EC2 t2.micro: Free tier (1 year)
- t3.small: ~$15/month
- Load balancer: ~$16/month

---

### خيار 7: Google Cloud Platform

#### استخدام Cloud Run:

```bash
# بناء Docker image
gcloud builds submit --tag gcr.io/PROJECT_ID/carxpert

# النشر
gcloud run deploy carxpert --image gcr.io/PROJECT_ID/carxpert
```

**التكلفة / Cost:**
- Free tier: 2M requests/month
- Paid: Pay per use

---

### خيار 8: VPS (Virtual Private Server)

**مثل / Like:** DigitalOcean Droplet, Linode, Vultr

#### الخطوات الكاملة / Complete Steps:

1. **إنشاء VPS**
   - Ubuntu 22.04 LTS
   - 2GB RAM minimum
   - $5-$10/month

2. **الاتصال بالخادم**
   ```bash
   ssh root@your-server-ip
   ```

3. **تثبيت Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **تثبيت PM2**
   ```bash
   sudo npm install -g pm2
   ```

5. **استنساخ المشروع**
   ```bash
   cd /var/www
   git clone https://github.com/omarabdhkem/CarXpert.git
   cd CarXpert
   npm install
   npm run build
   ```

6. **تشغيل مع PM2**
   ```bash
   pm2 start dist/index.js --name carxpert
   pm2 save
   pm2 startup
   ```

7. **إعداد Nginx (اختياري)**
   ```bash
   sudo apt install nginx
   ```

   إنشاء ملف `/etc/nginx/sites-available/carxpert`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   تفعيل الإعداد:
   ```bash
   sudo ln -s /etc/nginx/sites-available/carxpert /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **إعداد SSL (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 7️⃣ الاستضافة / Hosting Options

### مقارنة الخيارات / Comparison

| المنصة / Platform | السعر / Price | السهولة / Ease | الأداء / Performance | التوصية / Recommendation |
|------------------|--------------|----------------|---------------------|--------------------------|
| **Replit** | $0-$25/mo | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | للتطوير / Development |
| **Vercel** | $0-$20/mo | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ أفضل / Best |
| **Netlify** | $0-$19/mo | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ممتاز / Excellent |
| **Railway** | $5+/mo | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | جيد جداً / Very Good |
| **DigitalOcean** | $5+/mo | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | موثوق / Reliable |
| **AWS** | $15+/mo | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | للشركات / Enterprise |
| **GCP** | Usage | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | مرن / Flexible |
| **VPS** | $5-$20/mo | ⭐⭐ | ⭐⭐⭐⭐ | تحكم كامل / Full Control |

### التوصية حسب الحالة / Recommendation by Case:

🎯 **للبداية / Getting Started:**
→ Vercel أو Netlify (سهل ومجاني)

🎯 **للمشاريع الصغيرة / Small Projects:**
→ Railway أو Replit ($5-$25/mo)

🎯 **للمشاريع المتوسطة / Medium Projects:**
→ DigitalOcean App Platform ($12-$25/mo)

🎯 **للمشاريع الكبيرة / Large Projects:**
→ AWS أو GCP (مع Auto-scaling)

🎯 **للتحكم الكامل / Full Control:**
→ VPS مع PM2 + Nginx

---

## 8️⃣ قاعدة البيانات / Database

### الوضع الحالي / Current Status

المشروع يستخدم **In-Memory Storage** (تخزين مؤقت في الذاكرة)

**المميزات / Pros:**
✅ سريع جداً / Very fast
✅ لا يحتاج إعداد / No setup needed
✅ مثالي للتطوير / Perfect for development

**العيوب / Cons:**
❌ البيانات تختفي عند إعادة التشغيل / Data lost on restart
❌ غير مناسب للإنتاج / Not suitable for production

### الانتقال لقاعدة بيانات حقيقية / Move to Real Database

#### خيار 1: PostgreSQL (موصى به / Recommended) ⭐⭐⭐

**مقدمي الخدمة / Providers:**

1. **Neon.tech** (مجاني! / Free!)
   ```
   https://neon.tech
   - Free tier: 3 projects
   - 10 GB storage
   - Serverless
   ```

2. **Supabase**
   ```
   https://supabase.com
   - Free tier: 2 projects
   - 500 MB storage
   - Real-time features
   ```

3. **Railway PostgreSQL**
   ```
   - $5/month
   - Easy integration
   ```

#### خطوات الإعداد / Setup Steps:

1. **إنشاء قاعدة بيانات على Neon**
   - سجل في https://neon.tech
   - إنشاء مشروع جديد
   - انسخ Connection String

2. **إضافة المتغير البيئي**
   ```bash
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
   ```

3. **تشغيل Migrations**
   ```bash
   npm run db:push
   ```

4. **تحديث الكود**
   - المشروع جاهز للتكامل مع PostgreSQL
   - يستخدم Drizzle ORM

---

## 9️⃣ المتغيرات البيئية / Environment Variables

### إنشاء ملف .env

```bash
# انسخ ملف المثال / Copy example file
cp .env.example .env
```

### المتغيرات المطلوبة / Required Variables

```env
# بيئة التطوير / Environment
NODE_ENV=development

# المنفذ / Port
PORT=5000

# قاعدة البيانات (اختياري حالياً) / Database (optional currently)
DATABASE_URL=postgresql://user:password@host/database

# سر الجلسة / Session Secret
SESSION_SECRET=your-super-secret-key-here-change-this

# Google Maps API (للخرائط) / For Maps
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# تحميل الصور (اختياري) / Image Upload (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### توليد Session Secret

```bash
# استخدام Node.js / Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### المتغيرات للإنتاج / Production Variables

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
SESSION_SECRET=generated-secret-key
GOOGLE_MAPS_API_KEY=production-key
```

---

## 🔟 المراقبة والصيانة / Monitoring & Maintenance

### أدوات المراقبة / Monitoring Tools

#### 1. **PM2 Monitoring** (للـ VPS)

```bash
# تثبيت PM2
npm install -g pm2

# مراقبة
pm2 monit

# السجلات / Logs
pm2 logs carxpert

# حالة / Status
pm2 status

# إعادة التشغيل / Restart
pm2 restart carxpert
```

#### 2. **Vercel Analytics**
- مدمج تلقائياً / Built-in
- يعرض الأداء والأخطاء / Shows performance & errors

#### 3. **Sentry** (لتتبع الأخطاء / Error Tracking)

```bash
npm install @sentry/node @sentry/react
```

تكامل في `server/index.ts`:
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### السجلات / Logs

#### في التطوير / In Development:
```bash
# السجلات تظهر في Terminal
npm run dev
```

#### في الإنتاج / In Production:

**مع PM2:**
```bash
pm2 logs carxpert
pm2 logs carxpert --lines 100
pm2 logs carxpert --err  # الأخطاء فقط / Errors only
```

**مع Docker:**
```bash
docker logs carxpert-container
docker logs -f carxpert-container  # متابعة / Follow
```

### النسخ الاحتياطي / Backups

#### نسخ احتياطي لقاعدة البيانات / Database Backup:

**PostgreSQL:**
```bash
# نسخ احتياطي / Backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# استعادة / Restore
psql $DATABASE_URL < backup-20231206.sql
```

**تلقائي مع Cron:**
```bash
# تحرير crontab
crontab -e

# نسخ احتياطي يومي في 2 صباحاً
0 2 * * * pg_dump $DATABASE_URL > /backups/carxpert-$(date +\%Y\%m\%d).sql
```

### التحديثات / Updates

```bash
# تحديث التبعيات / Update dependencies
npm update

# التحقق من الأمان / Security check
npm audit

# إصلاح الثغرات / Fix vulnerabilities
npm audit fix
```

---

## 1️⃣1️⃣ استكشاف الأخطاء / Troubleshooting

### مشكلة: الخادم لا يبدأ / Server Won't Start

**الحل / Solution:**

```bash
# التحقق من المنفذ / Check port
lsof -i :5000
# أو / or
netstat -an | grep 5000

# قتل العملية / Kill process
kill -9 <PID>

# تغيير المنفذ / Change port
PORT=3000 npm run dev
```

### مشكلة: أخطاء TypeScript / TypeScript Errors

**الحل / Solution:**

```bash
# حذف ذاكرة التخزين المؤقت / Clear cache
rm -rf node_modules
rm package-lock.json

# إعادة التثبيت / Reinstall
npm install

# التحقق / Check
npm run check
```

### مشكلة: الاختبارات تفشل / Tests Failing

**الحل / Solution:**

```bash
# تحديث الاختبارات / Update tests
npm test -- --run

# مع المزيد من المعلومات / With more info
npm test -- --run --reporter=verbose
```

### مشكلة: البناء يفشل / Build Fails

**الحل / Solution:**

```bash
# تنظيف المجلد / Clean folder
rm -rf dist

# إعادة البناء / Rebuild
npm run build

# التحقق من المساحة / Check disk space
df -h
```

### مشكلة: بطء في الأداء / Slow Performance

**الحل / Solution:**

1. تفعيل التخزين المؤقت / Enable caching
2. تحسين الصور / Optimize images
3. استخدام CDN
4. Code splitting
5. Lazy loading

### الحصول على المساعدة / Getting Help

📧 **البريد الإلكتروني / Email:** support@carxpert.com  
💬 **GitHub Issues:** https://github.com/omarabdhkem/CarXpert/issues  
📚 **التوثيق / Documentation:** في المجلد `docs/`

---

## 📚 ملحق: أوامر سريعة / Quick Commands Reference

```bash
# التطوير / Development
npm run dev              # بدء خادم التطوير
npm run check           # التحقق من TypeScript
npm test               # تشغيل الاختبارات

# البناء / Building
npm run build          # بناء للإنتاج
npm start             # تشغيل الإنتاج

# الاختبار / Testing
npm test -- --run     # اختبار مرة واحدة
npm run test:ui       # واجهة الاختبار
npm run test:coverage # تغطية الاختبار

# قاعدة البيانات / Database
npm run db:push       # دفع المخطط

# الصيانة / Maintenance
npm update           # تحديث الحزم
npm audit            # فحص الأمان
npm audit fix        # إصلاح الأمان
```

---

## 🎯 الخلاصة / Summary

### للبدء السريع / Quick Start:

```bash
# 1. استنساخ المشروع / Clone project
git clone https://github.com/omarabdhkem/CarXpert.git
cd CarXpert

# 2. تثبيت التبعيات / Install dependencies
npm install

# 3. تشغيل التطوير / Run development
npm run dev

# 4. فتح المتصفح / Open browser
# http://localhost:5000
```

### للنشر السريع / Quick Deploy:

**الطريقة الأسهل / Easiest Way:**
1. ادفع الكود لـ GitHub / Push code to GitHub
2. اربطه مع Vercel / Connect with Vercel
3. انشر! / Deploy!

---

## ✅ قائمة المراجعة قبل النشر / Pre-Deployment Checklist

- [ ] جميع الاختبارات تنجح / All tests pass
- [ ] لا أخطاء TypeScript / No TypeScript errors
- [ ] البناء ناجح / Build succeeds
- [ ] المتغيرات البيئية معدة / Environment variables set
- [ ] قاعدة البيانات جاهزة / Database ready
- [ ] SSL معد (HTTPS) / SSL configured
- [ ] المراقبة معدة / Monitoring set up
- [ ] النسخ الاحتياطي معد / Backups configured

---

**🎉 مبروك! مشروعك جاهز للنشر! / Congratulations! Your project is ready to deploy!**

**للأسئلة والدعم / For questions and support:**  
اطلع على التقارير الأخرى في المشروع / Check other reports in the project

---

**آخر تحديث / Last Updated:** ديسمبر 2025 / December 2025  
**الإصدار / Version:** 1.0.0  
**الحالة / Status:** ✅ **جاهز / READY**
