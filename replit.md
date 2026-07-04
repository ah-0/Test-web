# AQB EDU — تطبيق تعليمي شامل

## نظرة عامة
تطبيق تعليمي عربي متعدد الصفحات يعمل كـ Progressive Web App (PWA) وكتطبيق Capacitor Native على iOS وAndroid.

## البنية
```
/
├── index.html          الصفحة الرئيسية — لوحة متابعة مع إحصائيات
├── onboarding.html     شاشة الترحيب — يعرض مرة واحدة عند أول تشغيل
├── courses.html        المواد الدراسية — إدارة المواد وتتبع التقدم
├── quiz.html           الاختبارات — بنك أسئلة متعدد الاختيارات (URL: ?subject=math)
├── flashcards.html     البطاقات التعليمية — نظام flip cards للحفظ
├── schedule.html       الجدول الدراسي — مواعيد + مؤقت عدّ تنازلي + إشعارات
├── leaderboard.html    المتصدرون — ترتيب الطلاب بالنقاط
├── profile.html        الملف الشخصي — صورة + إحصائيات + إنجازات
├── notifications.html  الإشعارات — تذكيرات يومية وإشعارات الجدول
├── settings.html       الإعدادات — تفضيلات + إعادة ضبط
├── css/style.css       CSS مشترك — تصميم داكن أزرق RTL
└── js/app.js           JS مشترك — Capacitor bridge utilities
```

## التشغيل
هذا موقع ستاتيك بحت (HTML/CSS/JS) — لا يحتاج خادم خلفي.
- **محلياً**: افتح `index.html` مباشرة في المتصفح
- **Replit Preview**: يعمل عبر خادم HTTP بسيط على المنفذ 5000
- **GitHub Pages**: رفع الملفات على `gh-pages` branch
- **Capacitor**: نسخ الملفات إلى `www/` ثم `npx cap sync`

## التقنيات
- **Capacitor 6** — Native bridge (Share, Haptics, Camera, Notifications, Preferences, Dialog, Toast)
- **HTML/CSS/JS** خالص — بدون frameworks أو build tools
- **RTL (right-to-left)** — عربي كامل
- **Dark Blue Theme** — CSS variables قابلة للتخصيص

## ميزات Capacitor المستخدمة
| الميزة | الاستخدام |
|--------|-----------|
| `@capacitor/toast` | رسائل Toast في كل الصفحات |
| `@capacitor/haptics` | اهتزاز عند الإجابات والتفاعل |
| `@capacitor/preferences` | حفظ التقدم والإعدادات محلياً |
| `@capacitor/share` | مشاركة النتائج والملف الشخصي |
| `@capacitor/camera` | رفع صورة الملف الشخصي |
| `@capacitor/local-notifications` | تذكيرات الجدول الدراسي |
| `@capacitor/dialog` | نوافذ حوار (Alert/Confirm/Prompt) |
| `@capacitor/network` | فحص حالة الشبكة |

## User preferences
- اللغة: العربية RTL
- التصميم: داكن أزرق (dark blue)
- التقنيات: HTML/CSS/JS خالص بدون frameworks
- الاستضافة: GitHub Pages + Capacitor Native
