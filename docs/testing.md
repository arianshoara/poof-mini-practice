# چک‌لیست تست دستی پروژه

این فایل نتیجه‌ی آزمایش‌های دستی پروژه را پیش از انتشار هر نسخه ثبت می‌کند.

## معنی علامت‌ها

- `[ ]` هنوز آزمایش نشده یا درست کار نکرده است
- `[x]` آزمایش شده و درست کار می‌کند

---

# تست نسخه‌ی v0.2.0

## ۱. آزمایش صفحه‌ها

- [x] صفحه Home بدون خطای ظاهری باز می‌شود
- [x] صفحه Learn بدون خطای ظاهری باز می‌شود
- [x] صفحه Library بدون خطای ظاهری باز می‌شود
- [x] صفحه Cards بدون خطای ظاهری باز می‌شود
- [x] صفحه Account بدون خطای ظاهری باز می‌شود
- [x] هیچ صفحه‌ای اسکرول افقی ناخواسته ندارد

## ۲. آزمایش Navigation

- [x] Navigation هنگام بازشدن صفحه کامل دیده می‌شود
- [x] ترتیب گزینه‌ها Account، Learn، Home، Cards و Library است
- [x] هر گزینه صفحه‌ی درست را باز می‌کند
- [x] صفحه‌ی فعال با رنگ و ظاهر متفاوت مشخص می‌شود
- [x] Home در مرکز Navigation قرار دارد
- [x] Navigation روی محتوای اصلی صفحه را نمی‌پوشاند
- [x] Navigation در پایین موبایل کامل دیده می‌شود
- [x] هنگام لمس گزینه‌ها کادر آبی ناخواسته ظاهر نمی‌شود

## ۳. آزمایش تم پیش‌فرض

این قسمت باید در حالت ناشناس یا Incognito مرورگر آزمایش شود.

- [x] سایت برای کاربر جدید با Classic باز می‌شود
- [x] در Account گزینه Classic انتخاب‌شده است
- [x] متن `Current theme: Classic` نمایش داده می‌شود
- [x] هنگام بازشدن صفحه، Snowy برای یک لحظه ظاهر نمی‌شود

## ۴. آزمایش تغییر تم

- [x] انتخاب Snowy رنگ‌های صفحه را تغییر می‌دهد
- [x] گزینه Snowy به‌عنوان گزینه‌ی فعال مشخص می‌شود
- [x] متن وضعیت به `Current theme: Snowy` تغییر می‌کند
- [x] رنگ Header در Snowy درست تغییر می‌کند
- [x] رنگ پس‌زمینه در Snowy درست تغییر می‌کند
- [x] رنگ Navigation در Snowy درست تغییر می‌کند
- [x] تغییر میان Classic و Snowy نرم انجام می‌شود
- [x] انتخاب دوباره Classic ظاهر را به حالت Classic برمی‌گرداند

## ۵. آزمایش ذخیره‌شدن تم

- [x] Snowy بعد از Refresh باقی می‌ماند
- [x] Snowy بعد از رفتن به Home باقی می‌ماند
- [x] Snowy بعد از رفتن به Learn باقی می‌ماند
- [x] Snowy بعد از رفتن به Library باقی می‌ماند
- [x] Snowy بعد از رفتن به Cards باقی می‌ماند
- [x] Snowy بعد از برگشتن به Account باقی می‌ماند
- [x] Classic بعد از Refresh باقی می‌ماند
- [x] Classic هنگام جابه‌جایی میان صفحه‌ها باقی می‌ماند

## ۶. آزمایش در مرورگر دوم

- [x] سایت در مرورگر دوم درست باز می‌شود
- [x] Navigation در مرورگر دوم کار می‌کند
- [x] Classic و Snowy در مرورگر دوم کار می‌کنند
- [x] تم انتخاب‌شده در مرورگر دوم بعد از Refresh باقی می‌ماند

---

## آزمایش عقب‌افتاده

قابلیت مخفی‌شدن Navigation هنگام اسکرول رو به پایین پیاده‌سازی شده است، اما صفحه‌های فعلی محتوای کافی برای آزمایش دقیق آن ندارند.

