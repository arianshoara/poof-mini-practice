# POOF Mini Practice

A small but evolving learning project for understanding and proving the core architecture of POOF.

یک پروژه‌ی تمرینی کوچک اما روبه‌رشد برای فهم و پیاده‌سازی معماری اصلی POOF.

---

## هدف پروژه

POOF Mini Practice نسخه‌ی Production اپ اصلی POOF نیست؛ اما یک Demo دورریختنی هم نیست.

این Repository آزمایشگاهی است که در آن مفاهیم اصلی POOF ابتدا در مقیاس کوچک با HTML، CSS و Vanilla JavaScript ساخته، آزمایش و مستند می‌شوند. هدف این است که قراردادهای داده، منطق دامنه، مرزهای معماری و تجربه‌ی فنی آن بعداً مستقیماً در POOF اصلی قابل استفاده یا انتقال باشند.

در این پروژه تمرین می‌شود:

- ساخت رابط چندصفحه‌ای و Data-driven
- HTML، CSS و Vanilla JavaScript
- Navigation و Theme System مشترک
- JSON، Validation و Data Contracts
- localStorage و Storage Abstraction
- Schema Versioning، Migration و Recovery
- Personal Cards و Decks
- Dictionary Entry و Sense
- Localization و RTL/LTR
- Context Preservation
- POOF Text Interaction Engine
- `SelectablePoofText`
- Lesson Progress و Exercises
- Review و Spaced Repetition پایه
- Automated Testing
- Repository Pattern و Async Data
- Supabase، PostgreSQL، Authentication و RLS
- Git، GitHub، Tag و Release Workflow

---

## North Star

POOF نباید مجموعه‌ای از Featureهای جدا باشد. مسیر اصلی Mini Practice تا `v0.30.0`:

```text
Lesson / Story
      ↓
SelectablePoofText
      ↓
POOF Text Interaction Engine
      ↓
Dictionary Entry / Sense
      ↓
Personal Card + Original Context
      ↓
Deck
      ↓
Review
      ↓
Personal Progress
      ↓
Remote Persistence
```

واژه هنگام حرکت در این مسیر باید جمله، زبان، منبع و موقعیت اصلی خود را حفظ کند.

مثال:

```text
selected_text: Schule
full_sentence: Heute gehe ich zur Schule.
language: de
source_type: story
source_id: story_001
dictionary_entry_id: de_schule
```

کارت نهایی نباید فقط `Schule → مدرسه` باشد؛ باید بتواند Context اصلی یادگیری را نیز نگه دارد.

---

## قابلیت مرکزی آینده: POOF Select

نام معماری:

**POOF Text Interaction Engine**

قرارداد/کامپوننت عمومی:

**`SelectablePoofText`**

نام محصولی:

**POOF Select**

هدف این است که متن‌های آموزشی POOF «متن مرده» نباشند. کاربر بتواند یک Word، Phrase یا Sentence را انتخاب کند و از یک Interaction Menu مشترک به Actionهای مناسب برسد:

```text
Copy
Expand to sentence
Dictionary
Quick Add
Open Card Builder
Listen
Sentence Translation
Ask POOF
```

Actionهای Audio، Translation و AI فقط زمانی فعال می‌شوند که Provider واقعی داشته باشند.

Engine باید یک‌بار ساخته شود و بعداً در این سطوح دوباره استفاده شود:

```text
Lesson
Story / Book / Article
Dictionary Example
Subtitle / Transcript
AI Response
Post / Comment / Message
Exercise Feedback
```

