# 🐳 دليل Docker للنشر السريع
# Docker Deployment Quick Guide

**المشروع / Project:** CarXpert  
**النشر بـ Docker + PostgreSQL**

---

## 🚀 البدء السريع / Quick Start

### المتطلبات / Prerequisites

```bash
✅ Docker 20.10+ مثبت / installed
✅ Docker Compose 2.0+ مثبت / installed
```

التحقق / Check:
```bash
docker --version
docker-compose --version
```

---

## ⚡ تشغيل المشروع في خطوة واحدة / Run in One Command

```bash
docker-compose up -d
```

**ذلك كل شيء! / That's it!** 🎉

المشروع الآن يعمل على / Project now running at:
- **التطبيق / App:** http://localhost:5000
- **قاعدة البيانات / Database Admin:** http://localhost:8080

---

## 📦 ما يتضمنه / What's Included

### الحاويات / Containers:

1. **carxpert-app** - تطبيق CarXpert
   - Node.js 20
   - منفذ / Port: 5000
   - بناء تلقائي / Auto-build

2. **carxpert-db** - قاعدة بيانات PostgreSQL
   - PostgreSQL 16
   - منفذ / Port: 5432
   - بيانات دائمة / Persistent data

3. **carxpert-adminer** - واجهة إدارة قاعدة البيانات
   - Adminer UI
   - منفذ / Port: 8080
   - (اختياري / Optional)

---

## 🛠️ الأوامر المتاحة / Available Commands

### بدء المشروع / Start Project
```bash
# بدء جميع الخدمات / Start all services
docker-compose up -d

# عرض السجلات / Show logs
docker-compose logs -f

# عرض سجلات التطبيق فقط / App logs only
docker-compose logs -f app
```

### إيقاف المشروع / Stop Project
```bash
# إيقاف الخدمات / Stop services
docker-compose down

# إيقاف + حذف البيانات / Stop + delete data
docker-compose down -v
```

### إعادة البناء / Rebuild
```bash
# إعادة بناء بعد تغيير الكود / Rebuild after code changes
docker-compose up -d --build

# إعادة بناء حاوية معينة / Rebuild specific container
docker-compose up -d --build app
```

### الصيانة / Maintenance
```bash
# التحقق من الحالة / Check status
docker-compose ps

# الدخول لحاوية التطبيق / Enter app container
docker-compose exec app sh

# الدخول لقاعدة البيانات / Enter database
docker-compose exec postgres psql -U carxpert_user -d carxpert

# عرض استخدام الموارد / Show resource usage
docker stats
```

---

## 🔧 الإعدادات / Configuration

### المتغيرات البيئية / Environment Variables

إنشاء ملف `.env` في المجلد الرئيسي:

```bash
# نسخ الملف المثال / Copy example file
cp .env.docker .env

# تحرير القيم / Edit values
nano .env
```

**مهم / Important:** غير هذه القيم في الإنتاج!

```env
DB_PASSWORD=your-secure-password-here
SESSION_SECRET=your-random-secret-key-here
GOOGLE_MAPS_API_KEY=your-api-key-here
```

### توليد Session Secret آمن / Generate Secure Session Secret

```bash
# استخدام OpenSSL
openssl rand -hex 32

# أو استخدام Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📊 الوصول للخدمات / Access Services

### التطبيق / Application
```
URL: http://localhost:5000
Status: http://localhost:5000/api/health
```

### قاعدة البيانات / Database
```
Host: localhost
Port: 5432
Database: carxpert
User: carxpert_user
Password: (من .env ملف / from .env)
```

### Adminer (إدارة قاعدة البيانات)
```
URL: http://localhost:8080
System: PostgreSQL
Server: postgres
Username: carxpert_user
Password: (من .env ملف / from .env)
Database: carxpert
```

---

## 🗄️ قاعدة البيانات / Database

### الاتصال من التطبيق / Connection from App
```
DATABASE_URL=postgresql://carxpert_user:password@postgres:5432/carxpert
```

### النسخ الاحتياطي / Backup
```bash
# إنشاء نسخة احتياطية / Create backup
docker-compose exec postgres pg_dump -U carxpert_user carxpert > backup.sql

# استعادة / Restore
docker-compose exec -T postgres psql -U carxpert_user carxpert < backup.sql
```

### تشغيل Migrations
```bash
# داخل حاوية التطبيق / Inside app container
docker-compose exec app npm run db:push
```

---

## 🌐 النشر على الإنتاج / Production Deployment

### على خادم VPS / On VPS Server

```bash
# 1. نسخ الملفات للخادم / Copy files to server
scp -r * user@server:/path/to/carxpert/

# 2. SSH للخادم / SSH to server
ssh user@server

# 3. الانتقال للمجلد / Navigate to folder
cd /path/to/carxpert