این قابلیت در نسخه‌ی v0.3.0 و هنگام اضافه‌شدن درس‌های واقعی دوباره آزمایش خواهد شد.

وضعیت فعلی این قابلیت:

**Provisional — نیازمند آزمایش با محتوای بلند**

---

# تست نسخه‌ی v0.3.0 — Data-driven Learn

## دریافت و نمایش داده

- [x] فایل `data/lessons.json` با موفقیت دریافت می‌شود
- [x] سه درس موجود در JSON نمایش داده می‌شوند
- [x] کارت‌های درس با JavaScript ساخته می‌شوند
- [x] درس‌ها بر اساس مقدار `order` مرتب می‌شوند
- [x] وضعیت Available و Coming soon درست نمایش داده می‌شود
- [x] زمان، سطح، عنوان و توضیح هر درس نمایش داده می‌شود

## وضعیت‌های رابط کاربری

- [x] حالت Loading آزمایش شد
- [x] حالت Empty آزمایش شد
- [x] حالت Error آزمایش شد
- [x] حالت Success و نمایش کارت‌ها آزمایش شد

## قرارداد داده

- [x] برنامه آرایه‌بودن اطلاعات درس‌ها را بررسی می‌کند
- [x] ساختار هر درس با `isValidLesson()` بررسی می‌شود
- [x] مقدارهای مجاز `status` محدود شده‌اند
- [x] تکراری‌بودن `id` بررسی می‌شود
- [x] تکراری‌بودن `order` بررسی می‌شود

## ظاهر و رفتار

- [x] کارت‌ها در تم Classic درست نمایش داده می‌شوند
- [x] کارت‌ها در تم Snowy درست نمایش داده می‌شوند
- [x] صفحه‌ی Learn در موبایل درست نمایش داده می‌شود
- [x] صفحه‌ی Learn در دسکتاپ درست نمایش داده می‌شود
- [x] Navigation با محتوای بلند Learn آزمایش شد
- [x] Navigation هنگام اسکرول نرم مخفی و ظاهر می‌شود

## آزمایش‌های عقب‌افتاده

ورودی‌های نامعتبر و شناسه‌های تکراری عمداً وارد فایل اصلی نشدند تا نسخه‌ی آنلاین پروژه خراب نشود. این موارد در مرحله‌ی تست خودکار دوباره بررسی خواهند شد.

وضعیت:

**Implemented — automated test pending**

---

# تست نسخه‌ی v0.4.0 — Storage Layer

## خواندن اطلاعات

- [x] صفحه Cards بدون وجود اطلاعات قبلی باز می‌شود
- [x] Storage خالی به‌صورت آرایه‌ی خالی مدیریت می‌شود
- [x] تعداد کارت‌ها داخل صفحه Cards نمایش داده می‌شود
- [x] کارت معتبر ذخیره‌شده بعد از Refresh دوباره خوانده می‌شود

## ذخیره‌کردن کارت

- [x] یک کارت آزمایشی با `addCard()` ذخیره شد
- [x] تعداد کارت‌ها بعد از ذخیره از صفر به یک تغییر کرد
- [x] کارت بعد از Refresh باقی ماند
- [x] کارت بعد از تغییر Theme باقی ماند
- [x] از ایجاد دوباره‌ی کارت آزمایشی توسط رابط تست جلوگیری شد

## حذف کارت

- [x] کارت آزمایشی با `deleteCard()` حذف شد
- [x] تعداد کارت‌ها بعد از حذف به حالت خالی برگشت
- [x] کارت حذف‌شده بعد از Refresh بازنگشت

## قرارداد و اعتبارسنجی

- [x] ساختار اصلی Storage دارای `schema_version` است
- [x] آرایه‌بودن `cards` بررسی می‌شود
- [x] ورودی کارت پیش از ذخیره اعتبارسنجی می‌شود
- [x] کارت ذخیره‌شده هنگام خواندن اعتبارسنجی می‌شود
- [x] فرمت `created_at` و `updated_at` بررسی می‌شود
- [x] یکتابودن شناسه‌های کارت بررسی می‌شود
- [x] Storage در مرورگرهای مختلف مستقل باقی می‌ماند