قرارداد کامل و ترتیب ساخت این Engine در [Development Roadmap](docs/ROADMAP.md#5-ستون-مرکزی-poof-text-interaction-engine) ثبت شده است.

---

## اصول معماری

### Shared Data و Personal Data جدا هستند

Shared Data:

```text
lessons
dictionary entries and senses
stories
library content
```

Personal Data:

```text
cards
card contexts
decks
lesson progress
review progress
settings
```

ویرایش یا حذف Card شخصی نباید Dictionary Entry عمومی را تغییر دهد.

### UI مستقیماً Storage یا Database را کنترل نمی‌کند

مسیر مطلوب:

```text
UI → Public API / Use Case → Repository → Persistence Provider
```

صفحه‌ها نباید به نام localStorage Key، Supabase Table یا SQL Query وابسته شوند.

### UI باید Data-driven باشد

```text
Data → Validation → Processing → Rendering → UI
```

Lesson، Story، Library و Dictionary Data نباید به شکل تکراری داخل HTML نوشته شوند.

### Context حفظ می‌شود

قرارداد هدف:

```text
selected_text
full_sentence
surrounding_text
language
source_type
source_id
position
captured_at
user_id
```

### یک واژه می‌تواند چند بار ذخیره شود

سیستم Duplicate Card را به‌صورت اجباری مسدود نمی‌کند. یک واژه ممکن است معنی‌ها، مثال‌ها یا Contextهای متفاوت داشته باشد.

هویت Card با `card.id` تعیین می‌شود؛ `dictionary_entry_id` فقط Reference است.

### Theme معماری را تغییر نمی‌دهد

Classic و Snowy از HTML، Data و Logic مشترک استفاده می‌کنند. Theme فقط Visual Layer را تغییر می‌دهد.

### فقط Success State طراحی نمی‌شود

Featureهای Data-driven متناسب با نیاز خود از حالت‌های زیر پشتیبانی می‌کنند:

```text
Loading
Success
Empty
Error
```

بعداً برای Remote Data، Network Interruption، Retry، No Permission و Expired Session نیز اضافه می‌شوند.

---

## فناوری‌های فعلی

```text
HTML
CSS
Vanilla JavaScript
JSON
localStorage
Git
GitHub
GitHub Pages
```

در مراحل فعلی از Framework Frontend، Backend، AI API یا Database Production استفاده نمی‌شود. آن‌ها فقط پس از آماده‌شدن Dependencyهای لازم وارد Roadmap می‌شوند.

---

## وضعیت توسعه

### `v0.1.0` — Skeleton ✅

- پنج صفحه‌ی اصلی
- Navigation مشترک
- صفحه‌ی فعال
- GitHub Pages

### `v0.2.0` — Interface Foundation ✅

- Themeهای Classic و Snowy
- CSS Variables
- Theme Preference در localStorage
- Mobile/Safe Area
- Auto-hide Navigation

### `v0.3.0` — Data-driven Learn ✅

- `data/lessons.json`
- Fetch و `async/await`
- Lesson Validation
- Loading/Empty/Error/Success
- DOM Rendering و Sorting

### `v0.4.0` — Storage Layer ✅

- `js/storage.js`
- Card Schema v1
- Validation و Stable ID
- `created_at` و `updated_at`
- Public Storage API
- Create/Read/Update/Delete Operations

Public API فعلی:

```text
getCards()
getCardsResult()
getCardById(cardId)
addCard(cardInput)
updateCard(cardId, changes)
deleteCard(cardId)
getCardStorageRecoveryStatus()
restoreCardStorageFromBackup(options)
```

### `v0.5.0` — Card Builder & Card Management ✅

پیاده‌سازی و Regression Test کامل شده است:

- Create Card
- Render Saved Cards
- Edit و Cancel Edit
- استفاده از `getCardById()` در Edit و Delete
- Delete با Dialog اختصاصی
- Live Search
- Newest و Oldest براساس `created_at`
- Alphabetical Sort
- حفظ انتخاب Sort بعد از Refresh و جابه‌جایی بین صفحه‌ها
- Validation و Feedback
- Persistence after Refresh
- حفظ `id` و `created_at` هنگام Edit
- تغییر `updated_at` هنگام Edit
- Regression کامل CRUD/Search/Sort
- آزمایش Classic و Snowy
- آزمایش Mobile و Desktop
- بررسی Console بدون Error مرتبط با پروژه

نسخه‌ی `v0.5.0` پس از تکمیل Implementation، Regression Test، مستندات، Tag و Release به‌صورت رسمی منتشر شده است.

### `v0.6.0` — Storage Migration & Recovery ✅

Implementation، Migration/Recovery testing و Final Regression کامل شده‌اند.

قابلیت‌های اصلی این نسخه:

- تفکیک `read raw → parse → detect version → migrate → validate`
- `CURRENT_CARD_SCHEMA_VERSION`
- Migration Registry و Pipeline ترتیبی
- Result Stateهای مستقل برای Storage
- تشخیص Invalid JSON، Invalid Version و Invalid Structure
- محافظت در برابر Future Schema Version
- جلوگیری از Write بعد از Read Failure
- Backup خام پیش از Mutation
- توقف Write هنگام Backup Failure
- Recovery فقط از Backup اعتبارسنجی‌شده
- Migration Backup قدیمی پیش از Restore
- Restore فقط پس از تأیید صریح کاربر
- Error State واقعی در Cards UI
- Recovery UI دو مرحله‌ای
- Migration Idempotency
- Fixtureهای دائمی Storage
- Regression کامل Classic/Snowy و Mobile/Desktop
  
نسخه‌ی `v0.6.0` پس از تکمیل Implementation، Migration/Recovery Testing، Final Regression، مستندات، Tag و GitHub Release به‌صورت رسمی منتشر شده است.

### `v0.7.0` — Deck Foundation 🚧

Milestone فعال پروژه.

Implementation هنوز شروع نشده است.

هدف این نسخه تبدیل `deck_id = "default"` از یک String صوری به Reference یک Deck Entity واقعی است.

تمرکز اصلی این Milestone:

- تعریف Deck Contract
- ساخت Deck Entity واقعی
- Default Deck معتبر
- Deck CRUD
- ارتباط واقعی Card و Deck
- Referential Integrity
- Migration واقعی Card Storage از Schema فعلی هنگام تغییر Data Contract
- اتصال Deckهای واقعی به Card Builder

---

## Roadmap تا `v0.30.0`

| Version | Milestone | نتیجه‌ی اصلی |
| --- | --- | --- |
| `v0.5` | Card Builder & Management | CRUD، Search و Sort کارت‌ها |
| `v0.6` | Storage Migration & Recovery | تغییر Schema بدون ناپدیدشدن داده |
| `v0.7` | Deck Foundation | Deck واقعی و ارتباط Card–Deck |
| `v0.8` | Localization & Bidirectional UI | `fa/de/en` و RTL/LTR |
| `v0.9` | Dictionary Data Model | Entry/Sense استاندارد |
| `v0.10` | Dictionary Search & Entry View | جست‌وجو و نمایش واژه |
| `v0.11` | Dictionary → Card Draft | Prefill بدون ترکیب Shared/Personal Data |
| `v0.12` | Context & Capture Foundation | `TextSelectionContext` و `CardContext` |
| `v0.13` | Automated Testing Foundation | Test Suite واقعی |
| `v0.14` | Data-driven Library | Catalog محتوایی کوچک |
| `v0.15` | Structured Story Reader | Block/Sentence Identity |
| `v0.16` | POOF Text Interaction Engine v1 | `SelectablePoofText` و Action Dispatcher |
| `v0.17` | Story Vertical Slice | Story → Select → Dictionary → Card |
| `v0.18` | Lesson Detail | Lesson واقعی و ساختاریافته |
| `v0.19` | Lesson POOF Select | استفاده‌ی مجدد از Engine در Learn |
| `v0.20` | Personal Lesson Progress | Resume و Completion |
| `v0.21` | Learn Path States | Locked/Available/In Progress/Completed |
| `v0.22` | Exercise Engine v1 | Multiple Choice و Typed Answer |
| `v0.23` | Review Data Model | Card، Progress و Event جدا |
| `v0.24` | Review Session & SRS v1 | Active Recall و Scheduling ساده |
| `v0.25` | Async Repository Boundary | UI آماده‌ی Network |
| `v0.26` | Supabase Foundation | PostgreSQL، Migration و RLS |
| `v0.27` | Authentication & Profile | User Ownership واقعی |
| `v0.28` | Remote Cards, Decks & Contexts | Cross-device Vocabulary |
| `v0.29` | Remote Progress & Review | Sync وضعیت یادگیری |
| `v0.30` | POOF Mini Core Alpha | Vertical Slice کامل و Hardening |

جزئیات هدف، Dependency، Data Contract، فایل‌ها، Checklist و Definition of Done هر نسخه در این سند قرار دارد:

**[docs/ROADMAP.md](docs/ROADMAP.md)**

---

## معیار موفقیت `v0.30.0`

```text
User signs in
↓
opens a Lesson or Story
↓
selects a word or phrase
↓
opens its Dictionary Entry/Sense
↓
creates a Personal Card
↓
keeps the original sentence, source and position
↓
chooses a Deck
↓
reviews the Card
↓
review progress is stored
↓
opens the project on another device
↓
signs in
↓
continues with the same Cards, Contexts and Progress
```

اگر این Flow کار کند، Repository به یک نسخه‌ی کوچک اما واقعی از معماری متصل POOF رسیده است.

---

## خارج از Scope تا `v0.30.0`

- AI Tutor واقعی و OpenAI API
- Translation Provider واقعی
- Audio/TTS کامل
- External Dictionary Aggregator
- Movie/Series Streaming
- Subtitle Extraction
- Speech-to-Text
- Social Feed، Friends، Messaging و League
- Billing/Premium
- تمام هشت Variant
- Flutter
- FastAPI Backend اختصاصی
- Production App Store Release
- SRS پیچیده

این موارد حذف نشده‌اند؛ فقط تا ثابت‌شدن Core Flow وارد Implementation نمی‌شوند.

---

## نسخه‌بندی

هدف این Roadmap رسیدن به:

```text
v0.30.0
```

است؛ نه `v30.0.0`.

`v0.30.0` یعنی Milestone سی‌ام در دوره‌ی پیش از نسخه‌ی عمومی `1.0`. معیار و زمان `v1.0.0` بعد از بازبینی Core Alpha و مراحل Alpha/Beta مشخص می‌شود.

---

## اسناد پروژه

- [Development Roadmap](docs/ROADMAP.md)
- [Architecture Decision Log](docs/decisions.md)
- [Manual Testing Checklist](docs/testing.md)
- [Card Storage Contract](docs/card-storage-contract.md)

قواعد نگهداری:

- تصمیم معماری جدید → `docs/decisions.md`
- تغییر Data Contract → سند Contract مربوط
- تست هر Release → `docs/testing.md`
- تغییر Scope یا ترتیب Milestone → `docs/ROADMAP.md`
- نمای کوتاه وضعیت → README

---

## Definition of Done هر نسخه

یک Milestone فقط وقتی تمام است که:

- Scope همان نسخه کامل باشد.
- Feature در Flow واقعی کار کند، نه فقط در Console یا Proof UI.
- Refresh و Migration داده را خراب نکنند.
- Classic و Snowy بررسی شوند.
- Mobile و Desktop بررسی شوند.
- Edge Caseها و Stateهای اصلی تست شوند.
- تست‌ها در `docs/testing.md` ثبت شوند.
- Data Contract و Decision Log در صورت نیاز به‌روز شوند.
- README و Roadmap وضعیت درست را نشان دهند.
- Console Error حل‌نشده وجود نداشته باشد.
- Tag و Release ثبت شوند.

---

## قانون اصلی تمرین

هیچ قابلیت یا فایلی فقط برای بزرگ‌تر، پیچیده‌تر یا زیباتر نشان‌دادن پروژه اضافه نمی‌شود.

برای هر Feature باید پاسخ روشن وجود داشته باشد:

1. چه مشکلی را حل می‌کند؟
2. چرا اکنون ساخته می‌شود؟
3. ورودی و خروجی آن چیست؟
4. کدام فایل یا Module مسئول آن است؟
5. چه چیزی نباید مسئول آن باشد؟
6. چگونه تست می‌شود؟
7. در POOF اصلی کجا دوباره استفاده خواهد شد؟

---

## فلسفه‌ی نهایی

POOF Mini Practice قرار نیست یک POOF کوچک و ناقص یا یک Demo کوتاه‌عمر باشد.

قرار است محیطی باشد که در آن معماری POOF را پیش از مقیاس Production بفهمم، پیاده‌سازی کنم، خراب کنم، اصلاح کنم و قابل انتقال نگه دارم.

```text
Select → Understand → Explore → Save → Learn → Review
```

**Build small. Understand deeply. Preserve context. Reuse the architecture.**