# 4. إعداد البيئة / Setup environment
cp .env.docker .env
nano .env  # تحديث القيم / Update values

# 5. تشغيل / Run
docker-compose up -d
```

### مع Nginx (Reverse Proxy)

```nginx
# /etc/nginx/sites-available/carxpert
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

تفعيل:
```bash
sudo ln -s /etc/nginx/sites-available/carxpert /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL مع Let's Encrypt

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 📋 استكشاف الأخطاء / Troubleshooting

### المشكلة: الحاوية لا تبدأ / Container won't start

```bash
# عرض السجلات / Check logs
docker-compose logs app

# إعادة البناء / Rebuild
docker-compose down
docker-compose up -d --build
```

### المشكلة: قاعدة البيانات لا تتصل / Database won't connect

```bash
# التحقق من حالة قاعدة البيانات / Check database status
docker-compose ps postgres

# إعادة تشغيل قاعدة البيانات / Restart database
docker-compose restart postgres

# عرض سجلات قاعدة البيانات / Check database logs
docker-compose logs postgres
```

### المشكلة: المنفذ مستخدم / Port already in use

```bash
# تغيير المنفذ في docker-compose.yml
# Change port in docker-compose.yml
ports:
  - "3000:5000"  # استخدام 3000 بدلاً من 5000 / Use 3000 instead of 5000
```

### المشكلة: نفاد المساحة / Out of disk space

```bash
# تنظيف الموارد غير المستخدمة / Clean unused resources
docker system prune -a --volumes

# حذف الصور القديمة / Remove old images
docker image prune -a
```

---

## 🔒 الأمان / Security

### قائمة التحقق / Security Checklist

- [ ] تغيير `DB_PASSWORD` في `.env`
- [ ] تغيير `SESSION_SECRET` في `.env`
- [ ] إضافة `.env` إلى `.gitignore`
- [ ] استخدام HTTPS في الإنتاج
- [ ] تعطيل Adminer في الإنتاج
- [ ] تفعيل firewall
- [ ] نسخ احتياطي منتظم

### تعطيل Adminer في الإنتاج

تعليق القسم في `docker-compose.yml`:
```yaml
# adminer:
#   image: adminer:latest
#   ...
```

---

## 📈 المراقبة / Monitoring

### استخدام الموارد / Resource Usage

```bash
# معلومات مباشرة / Live stats
docker stats

# استخدام المساحة / Disk usage
docker system df
```

### Logs

```bash
# جميع السجلات / All logs
docker-compose logs -f

# آخر 100 سطر / Last 100 lines
docker-compose logs --tail=100

# سجلات الأخطاء فقط / Error logs only
docker-compose logs app | grep -i error
```

---

## 🚀 التحديثات / Updates

### تحديث الكود / Update Code

```bash
# 1. سحب التحديثات / Pull updates
git pull origin main

# 2. إعادة البناء والتشغيل / Rebuild and restart
docker-compose up -d --build

# 3. تشغيل migrations (إن وجدت) / Run migrations if any
docker-compose exec app npm run db:push
```

### تحديث Docker Images

```bash
# سحب أحدث الصور / Pull latest images
docker-compose pull

# إعادة التشغيل / Restart
docker-compose up -d
```

---

## 💡 نصائح / Tips

✅ **للتطوير / For Development:**
```bash
# استخدام volume للتحديث المباشر / Use volume for live reload
# أضف في docker-compose.yml:
volumes:
  - .:/app
  - /app/node_modules
```

✅ **للإنتاج / For Production:**
```bash
# استخدام restart: always / Use restart: always
restart: always
```

✅ **للأداء / For Performance:**
```bash
# تخصيص موارد أكثر / Allocate more resources
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
```

---

## 📞 الدعم / Support

🐛 **مشكلة؟ / Issue?**
- تحقق من السجلات / Check logs: `docker-compose logs -f`
- راجع التوثيق / Check docs: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

📧 **أسئلة؟ / Questions?**
- GitHub Issues: https://github.com/omarabdhkem/CarXpert/issues

---

## 🎯 الخلاصة / Summary

### للبدء السريع / Quick Start:
```bash
# 1. استنساخ / Clone
git clone https://github.com/omarabdhkem/CarXpert.git
cd CarXpert

# 2. إعداد البيئة / Setup environment
cp .env.docker .env
# تحرير .env وتغيير القيم

# 3. تشغيل / Run
docker-compose up -d

# 4. فتح المتصفح / Open browser
# http://localhost:5000
```

**🎉 مبروك! المشروع يعمل! / Congratulations! Project is running!**

---

**آخر تحديث / Last Updated:** ديسمبر 2025 / December 2025  
**الإصدار / Version:** 1.0.0  
**الحالة / Status:** ✅ **جاهز / READY**