## رابط عمومی Storage

عملیات زیر پیاده‌سازی شده‌اند:

- [x] `getCards()`
- [x] `addCard()`
- [x] `deleteCard()`
- [x] `getCardById()`
- [x] `updateCard()`


---

# تست نسخه‌ی v0.5.0 — Card Builder & Card Management

## جریان واقعی ویرایش

- [x] `getCardById()` از طریق جریان واقعی Edit آزمایش شد
- [x] `updateCard()` از طریق Card Builder واقعی آزمایش شد
- [x] هنگام ویرایش، `id` کارت ثابت باقی ماند
- [x] هنگام ویرایش، `created_at` ثابت باقی ماند
- [x] هنگام ویرایش، `updated_at` تغییر کرد
- [x] محتوای ویرایش‌شده بعد از Refresh باقی ماند

## مرتب‌سازی کارت‌ها

- [x] Newest براساس `created_at` درست مرتب می‌شود
- [x] Oldest براساس `created_at` درست مرتب می‌شود
- [x] Alphabetical درست کار می‌کند
- [x] ویرایش کارت ترتیب زمانی مبتنی بر `created_at` را تغییر نمی‌دهد
- [x] مرتب‌سازی بعد از Refresh همچنان درست است

## حفظ انتخاب Sort

- [x] انتخاب Oldest بعد از Refresh باقی می‌ماند
- [x] انتخاب Alphabetical بعد از Refresh باقی می‌ماند
- [x] انتخاب Newest بعد از Refresh باقی می‌ماند
- [x] انتخاب Sort بعد از رفتن به صفحه‌ی دیگر و بازگشت به Cards باقی می‌ماند
- [x] ترتیب واقعی کارت‌ها با گزینه‌ی Sort ذخیره‌شده هماهنگ باقی می‌ماند

## Regression اصلی

جریان کامل زیر با موفقیت آزمایش شد:

`Create → Refresh → Edit → Refresh → Search → Sort → Delete → Refresh`

- [x] کارت جدید ساخته می‌شود
- [x] کارت بعد از Refresh باقی می‌ماند
- [x] Edit همان کارت را تغییر می‌دهد و Duplicate ایجاد نمی‌کند
- [x] تغییرات Edit بعد از Refresh باقی می‌مانند
- [x] Search برای نتیجه‌ی موجود درست کار می‌کند
- [x] Search برای نتیجه‌ی ناموجود درست کار می‌کند
- [x] هر سه حالت Sort بدون حذف یا Duplicate کارت‌ها کار می‌کنند
- [x] Delete Confirmation درست کار می‌کند
- [x] فقط کارت انتخاب‌شده حذف می‌شود
- [x] کارت حذف‌شده بعد از Refresh بازنمی‌گردد
- [x] سایر کارت‌ها بعد از Delete سالم باقی می‌مانند

## Desktop، Theme و Console

- [x] جریان Card Management در Desktop آزمایش شد
- [x] جریان Card Management در Classic آزمایش شد
- [x] جریان Card Management در Snowy آزمایش شد
- [x] تغییر Theme منطق Card Management را تغییر نمی‌دهد
- [x] Delete Dialog در هر دو Theme درست نمایش داده می‌شود
- [x] هنگام جریان آزمایش‌شده Console Error مرتبط با پروژه مشاهده نشد

## Mobile

- [x] صفحه‌ی Cards در Mobile درست نمایش داده می‌شود
- [x] Card Builder در Mobile قابل استفاده است
- [x] Search و Sort در Mobile قابل استفاده‌اند
- [x] Edit و Delete در Mobile کار می‌کنند
- [x] Delete Dialog در Mobile داخل صفحه درست نمایش داده می‌شود
- [x] Bottom Navigation مانع استفاده از Cards نمی‌شود
- [x] جریان کارت در Classic روی Mobile آزمایش شد
- [x] جریان کارت در Snowy روی Mobile آزمایش شد
- [x] در عرض حدود `320px` اسکرول افقی ناخواسته مشاهده نشد
- [x] در عرض حدود `320px` Search، Sort و Delete Dialog قابل استفاده باقی ماندند




##---

# تست نسخه‌ی v0.6.0 — Storage Migration & Recovery

