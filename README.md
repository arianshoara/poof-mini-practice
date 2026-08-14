# POOF Mini Practice

A small learning project for exploring the core architecture of POOF.

یک پروژه‌ی تمرینی کوچک برای یادگیری معماری و سازوکارهای اصلی POOF.

## هدف پروژه

POOF Mini Practice نسخه‌ی اصلی و Production پروژه‌ی POOF نیست.

هدف این پروژه این است که پیش از ساخت پلتفرم اصلی، مفاهیم مهم آن را در مقیاس کوچک و قابل‌کنترل تمرین کنم:

- ساخت سایت چندصفحه‌ای
- کار با HTML، CSS و Vanilla JavaScript
- مدیریت Navigation مشترک
- طراحی رابط براساس داده
- خواندن اطلاعات از فایل‌های JSON
- ساخت دیکشنری کوچک
- ساخت و ذخیره‌ی کارت‌های شخصی
- استفاده از localStorage
- مدیریت تم‌ها
- نگه‌داشتن Context میان درس، داستان، دیکشنری و کارت
- یادگیری Git و GitHub

## مسیر اصلی یادگیری

درس یا داستان → انتخاب واژه → دیکشنری → ساخت کارت → مجموعه‌ی کارت‌ها

واژه هنگام انتقال میان این بخش‌ها باید جمله، منبع و Context اصلی خود را حفظ کند.

## فناوری‌های فعلی

این پروژه در حال حاضر از ابزارهای زیر استفاده می‌کند:

- HTML
- CSS
- Vanilla JavaScript
- localStorage
- GitHub Pages

در مرحله‌ی بعد، فایل‌های JSON نیز به پروژه اضافه خواهند شد.

## خارج از محدوده‌ی فعلی

فعلاً این موارد ساخته نمی‌شوند:

- Backend
- دیتابیس واقعی
- حساب کاربری
- Authentication
- هوش مصنوعی
- API دیکشنری خارجی
- React یا Frameworkهای دیگر

این فناوری‌ها ممکن است در نسخه‌های تمرینی بعدی اضافه شوند.

## وضعیت توسعه

### v0.1.0 — Skeleton ✅

اولین Milestone پروژه تکمیل و منتشر شده است.

موارد تکمیل‌شده:

- [x] ساخت Repository
- [x] نوشتن README اولیه
- [x] انتشار سایت با GitHub Pages
- [x] ساخت صفحات Home، Learn، Library، Cards و Account
- [x] اتصال صفحات به CSS مشترک
- [x] ساخت Navigation مشترک با JavaScript
- [x] تشخیص خودکار صفحه‌ی فعال
- [x] ساخت Navigation پنج‌ستونه
- [x] ثابت‌کردن Navigation در پایین نمایشگر
- [x] ساخت ظاهر شناور و شیشه‌ای Navigation
- [x] انتشار Tag و Release نسخه‌ی v0.1.0

### v0.2.0 — Interface Foundation 🚧

این نسخه در حال توسعه است.

موارد پیاده‌سازی‌شده:

- [x] ساخت تم Classic
- [x] ساخت تم Snowy
- [x] تعریف رنگ‌ها با CSS Variables
- [x] جداسازی متغیرهای تم در `css/themes.css`
- [x] ساخت کنترل‌کننده‌ی مشترک در `js/theme.js`
- [x] ساخت انتخاب‌گر تم در صفحه‌ی Account
- [x] ذخیره‌ی تم انتخاب‌شده در localStorage
- [x] حفظ تم بعد از Refresh و تعویض صفحه
- [x] اعتبارسنجی مقدار ذخیره‌شده
- [x] نمایش وضعیت انتخاب‌شده با `aria-pressed`
- [x] پشتیبانی از `prefers-reduced-motion`
- [x] اضافه‌کردن انتقال نرم میان تم‌ها
- [x] بهبود Viewport و Safe Area در موبایل
- [x] پیاده‌سازی آزمایشی مخفی‌شدن Navigation هنگام اسکرول رو به پایین
- [x] ساخت Architecture Decision Log

موارد باقی‌مانده:

- [ ] هماهنگ‌کردن تم پیش‌فرض CSS و JavaScript
- [ ] آزمایش نهایی Classic و Snowy
- [ ] آزمایش Refresh و جابه‌جایی میان صفحات
- [ ] آزمایش کامل Navigation با محتوای بلند
- [ ] بازبینی مستندات
- [ ] ساخت Tag و Release نسخه‌ی v0.2.0

قابلیت مخفی‌شدن Navigation هنوز Provisional است و هنگام اضافه‌شدن محتوای واقعی Learn دوباره آزمایش خواهد شد.

## مرحله‌ی بعد

### v0.3.0 — Data-Driven Learn

در این مرحله داده برای اولین بار وارد معماری پروژه می‌شود:

- ساخت پوشه‌ی `data`
- ساخت فایل `data/lessons.json`
- ساخت فایل `js/learn.js`
- دریافت اطلاعات با `fetch`
- ساخت Lesson Card از روی داده
- طراحی حالت Loading
- طراحی حالت Empty
- طراحی حالت Error
- جلوگیری از نوشتن دستی و تکراری درس‌ها در HTML

## ساختار فعلی پروژه

- `index.html` — صفحه‌ی Home
- `learn.html` — صفحه‌ی Learn
- `library.html` — صفحه‌ی Library
- `cards.html` — صفحه‌ی Cards
- `account.html` — صفحه‌ی Account
- `css/main.css` — ساختار، Componentها و رفتار ظاهری
- `css/themes.css` — متغیرهای تم Classic و Snowy
- `js/navigation.js` — ساخت و کنترل Navigation
- `js/theme.js` — انتخاب، اعتبارسنجی و ذخیره‌ی تم
- `docs/decisions.md` — تصمیم‌های مهم معماری

## قانون اصلی تمرین

هیچ قابلیت یا فایلی نباید فقط برای بزرگ‌تر یا زیباتر نشان‌دادن پروژه اضافه شود.

هر بخش باید یک مفهوم واقعی و قابل‌استفاده برای پروژه‌ی اصلی POOF را تمرین کند.