## تفکیک مسیر خواندن Storage

- [x] خواندن Raw Storage از Parse جدا شد
- [x] Parse داده‌ی JSON به مرحله‌ی مستقل تبدیل شد
- [x] تشخیص `schema_version` به‌صورت مستقل انجام می‌شود
- [x] Validation بعد از تشخیص Version انجام می‌شود
- [x] خطای Parse به Empty Storage تبدیل نمی‌شود
- [x] Failure در مسیر Read باعث حذف یا overwrite داده‌ی اصلی نمی‌شود

## Result Stateهای خواندن

حالت‌های اصلی خواندن Storage به‌صورت مستقل آزمایش شدند:

- [x] `ok`
- [x] `empty`
- [x] `invalid_json`
- [x] `invalid_version`
- [x] `future_version`
- [x] `migration_failed`
- [x] `invalid_structure`

- [x] Missing Version به‌عنوان Storage معتبر یا Empty پذیرفته نمی‌شود
- [x] Future Version بدون Downgrade یا Rewrite متوقف می‌شود
- [x] Invalid JSON بدون overwrite داده‌ی خام متوقف می‌شود
- [x] Invalid Structure از Empty Storage متمایز باقی می‌ماند

## جلوگیری از Write بعد از Read Failure

- [x] `addCard()` بعد از Read Failure متوقف می‌شود
- [x] هنگام Read Failure هیچ Writeای انجام نمی‌شود
- [x] Write Attempt با Mock بررسی شد و مقدار `false` باقی ماند
- [x] Storage خراب به‌عنوان آرایه‌ی خالی قابل‌نوشتن استفاده نمی‌شود

## Migration Pipeline

- [x] Registry برای Migrationهای ترتیبی ساخته شد
- [x] Migration آزمایشی `1 → 2 → 3` با موفقیت اجرا شد
- [x] Migrationها دقیقاً به ترتیب Version اجرا شدند
- [x] داده‌ی ورودی اصلی هنگام Migration mutate نشد
- [x] Migration با Version مبدأ و مقصد یکسان به‌صورت No-op موفق عمل کرد
- [x] Missing Migration Step باعث Failure شد
- [x] Missing Migration Step باعث Write نشد
- [x] Migration به مسیر واقعی Read متصل شد
- [x] Validation روی خروجی Migration انجام شد
- [x] Migration Failure با Result State مستقل گزارش شد

## Migration Idempotency

- [x] Migration روی Schema قدیمی فقط یک بار اجرا شد
- [x] داده‌ای که به Version هدف رسیده بود دوباره Migration نشد
- [x] عبور دوباره‌ی داده‌ی Migration‌شده از Read Pipeline تغییری در آن ایجاد نکرد
- [x] تعداد اجرای Migration در تست دو مرحله‌ای برابر یک باقی ماند
- [x] داده‌ی ورودی اصلی در No-op Migration بدون تغییر باقی ماند

## Backup پیش از Mutation

- [x] قبل از Write عادی، Raw Storage قبلی Backup می‌شود
- [x] Backup یک کپی دقیق از Raw Storage اصلی است
- [x] برابری Raw Storage و Backup به‌صورت مستقیم بررسی شد
- [x] نبود Storage قبلی به‌عنوان Failure در Backup در نظر گرفته نمی‌شود
- [x] Failure در ساخت Backup باعث توقف Write می‌شود
- [x] هنگام Backup Failure، Storage اصلی بدون تغییر باقی می‌ماند
- [x] Create، Edit و Delete بعد از اضافه‌شدن Backup همچنان درست کار کردند

## بررسی Backup پیش از Recovery

- [x] Backup سالم از همان Read Pipeline اصلی عبور می‌کند
- [x] Backup سالم با Status `ok` تشخیص داده شد
- [x] Backup خراب با Status `invalid_json` تشخیص داده شد
- [x] نبود Backup از Backup خراب متمایز است
- [x] نبود Backup با `available: false` گزارش می‌شود
- [x] Backup موجود ولی خراب با `available: true` و `canRestore: false` گزارش می‌شود

## Restore امن

- [x] Restore بدون تأیید صریح متوقف می‌شود
- [x] Restore بدون تأیید هیچ Writeای انجام نمی‌دهد
- [x] Backup سالم بعد از تأیید قابل Restore است
- [x] Backup خراب حتی با تأیید Restore نمی‌شود
- [x] Restore Backup خراب هیچ Writeای انجام نمی‌دهد
- [x] Recovery از مسیر Write عادی جدا باقی می‌ماند
- [x] Backup سالم هنگام Restore با Storage خراب جایگزین نمی‌شود

## Backup قدیمی و Migration پیش از Restore

- [x] Backup قدیمی پیش از Restore می‌تواند Migration شود
- [x] Backup Version 1 در تست به Version 2 Migration شد
- [x] نسخه‌ی Migration‌شده Restore شد
- [x] Raw Backup اصلی هنگام Migration/Restore بدون تغییر باقی ماند
- [x] اگر Migration موردنیاز موجود نباشد Restore متوقف می‌شود
- [x] Missing Migration هنگام Recovery هیچ Writeای انجام نمی‌دهد
- [x] Exception داخل Migration باعث توقف Recovery می‌شود

## Error State رابط Cards

- [x] Storage خراب دیگر به‌صورت «بدون کارت» نمایش داده نمی‌شود
- [x] Error State مستقل برای Storage ناخوانا نمایش داده می‌شود
- [x] پیام `Saved cards unavailable.` در Failure State نمایش داده شد
- [x] UI اعلام می‌کند داده‌ی ذخیره‌شده overwrite نشده است
- [x] Search هنگام Storage Error غیرفعال می‌شود
- [x] Sort هنگام Storage Error غیرفعال می‌شود
- [x] بعد از برگشت Storage سالم، Cards دوباره Render می‌شوند
- [x] Error State از Empty State متمایز باقی می‌ماند

## Recovery UI

- [x] Restore فقط وقتی Backup امن وجود دارد پیشنهاد می‌شود
- [x] دکمه‌ی `Restore last backup` در Error State نمایش داده شد
- [x] کلیک اول هیچ Restoreای اجرا نمی‌کند
- [x] کلیک اول دکمه را به `Confirm restore` تبدیل می‌کند
- [x] Warning پیش از Restore واقعی نمایش داده می‌شود
- [x] کلیک دوم Restore را با `confirmRestore: true` اجرا می‌کند
- [x] Restore واقعی فقط یک بار اجرا می‌شود
- [x] بعد از Restore موفق، UI از Error State خارج می‌شود
- [x] بعد از پایان تست و Cleanup، کارت‌های واقعی دوباره نمایش داده شدند

## Future Version

- [x] Storage با Schema آینده به `future_version` رسید
- [x] Future Version باعث اجرای `addCard()` نشد
- [x] Future Version باعث Write نشد
- [x] داده‌ی متعلق به Version ناشناخته Downgrade یا Rewrite نشد

## Duplicate Card IDs

- [x] دو Card با ID یکسان به‌عنوان `invalid_structure` تشخیص داده شدند
- [x] Duplicate ID باعث Read Failure شد
- [x] Duplicate ID باعث Write نشد
- [x] Storage دارای Duplicate ID به Empty Storage تبدیل نشد

## Broken Backup و Migration Failure

- [x] Exception داخل Migration به Failure تبدیل شد
- [x] Migration Failure هنگام Recovery باعث Write نشد
- [x] Backup دارای JSON خراب قابل Restore شناخته نشد
- [x] Backup خراب Status `invalid_json` دریافت کرد
- [x] Backup خراب `canRestore: false` دریافت کرد
- [x] Recovery از Backup خراب متوقف شد
- [x] Primary Storage در این Failure Stateها دست‌نخورده باقی ماند

## Fixtureهای دائمی

Fixtureهای Storage در مسیر زیر ایجاد شدند:

`tests/fixtures/card-storage-fixtures.json`

Fixtureهای زیر آزمایش شدند:

- [x] `schema_v1_baseline`
- [x] `invalid_json_raw`
- [x] `invalid_structure`
- [x] `future_version`

Result مورد انتظار Fixtureها:

- [x] Baseline → `ok`
- [x] Invalid JSON → `invalid_json`
- [x] Invalid Structure → `invalid_structure`
- [x] Future Version → `future_version`

- [x] Fixtureها بدون تغییر `localStorage` واقعی به Read Pipeline داده شدند
- [x] کارت‌های واقعی بعد از تست Fixtureها سالم باقی ماندند

## Regression داده‌ی واقعی

- [x] کارت‌های واقعی بعد از اضافه‌شدن Read Result Stateها باقی ماندند
- [x] کارت‌های واقعی بعد از اضافه‌شدن Migration Pipeline باقی ماندند
- [x] کارت‌های واقعی بعد از اضافه‌شدن Backup باقی ماندند
- [x] کارت‌های واقعی بعد از اضافه‌شدن Recovery باقی ماندند
- [x] Create بعد از تغییرات Storage همچنان کار می‌کند
- [x] Edit بعد از تغییرات Storage همچنان کار می‌کند
- [x] Delete بعد از تغییرات Storage همچنان کار می‌کند
- [x] Search و Sort بعد از تغییرات Storage همچنان کار می‌کنند
- [x] Refresh کارت‌های سالم را از بین نمی‌برد

## Final Regression

### Desktop / Classic

- [x] Cardهای واقعی در Classic Desktop بدون Error نمایش داده شدند
- [x] Create از UI واقعی انجام شد
- [x] Card جدید بعد از Refresh باقی ماند
- [x] Edit از UI واقعی انجام شد
- [x] `id` هنگام Edit حفظ شد
- [x] `created_at` هنگام Edit حفظ شد
- [x] `updated_at` هنگام Edit تغییر کرد
- [x] نسخه‌ی ویرایش‌شده بعد از Refresh باقی ماند
- [x] Search درست کار کرد
- [x] Newest، Oldest و Alphabetical درست کار کردند
- [x] Sort Preference بعد از Refresh حفظ شد
- [x] Delete Confirmation درست کار کرد
- [x] Card حذف‌شده بعد از Refresh برنگشت
- [x] Storage نهایی با Status `ok` خوانده شد
- [x] Cardهای واقعی دیگر حفظ شدند
- [x] Console Error حل‌نشده مشاهده نشد

### Snowy / Mobile

- [x] Cards در Snowy Desktop درست نمایش داده شدند
- [x] Search و Sort در Snowy Desktop درست کار کردند
- [x] Mobile layout در عرض حدود `390px` بررسی شد
- [x] Create روی Mobile درست کار کرد
- [x] Card بعد از Mobile Refresh باقی ماند
- [x] Edit روی Mobile درست کار کرد
- [x] Search روی Mobile درست کار کرد
- [x] Sort روی Mobile درست کار کرد
- [x] Delete Dialog روی Mobile قابل استفاده بود
- [x] Delete روی Mobile درست کار کرد
- [x] Card حذف‌شده بعد از Refresh برنگشت
- [x] Layout در عرض حدود `320px` بررسی شد
- [x] Horizontal overflow مشاهده نشد
- [x] Search، Sort و Bottom Navigation در عرض باریک سالم ماندند
- [x] Storage نهایی با Status `ok` خوانده شد
- [x] Cardهای واقعی حفظ شدند
- [x] Console Error حل‌نشده مشاهده نشد

## نتیجه‌ی v0.6.0

رفتار اصلی زیر با تست‌های دستی تأیید شد:

`read raw → parse → detect version → migrate when required → validate`

همچنین مسیر ایمنی زیر تأیید شد:

`read failure → no write → preserve raw data → inspect validated backup → explicit recovery`

Storage خراب، Version آینده، Migration Failure و Duplicate ID دیگر بی‌صدا به Empty Storage تبدیل نمی‌شوند.

Backup پیش از Mutation ایجاد می‌شود و Recovery فقط از Backup اعتبارسنجی‌شده و پس از تأیید صریح کاربر انجام می‌شود.

Fixtureهای دائمی برای Baseline، Invalid JSON، Invalid Structure و Future Version ایجاد و آزمایش شدند.

وضعیت:

**v0.6.0 implementation, migration/recovery testing, final regression, tag and GitHub release complete — released**
