# POOF Mini Practice — Development Roadmap

## Roadmap `v0.5.0` → `v0.30.0`

این سند مرجع اجرایی توسعه‌ی POOF Mini Practice است. README فقط نمای کوتاه مسیر را نشان می‌دهد؛ جزئیات ترتیب وابستگی‌ها، قراردادهای داده، هدف آموزشی و معیار پایان هر نسخه در این فایل نگهداری می‌شود.

آخرین وضعیت مبنا هنگام تدوین این نسخه از Roadmap:
آخرین وضعیت فعلی پروژه:

- آخرین Release رسمی: `v0.6.0`
- وضعیت شاخه‌ی `main`: نسخه‌ی `v0.6.0` کامل، آزمایش و منتشر شده است.
- Milestone فعال: `v0.7.0 — Deck Foundation`
- مقصد این Roadmap: `v0.30.0 — POOF Mini Core Alpha`
---

## 1. این Repository قرار است چه شود؟

POOF Mini Practice یک Demo یک‌بارمصرف نیست. این Repository آزمایشگاه معماری POOF است و باید مرحله‌به‌مرحله به یک Web Core Alpha واقعی تبدیل شود.

چیزهایی که باید مستقیماً قابل استفاده یا انتقال به POOF اصلی باشند:

- مدل‌های دامنه و قراردادهای داده
- مرز Shared Data و Personal Data
- قوانین Card، Deck، Context، Progress و Review
- Repository Interfaceها و Action Contractها
- Validation، Migration و Test Caseها
- جریان‌های End-to-End و تصمیم‌های معماری
- منطق مستقل از رابط کاربری

بخشی از HTML، CSS و DOM Code ممکن است هنگام مهاجرت آینده به Flutter بازنویسی شود. بنابراین هدف، حفظ تک‌تک خطوط Vanilla JavaScript نیست؛ هدف این است که منطق، قراردادها، مرزها و تجربه‌ی به‌دست‌آمده قابل انتقال باشند.

---

## 2. سیاست نسخه‌بندی

این Roadmap از Semantic Versioning استفاده می‌کند:

```text
MAJOR.MINOR.PATCH
```

بنابراین:

```text
v0.30.0
```

یعنی سی‌امین Milestone در دوره‌ی پیش از `1.0`؛ نه نسخه‌ی Major سی‌ام.

```text
v30.0.0
```

یک Major Version کاملاً متفاوت و بسیار دور است و در این سند برنامه‌ریزی نمی‌شود.

قواعد فعلی:

- `v0.x.0`: یک Milestone جدید با مفهوم اصلی مشخص
- `v0.x.y`: اصلاح Bug، مستندات یا Patch همان Milestone
- `v1.0.0`: فقط پس از عبور از Alpha/Beta و تعریف معیار Public Release
- رسیدن به `v0.30.0` الزاماً به معنی انتشار فوری `v1.0.0` نیست.

---

## 3. North Star

تا پایان `v0.30.0` این جریان باید واقعاً و بدون Copy/Paste دستی کار کند:

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
Review Session
      ↓
Personal Progress
      ↓
Authenticated Remote Persistence
```

این Vertical Slice مهم‌تر از تعداد صفحه‌ها و Featureهاست.

رابطه‌ی آن با مسیر کامل POOF:

```text
LESSON → MEDIA → DICTIONARY → CARD → AI → REVIEW → CONVERSATION → REAL LIFE
```

Mini Core Alpha تا `v0.30.0` بخش زیر را عمیق و واقعی می‌سازد:

```text
Lesson / Story → Text Interaction → Dictionary → Card → Deck → Review
```

AI، Media Player، Social و Flutter بعد از اثبات این هسته وارد Roadmap بعدی می‌شوند.

---

## 4. قوانین غیرقابل مذاکره‌ی معماری

### 4.1 Shared Knowledge با Personal State یکی نیست

Shared Data:

```text
dictionary entries and senses
lesson content
story content
library catalog
```

Personal Data:

```text
cards
card contexts
decks
lesson progress
review progress
review events
settings
```

ویرایش یا حذف یک Personal Card نباید Dictionary Entry عمومی را تغییر دهد.

### 4.2 UI مستقیماً Persistence را کنترل نمی‌کند

صفحه‌ها نباید مستقیماً به این جزئیات وابسته شوند:

```text
localStorage key
JSON serialization
Supabase table
SQL query
```

مسیر مطلوب:

```text
UI → Use Case / Public API → Repository → Persistence Provider
```

### 4.3 داده قبل از نمایش اعتبارسنجی می‌شود

```text
Data → Validation → Processing → Rendering → UI
```

داده‌های Lesson، Story، Library و Dictionary نباید به‌صورت تکراری داخل HTML نوشته شوند.

### 4.4 Context در طول مسیر از بین نمی‌رود

حداقل Context قابل حمل:

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

هر Module فقط اطلاعات موردنیاز خود را مصرف می‌کند؛ نباید بقیه‌ی Context را بی‌دلیل حذف کند.

### 4.5 تکرار واژه ممنوع نیست

یک واژه می‌تواند با معنی، مثال یا Contextهای متفاوت چند بار ذخیره شود.

```text
Bank → بانک
Bank → نیمکت

gehen → مثال از درس
gehen → مثال از داستان
```

قواعد هویت:

- هویت Personal Card با `card.id` تعیین می‌شود.
- `dictionary_entry_id` یک Reference است، نه Unique Constraint.
- سیستم نباید Card تکراری را به‌طور اجباری مسدود یا ادغام کند.
- در آینده کاربر می‌تواند آگاهانه Context تازه‌ای به Card موجود اضافه کند یا Card جدا بسازد.

### 4.6 Schema بدون Migration تغییر نمی‌کند

هر Milestone که Stored Data را تغییر می‌دهد باید شامل این موارد باشد:

- Schema Version جدید
- Migration از نسخه‌ی قبلی
- Validation بعد از Migration
- Backup/Recovery Strategy
- Regression Test

### 4.7 فقط Success State طراحی نمی‌شود

هر Feature داده‌محور، متناسب با نیاز خود، این حالت‌ها را پوشش می‌دهد:

```text
Loading
Success
Empty
Error
```

پس از ورود Remote Data:

```text
Network interruption
Retry
No permission
Expired session
```

### 4.8 Theme و Language منطق محصول را عوض نمی‌کنند

- Classic و Snowy از همان Data Contract و Flow استفاده می‌کنند.
- تغییر Theme فقط Visual Layer را تغییر می‌دهد.
- UI Language با Language محتوای آموزشی یکی نیست.
- RTL/LTR باید در متن‌های ترکیبی فارسی و آلمانی درست کار کند.

---

## 5. ستون مرکزی: POOF Text Interaction Engine

### 5.1 نام‌ها

- نام معماری: **POOF Text Interaction Engine**
- قرارداد/کامپوننت عمومی متن: **`SelectablePoofText`**
- نام محصولی قابلیت: **POOF Select**

این قابلیت یک Popup تزئینی نیست؛ لایه‌ی اتصال متن‌های POOF به Dictionary، Cards، Translation، Audio و AI است.

### 5.2 قانون استفاده

بعد از تکمیل `v0.16.0`، هر سطحی که محتوای زبانی قابل یادگیری نشان می‌دهد باید از `SelectablePoofText` استفاده کند، مگر اینکه در مستندات همان Feature صریحاً غیرتعاملی اعلام شود.

نمونه‌ی سطوح آینده:

```text
Lesson text
Story / Book / Article
Dictionary example
Subtitle / Transcript
AI response
Post / Comment / Message
Exercise feedback
```

در نسخه‌ی Vanilla JavaScript، `SelectablePoofText` نام Public Contract است و می‌تواند با یک Renderer/Controller و `data-*` attribute پیاده‌سازی شود. این قرارداد نباید به React، Flutter یا Web Component خاصی قفل شود.

### 5.3 قرارداد Context

نسخه‌ی اولیه‌ی `TextSelectionContext`:

```json
{
  "selected_text": "Honig",
  "full_sentence": "Ich habe den Honig in meinen Tee getan.",
  "surrounding_text": "...",
  "language": "de",
  "source_type": "story",
  "source_id": "story_001",
  "position": {
    "block_id": "block_03",
    "sentence_id": "sentence_08",
    "start_offset": 14,
    "end_offset": 19,
    "media_time_ms": null
  },
  "captured_at": "2026-08-17T10:00:00.000Z",
  "user_id": null
}
```

قواعد:

- `selected_text` می‌تواند Word، Phrase یا Sentence باشد.
- `full_sentence` باید از ساختار محتوای منبع استخراج شود، نه با حدس شکننده‌ی UI.
- `surrounding_text` اختیاری و بزرگ‌تر از جمله‌ی اصلی است.
- `position` برای متن و رسانه قابل توسعه می‌ماند.
- `user_id` تا قبل از Authentication می‌تواند `null` باشد.
- `captured_at` زمان Capture است؛ با موقعیت منبع اشتباه نمی‌شود.

### 5.4 ساختار داخلی Engine

```text
POOF Text Interaction Engine
│
├── SelectablePoofText
├── Selection Controller
├── Context Extractor
├── Interaction Menu
├── Action Registry
├── Action Dispatcher
├── Dictionary Action
├── Quick Add Action
├── Card Builder Action
├── Copy Action
├── Audio Action Adapter
├── Translation Action Adapter
└── AI Action Adapter
```

Action Menu باید Capability-based باشد. Actionای که Provider واقعی ندارد نباید وانمود کند کار می‌کند.

در `v0.16.0`:

| Action | وضعیت مورد انتظار |
| --- | --- |
| Copy | واقعی و فعال |
| Dictionary | واقعی و فعال |
| Quick Add | واقعی و فعال |
| Open Card Builder | واقعی و فعال |
| Expand to sentence | واقعی و فعال |
| Listen | Adapter/Capability آماده؛ فقط با داده‌ی واقعی فعال |
| Sentence translation | Adapter/Capability آماده؛ فعلاً غیرفعال یا مخفی |
| Ask POOF | Adapter/Capability آماده؛ فعلاً غیرفعال یا مخفی |

### 5.5 آمادگی محتوا از قبل از ساخت Engine

برای اینکه `Context Extractor` مجبور به حدس جمله نشود، Story و Lesson Content باید Stable Identity داشته باشند:

```text
content_id
block_id
sentence_id
language
text
```

هر نسخه‌ای که متن آموزشی جدید اضافه می‌کند باید از ابتدا `language`، `source_type` و `source_id` را در Contract خود داشته باشد.

### 5.6 مرز Actionها

`SelectablePoofText` نباید خودش Dictionary را جست‌وجو، Card را ذخیره یا AI را فراخوانی کند.

```text
Selection
→ TextSelectionContext
→ Action Dispatcher
→ Module Action / Use Case
```

این مرز باعث می‌شود همان Engine بعدها در Story، Lesson، Subtitle و AI Message بدون کپی‌کردن Business Logic استفاده شود.

---

## 6. وضعیت نسخه‌ها و فازها

| Phase | Versions | نتیجه |
| --- | --- | --- |
| Foundation completed | `v0.1–v0.4` | Shell، Theme، Learn Data و Storage API |
| A — Personal Learning Data | `v0.5–v0.8` | Card، Migration، Deck و Localization |
| B — Dictionary & Context | `v0.9–v0.13` | Dictionary، Card Draft، Context Contract و Tests |
| C — Library & POOF Select | `v0.14–v0.17` | Story، `SelectablePoofText` و اولین Vertical Slice |
| D — Learn | `v0.18–v0.22` | Lesson Detail، Progress، Path و Exercises |
| E — Review | `v0.23–v0.24` | Review Model و SRS v1 |
| F — Repository Boundary | `v0.25` | Async Data Contract |
| G — Real User Data | `v0.26–v0.30` | Supabase، Auth، Remote Sync و Core Alpha |

### خلاصه‌ی Milestoneها

| Version | Milestone | خروجی اصلی |
| --- | --- | --- |
| `v0.1.0` | Skeleton ✅ | صفحات، Navigation و GitHub Pages |
| `v0.2.0` | Interface Foundation ✅ | Theme System و Mobile Navigation |
| `v0.3.0` | Data-driven Learn ✅ | JSON، Validation و DOM Rendering |
| `v0.4.0` | Storage Layer ✅ | Card Storage API و Schema v1 |
| `v0.5.0` | Card Builder & Management ✅ | CRUD، Search و Sort کارت‌ها |
| `v0.6.0` | Storage Migration & Recovery ✅ | تغییر امن Schema و Recovery |
| `v0.7.0` | Deck Foundation 🚧 | Deck Entity و ارتباط Card–Deck |
| `v0.8.0` | Localization & Bidirectional UI | `fa/de/en` و RTL/LTR |
| `v0.9.0` | Dictionary Data Model | Entry/Sense استاندارد |
| `v0.10.0` | Dictionary Search & Entry View | جست‌وجو و نمایش واژه |
| `v0.11.0` | Dictionary → Card Draft | Prefill بدون اتصال نادرست Shared/Personal |
| `v0.12.0` | Context & Capture Foundation | `TextSelectionContext` و `CardContext` |
| `v0.13.0` | Automated Testing Foundation | Test Suite تکرارپذیر |
| `v0.14.0` | Data-driven Library | Catalog محتوایی کوچک |
| `v0.15.0` | Structured Story Reader | متن دارای Block/Sentence Identity |
| `v0.16.0` | POOF Text Interaction Engine v1 | `SelectablePoofText` و Action Dispatcher |
| `v0.17.0` | Story Vertical Slice | Story → Select → Dictionary → Card |
| `v0.18.0` | Lesson Detail | Lesson واقعی قابل بازشدن |
| `v0.19.0` | Lesson POOF Select | استفاده‌ی مجدد از Engine در Learn |
| `v0.20.0` | Personal Lesson Progress | Resume و Completion شخصی |
| `v0.21.0` | Learn Path States | Locked/Available/In Progress/Completed |
| `v0.22.0` | Exercise Engine v1 | Multiple Choice و Typed Answer |
| `v0.23.0` | Review Data Model | جداسازی Card، Progress و Event |
| `v0.24.0` | Review Session & SRS v1 | Active Recall و Scheduling ساده |
| `v0.25.0` | Async Repository Boundary | UI آماده‌ی Network |
| `v0.26.0` | Supabase Foundation | PostgreSQL، Migration و RLS |
| `v0.27.0` | Authentication & Profile | User Ownership واقعی |
| `v0.28.0` | Remote Cards, Decks & Contexts | Cross-device Personal Vocabulary |
| `v0.29.0` | Remote Progress & Review | Sync وضعیت یادگیری |
| `v0.30.0` | POOF Mini Core Alpha | Vertical Slice کامل و Hardening |

---

## PHASE A — Personal Learning Data

### `v0.5.0` — Card Builder & Card Management

#### هدف

اثبات اولین جریان CRUD کامل روی Storage API ساخته‌شده در `v0.4.0`.

#### وضعیت فعلی

پیاده‌سازی و Regression کامل Card Builder و Card Management انجام شده و نسخه‌ی `v0.5.0` به‌صورت رسمی منتشر شده است.

#### کارها

- [x] ساخت فرم Word، Meaning، Example و Deck
- [x] اتصال Create به `poofStorage.addCard()`
- [x] Render کارت‌های ذخیره‌شده
- [x] اتصال Update به `poofStorage.updateCard()`
- [x] Cancel Edit
- [x] Delete Confirmation اختصاصی
- [x] اتصال Delete به `poofStorage.deleteCard()`
- [x] Search در Word، Meaning و Example
- [x] Sort با Newest، Oldest و Alphabetical
- [x] استفاده از `getCardById()` در Edit و Delete
- [x] مرتب‌سازی Newest/Oldest براساس `created_at`، نه ترتیب اتفاقی Array
- [x] حفظ Sort Preference بعد از Refresh و جابه‌جایی بین صفحه‌ها
- [x] حفظ `id` و `created_at` و تغییر `updated_at` در تست نهایی
- [x] ثبت تمام تست‌ها در `docs/testing.md`
- [x] به‌روزرسانی README و بررسی Decision Log
- [x] Tag و Release `v0.5.0`

#### فایل‌های اصلی

```text
cards.html
js/card-builder.js
js/cards.js
js/storage.js
css/main.css
docs/testing.md
README.md
```

#### یادگیری اصلی

```text
HTML forms
CRUD
CustomEvent
UI modes
stable identity
storage boundary
search and sort
```

#### Definition of Done

```text
Create → Refresh → Edit → Refresh → Search → Sort → Delete → Refresh
```

بدون Console Error، از مسیر Public Storage API، در Classic/Snowy و Mobile/Desktop کار کند.

---
#### وضعیت فعلی

Implementation، تست‌های Migration/Recovery و Final Regression کامل شده‌اند.

نسخه‌ی `v0.6.0` با Tag و GitHub Release رسمی منتشر شده و این Milestone بسته شده است.

#### هدف

تبدیل `schema_version` از یک عدد نمایشی به Migration Pipeline واقعی و جلوگیری از ظاهرشدن داده‌ی قدیمی به‌صورت Storage خالی.

#### نتیجه

Definition of Done با Migrationهای آزمایشی ترتیبی، Failure Stateها، Backup/Recovery، Fixtureها و Regression واقعی Classic/Snowy و Mobile/Desktop تأیید شده است.

Tag و GitHub Release رسمی `v0.6.0` تکمیل شده‌اند. این Milestone بسته است و توسعه از `v0.7.0 — Deck Foundation` ادامه پیدا می‌کند.

#### کارها
- [x] تفکیک مراحل `read raw → parse → detect version → migrate → validate`
- [x] تعریف `CURRENT_CARD_SCHEMA_VERSION`
- [x] ساخت Registry/Pipeline برای Migrationهای ترتیبی
- [x] تعریف رفتار Missing Version، Unsupported Future Version و Invalid JSON
- [x] نگهداری Backup بازیابی‌پذیر پیش از Mutation
- [x] جلوگیری از overwrite داده‌ی خام هنگام Failure
- [x] تعریف Error Result قابل نمایش برای UI
- [x] تعریف Recovery و ممنوعیت Reset/Overwrite خودکار بدون تصمیم آگاهانه‌ی کاربر
- [x] تضمین Idempotency Migration
- [x] ساخت Fixture برای Schema v1 Baseline، Storage خراب و Future Version
- [x] ثبت Architecture Decision
- [x] مستندسازی قانون «هر Schema Change همراه Migration»
- [x] Tag و GitHub Release رسمی `v0.6.0`

#### فایل‌های مورد انتظار

```text
js/storage.js
docs/card-storage-contract.md
docs/decisions.md
docs/testing.md
tests/fixtures/ (پس از ایجاد Test Foundation می‌تواند منتقل شود)
```

#### یادگیری اصلی

```text
schema versioning
backward compatibility
migration pipeline
data recovery
fail-safe behavior
```

#### Definition of Done

Storage قدیمی بدون ازدست‌رفتن Cardها قابل خواندن شود؛ Storage خراب یا Version آینده بی‌صدا به Empty Storage تبدیل و overwrite نشود.

---

### `v0.7.0` — Deck Foundation

#### وضعیت فعلی

Milestone فعال پروژه است.

Implementation هنوز شروع نشده است.



#### هدف

تبدیل `deck_id = "default"` از String صوری به Reference یک Entity واقعی.

#### مدل اولیه

```text
Deck
id
name
is_default
created_at
updated_at
```

#### کارها

- [ ] تعریف Deck Contract و Validation
- [ ] ایجاد Default Deck در Migration
- [ ] ساخت `getDecks()` و `getDeckById()`
- [ ] ساخت `addDeck()`، `updateDeck()` و `deleteDeck()`
- [ ] دریافت Deckهای واقعی در Card Builder
- [ ] جلوگیری از Reference به Deck ناموجود
- [ ] تعریف رفتار حذف Deck دارای Card
- [ ] غیرقابل‌حذف‌بودن Default Deck
- [ ] ساخت UI ساده‌ی مدیریت Deck
- [ ] نمایش/فیلتر Cards براساس Deck
- [ ] تست Referential Integrity و Migration

#### یادگیری اصلی

```text
entity
one-to-many relation
foreign-key concept
referential integrity
domain rules
```

#### Definition of Done

کاربر بتواند Deck بسازد، Card را در Deck ذخیره/جابجا کند و هیچ Cardای به Deck نامعتبر اشاره نکند.

---

### `v0.8.0` — Localization & Bidirectional UI Foundation

#### هدف

حذف Stringهای رابط از فایل‌های Feature و آماده‌کردن UI واحد برای فارسی، آلمانی و انگلیسی.

#### کارها

- [ ] تعریف Translation Key Contract
- [ ] ساخت فایل‌های `fa`، `de` و `en`
- [ ] ساخت Localization Service و `t(key)`
- [ ] انتخاب UI Language در Account
- [ ] ذخیره و اعتبارسنجی Preference
- [ ] تنظیم `html.lang` و جهت کلی صفحه
- [ ] جداسازی UI Language از Target Content Language
- [ ] استفاده از `lang` و `dir="auto"` برای متن‌های آموزشی
- [ ] ترجمه‌ی Navigation، Cards، Learn و Account
- [ ] تعریف Fallback برای Missing Key
- [ ] تست متن ترکیبی فارسی/آلمانی و RTL/LTR
- [ ] آماده‌کردن `language` به‌عنوان Metadata اجباری محتوای آینده

#### یادگیری اصلی

```text
i18n
translation keys
fallback
RTL/LTR
mixed-direction content
UI language vs content language
```

#### Definition of Done

هر سه UI Language بدون تغییر Business Logic کار کنند و واژه/جمله‌ی آلمانی در رابط فارسی جهت و خوانایی درست داشته باشد.

---

## PHASE B — Dictionary & Context

### `v0.9.0` — Dictionary Data Model

#### هدف

تعریف مدل کوچک اما استاندارد Shared Dictionary Knowledge.

#### Scope

Dataset محدود ۳۰ تا ۵۰ Entry آلمانی؛ نه Dictionary کامل و نه API خارجی.

#### قرارداد نمونه

```json
{
  "id": "de_bank",
  "language": "de",
  "lemma": "Bank",
  "part_of_speech": "noun",
  "article": "die",
  "senses": [
    {
      "id": "de_bank_finance",
      "glosses": [{ "language": "fa", "text": "بانک" }],
      "examples": [
        {
          "id": "ex_bank_01",
          "text": "Ich gehe zur Bank.",
          "translation": "من به بانک می‌روم."
        }
      ]
    }
  ],
  "level": "A1"
}
```

#### کارها

- [ ] تعریف Entry، Sense، Gloss و Example Contract
- [ ] تعریف Stable ID برای Entry، Sense و Example
- [ ] Validation داده‌های تو‌در‌تو
- [ ] بررسی Unique IDها
- [ ] پشتیبانی از چند معنی برای یک Lemma
- [ ] تعریف فیلدهای اختیاری Article، Forms و CEFR
- [ ] ساخت Dataset آزمایشی
- [ ] ثبت Provenance ساده برای داده‌ی دستی
- [ ] حفظ جدایی Dictionary و Personal Cards

#### یادگیری اصلی

```text
normalization
shared knowledge
nested contracts
entry vs sense
stable identity
```

#### Definition of Done

Dataset معتبر و قابل جست‌وجو باشد و تفاوت دو Sense مانند `Bank` به‌صورت ساختاری، نه فقط متن آزاد، نمایش داده شود.

---

### `v0.10.0` — Dictionary Search & Entry View

#### هدف

مصرف واقعی Dictionary Contract در یک UI داده‌محور.

#### کارها

- [ ] ساخت `dictionary.html`
- [ ] ساخت Dictionary Loader/Validator
- [ ] Search با Exact و Prefix Match
- [ ] Normalization حروف و Whitespace
- [ ] نمایش Result List
- [ ] نمایش Entry Detail و انتخاب Sense
- [ ] نمایش Lemma، Article، POS، Gloss و Example
- [ ] پشتیبانی از Loading/Empty/No Result/Error
- [ ] مدیریت Invalid Entry ID
- [ ] مسیر ورود با Query Parameter یا State Contract
- [ ] عدم افزودن بی‌دلیل گزینه‌ی ششم به Bottom Navigation

#### یادگیری اصلی

```text
search pipeline
query normalization
master/detail
shared data rendering
```

#### Definition of Done

کاربر بتواند واژه را جست‌وجو، Entry را باز و Sense درست را انتخاب کند؛ بدون اینکه Personal Data ساخته شود.

---

### `v0.11.0` — Dictionary → Card Draft

#### هدف

اتصال اولین دو Module با یک Draft Contract، بدون اینکه Dictionary مستقیماً Card را ذخیره کند.

#### جریان

```text
Dictionary Entry/Sense
→ CardDraft
→ Card Builder
→ User edits
→ Card Repository
```

#### کارها

- [ ] تعریف `CardDraft` Contract
- [ ] انتقال `dictionary_entry_id` و `dictionary_sense_id`
- [ ] Prefill واژه، معنی و Example منتخب
- [ ] تنظیم `source_type = dictionary`
- [ ] امکان ویرایش قبل از Save
- [ ] ذخیره فقط از Card Builder/Public API
- [ ] Migration برای فیلد جدید Sense Reference
- [ ] اثبات اینکه Edit/Delete Card روی Dictionary اثر ندارد
- [ ] مدیریت Entry/Sense ناموجود

#### یادگیری اصلی

```text
module integration
draft object
reference identity
shared vs personal data
```

#### Definition of Done

یک Sense عمومی Card شخصی قابل ویرایش بسازد، بدون Duplicate کردن یا Mutation داده‌ی Dictionary.

---

### `v0.12.0` — Context & Capture Foundation

#### هدف

ساخت قراردادهایی که پیش از UI نهایی POOF Select، Context را از هر منبع به Dictionary و Card منتقل کنند.

#### مدل‌ها

```text
TextSelectionContext
CardDraft
CardContext
```

`CardContext` حداقل شامل:

```text
id
card_id
selected_text
full_sentence
surrounding_text
language
source_type
source_id
position
captured_at
```

#### کارها

- [ ] ثبت قرارداد کامل `TextSelectionContext`
- [ ] تعریف `CardContext` به‌عنوان Personal Entity جدا
- [ ] تعریف رابطه‌ی Card یک‌به‌چند Context
- [ ] Migration Storage برای Contextها
- [ ] تبدیل Dictionary/Manual Input به `CardDraft`
- [ ] تبدیل Selection Context به Card Context
- [ ] پشتیبانی از Manual Card بدون Context
- [ ] اجازه‌ی چند Card با یک `dictionary_entry_id`
- [ ] اجازه‌ی چند Context برای یک Card
- [ ] تعیین رفتار حذف Card و Contextهای آن
- [ ] نمایش Source Summary ساده روی Card
- [ ] Validation برای Source Type، Position و Date
- [ ] ثبت Text Interaction Architecture در Decision Log

#### تصمیم صریح درباره‌ی تکرار

این نسخه Duplicate Prevention نمی‌سازد. سیستم باید انتخاب کاربر را حفظ کند:

```text
Create another card
یا در آینده
Attach context to an existing card
```

#### یادگیری اصلی

```text
context propagation
one-to-many relation
capture model
domain boundary
future-proof contracts
```

#### Definition of Done

یک Card بتواند Source و Sentence خود را به‌صورت ساختاری حفظ کند و ذخیره‌ی چند نمونه از یک واژه مجاز باقی بماند.

---

### `v0.13.0` — Automated Testing Foundation

#### هدف

تبدیل منطق‌های حساس و تکراری به Test Suite قابل اجرا و جلوگیری از Regression قبل از رشد Moduleها.

#### اولویت تست

```text
lesson validation
card/deck/context validation
schema migration and recovery
dictionary entry/sense validation
search normalization
sorting by timestamps
context conversion
```

#### کارها

- [ ] انتخاب Test Runner کم‌پیچیدگی و مستندسازی دلیل آن
- [ ] ساخت پوشه‌ی `tests/`
- [ ] جداکردن Pure Logic از DOM در صورت نیاز
- [ ] ساخت Fixtureهای معتبر و نامعتبر
- [ ] تست Migrationهای Storage
- [ ] تست Validationهای Lesson/Dictionary/Card/Context
- [ ] تست Search/Sort/Normalization
- [ ] افزودن Command اجرای تست
- [ ] اجرای Test Suite در Definition of Done نسخه‌های بعد
- [ ] حفظ Manual UI Test برای رفتارهایی که Unit Test پوشش نمی‌دهد

#### یادگیری اصلی

```text
unit test
fixture
assertion
regression
pure functions
deterministic behavior
```

#### Definition of Done

یک Command مستند، تمام تست‌های Pure Logic را اجرا کند و Failure عمدی یک Contract واقعاً Test Suite را قرمز کند.

---

## PHASE C — Library & POOF Select

### `v0.14.0` — Data-driven Library

#### هدف

تبدیل Library Placeholder به Catalog کوچک با Content Identity قابل استفاده در Text Interaction.

#### Scope

```text
story
book (catalog only)
podcast (catalog only)
```

#### کارها

- [ ] تعریف Library Item Contract
- [ ] ساخت `data/library.json`
- [ ] فیلدهای `id/type/title/language/level/description/status`
- [ ] Validation و Unique ID
- [ ] Render Catalog و Filter براساس Type
- [ ] Loading/Empty/Error/Success
- [ ] Route به Detail براساس Stable ID
- [ ] مشخص‌کردن اینکه کدام Type در این نسخه Reader واقعی دارد

#### یادگیری اصلی

```text
catalog model
content identity
filtering
route-ready data
```

#### Definition of Done

Library از داده Render شود و هر Item دارای Type، Language و Stable Source ID قابل حمل به Engine آینده باشد.

---

### `v0.15.0` — Structured Story Reader

#### هدف

ساخت اولین Text Surface واقعی با Sentence Identity؛ بدون نوشتن Interaction Logic اختصاصی برای Story.

#### قرارداد محتوا

```text
Story
id
language
title
blocks[]
  block_id
  sentences[]
    sentence_id
    text
```

#### کارها

- [ ] ساخت حداقل دو Story آزمایشی
- [ ] Load براساس Story ID
- [ ] Render Blockها و Sentenceها
- [ ] قرار‌دادن Metadata لازم برای Context Extractor
- [ ] حفظ `source_type = story` و `source_id`
- [ ] مدیریت Invalid ID و Unavailable Story
- [ ] Reader Typography و Mixed Direction
- [ ] تست Navigation Auto-hide با متن واقعی
- [ ] عدم ساخت Popup یا Dictionary Logic مخصوص Story

#### یادگیری اصلی

```text
structured content
URL parameters
source identity
reader UI
sentence boundaries
```

#### Definition of Done

Story قابل خواندن باشد و هر Sentence هویت پایدار داشته باشد تا Engine بعدی Context را بدون حدس استخراج کند.

---

### `v0.16.0` — POOF Text Interaction Engine v1

#### هدف

ساخت سرویس مشترک `SelectablePoofText` برای Selection، Context Extraction، Menu و Dispatch Actionها.

#### اجزای مورد انتظار

```text
js/text-interaction/selectable-poof-text.js
js/text-interaction/selection-controller.js
js/text-interaction/context-extractor.js
js/text-interaction/interaction-menu.js
js/text-interaction/action-registry.js
js/text-interaction/action-dispatcher.js
js/text-interaction/actions/
```

نام فایل‌ها می‌تواند با ADR تغییر کند، اما مسئولیت‌ها نباید دوباره در یک فایل بزرگ ادغام شوند.

#### کارها

- [ ] تعریف Public API `SelectablePoofText`
- [ ] تشخیص Word/Phrase Selection
- [ ] Expand Selection to Sentence
- [ ] استخراج `TextSelectionContext`
- [ ] ساخت Interaction Menu مشترک
- [ ] ساخت Capability-based Action Registry
- [ ] ساخت Action Dispatcher مستقل از Story
- [ ] فعال‌کردن Copy Action
- [ ] فعال‌کردن Dictionary Action
- [ ] فعال‌کردن Quick Add و Open Card Builder
- [ ] آماده‌کردن Adapter Contract برای Audio/Translation/AI
- [ ] پنهان/غیرفعال‌کردن Action فاقد Provider واقعی
- [ ] مدیریت Close، Escape، Outside Click و Focus
- [ ] تست Keyboard، Mouse، Touch و Mobile Selection
- [ ] جلوگیری از ازبین‌رفتن Browser-native Selection بدون نیاز
- [ ] ثبت ADR برای Engine و Contractها

#### یادگیری اصلی

```text
Selection API
reusable component contract
event delegation
context extraction
registry/dispatcher pattern
accessibility
capability detection
```

#### Definition of Done

همان Engine روی حداقل دو Text Surface آزمایشی کار کند و Story هیچ Dictionary/Card Business Logic اختصاصی نداشته باشد.

---

### `v0.17.0` — Story → POOF Select → Dictionary → Card

#### هدف

ساخت اولین Vertical Slice که فلسفه‌ی متصل POOF را در کد اثبات می‌کند.

#### سناریو

```text
Open Story
→ select Honig
→ Interaction Menu
→ open Dictionary Sense
→ Quick Add or Card Builder
→ choose Deck
→ save Card + CardContext
→ open Cards
→ source sentence is still present
```

#### کارها

- [ ] اتصال Story Reader به `SelectablePoofText`
- [ ] Lookup Entry/Sense از Dictionary Action
- [ ] انتقال `TextSelectionContext` به `CardDraft`
- [ ] تبدیل Context به `CardContext`
- [ ] Prefill Example از Full Sentence
- [ ] حفظ Story ID و Position
- [ ] نمایش Source Summary در Card
- [ ] پشتیبانی از Quick Add و Card Builder بدون دو منطق ذخیره‌سازی
- [ ] تست Word، Phrase و Sentence Selection
- [ ] تست چند Card از یک واژه با Contextهای متفاوت
- [ ] تست Refresh و Context Loss

#### یادگیری اصلی

```text
vertical slice
cross-module flow
context preservation
action dispatch
end-to-end testing
```

#### Definition of Done

تمام جریان بدون Copy/Paste دستی کامل شود و Card نهایی بتواند Story، Sentence و Position اصلی را نشان دهد.

---

## PHASE D — Learn

### `v0.18.0` — Lesson Detail

#### هدف

تبدیل Lesson Card از Preview به محتوای واقعی و ساخت Content Contract سازگار با POOF Select.

#### کارها

- [ ] تعریف Lesson Detail Contract
- [ ] Load Lesson براساس URL ID
- [ ] Metadata، Section، Block و Sentence ID
- [ ] Vocabulary Referenceهای اختیاری
- [ ] نمایش Content داده‌محور
- [ ] مدیریت Invalid ID
- [ ] جلوگیری از ورود به Coming Soon
- [ ] Back/Return Navigation
- [ ] استفاده از همان Structured Text Contract Story تا حد ممکن

#### یادگیری اصلی

```text
master/detail
nested lesson content
route state
contract reuse
```

#### Definition of Done

یک Lesson واقعی باز شود، Structure و Stable Sentence Identity داشته باشد و برای Engine آماده باشد.

---

### `v0.19.0` — Lesson POOF Select

#### هدف

استفاده‌ی مجدد از Engine در Lesson بدون ساخت سیستم دوم.

#### کارها

- [ ] Render متن Lesson با `SelectablePoofText`
- [ ] `source_type = lesson`
- [ ] `source_id = lesson_id`
- [ ] حفظ Block/Sentence/Offset
- [ ] استفاده از همان Interaction Menu و Action Registry
- [ ] Dictionary Lookup و CardDraft مشترک
- [ ] نمایش Source Lesson روی Card
- [ ] تست Story و Lesson پس از هر تغییر Engine

#### معیار معماری

اگر Lesson برای Dictionary، Card یا Context منطق موازی بسازد، Milestone کامل نیست.

#### Definition of Done

همان Actionها و همان Context Contract در Story و Lesson کار کنند؛ تنها Source Metadata متفاوت باشد.

---

### `v0.20.0` — Personal Lesson Progress

#### هدف

جداکردن Shared Lesson Content از وضعیت شخصی کاربر.

#### مدل اولیه

```text
LessonProgress
lesson_id
status
current_step
started_at
completed_at
updated_at
```

#### کارها

- [ ] تعریف Progress Contract و Validation
- [ ] Storage/Repository جدا از Lesson Catalog
- [ ] ثبت Start و Current Step
- [ ] Resume بعد از Refresh
- [ ] ثبت Completion
- [ ] Migration Personal Storage
- [ ] جلوگیری از ورود Personal Field به `lessons.json`
- [ ] تست چند Lesson مستقل

#### یادگیری اصلی

```text
content vs state
personal progress
resume state
separate persistence
```

#### Definition of Done

کاربر Lesson را نیمه‌کاره ببندد و بعد از Refresh از همان Step ادامه دهد؛ بدون تغییر Shared Lesson Data.

---

### `v0.21.0` — Learn Path States

#### هدف

محاسبه‌ی وضعیت مسیر Learn از Content و Personal Progress.

#### Stateها

```text
locked
available
in_progress
completed
coming_soon
```

#### کارها

- [ ] تعریف Prerequisite و Unlock Rule ساده
- [ ] Derived State به‌جای Hard-code Personal State در JSON
- [ ] نمایش Available/In Progress/Completed/Locked
- [ ] Progress Percentage
- [ ] Continue Learning
- [ ] حفظ Coming Soon به‌عنوان Content State
- [ ] تست State Transitionها

#### یادگیری اصلی

```text
derived state
prerequisites
state machine basics
progress-driven UI
```

#### Definition of Done

تکمیل Lesson 1، Lesson 2 را مطابق Rule باز کند و Refresh نتیجه را حفظ کند.

---

### `v0.22.0` — Exercise Engine v1

#### هدف

ساخت اولین Interaction آموزشی داده‌محور داخل Lesson.

#### Scope

```text
multiple_choice
typed_answer
```

#### کارها

- [ ] تعریف Exercise Contract
- [ ] Renderer براساس `type`
- [ ] Multiple Choice و Typed Answer
- [ ] Normalized Answer Validation
- [ ] Correct/Incorrect/Retry State
- [ ] Feedback روشن و بدون شرم‌دادن
- [ ] ثبت Exercise Completion در Lesson Progress
- [ ] اتصال Lesson Completion به Exercise Rule
- [ ] Test برای Evaluation Pure Logic
- [ ] عدم اتصال Exercise Feedback به Engine مگر متن واقعاً تعاملی باشد

#### یادگیری اصلی

```text
polymorphic data
evaluation
feedback state
state transition
```

#### Definition of Done

هر دو Exercise Type از Data ساخته شوند و نتیجه‌ی آن‌ها Progress را قابل پیش‌بینی به‌روزرسانی کند.

---

## PHASE E — Review

### `v0.23.0` — Review Data Model

#### هدف

جداکردن Card Content از وضعیت یادگیری و تاریخچه‌ی Review.

#### مدل‌ها

```text
Card
word / meaning / example / references

CardProgress
card_id / state / due_at / interval / repetitions / last_reviewed_at

ReviewEvent
id / card_id / rating / reviewed_at / previous_due_at / next_due_at
```

#### کارها

- [ ] تعریف Contract هر سه Entity
- [ ] New/Due State
- [ ] رابطه‌ی یک‌به‌یک Card–Progress
- [ ] رابطه‌ی یک‌به‌چند Card–ReviewEvent
- [ ] تعریف Cascade/Archive رفتار حذف Card
- [ ] Migration Storage
- [ ] ساخت Query/Selector کارت‌های Due
- [ ] Validation Date و Reference
- [ ] Test مدل‌ها و Relationها

#### یادگیری اصلی

```text
domain separation
current state vs event history
one-to-one / one-to-many
derived due state
```

#### Definition of Done

با نگاه به Data Model روشن باشد که تغییر برنامه‌ی مرور، محتوای Card یا Contextهای آن را تغییر نمی‌دهد.

---

### `v0.24.0` — Review Session & SRS v1

#### هدف

تبدیل Saved Cards به Active Recall با Scheduling ساده و قابل تست.

#### جریان

```text
Due Queue → Question → Reveal → Rating → Schedule → Next Card
```

#### Rating

```text
Again
Hard
Good
Easy
```

#### کارها

- [ ] ساخت Due Queue
- [ ] نمایش Front و مخفی‌بودن Answer
- [ ] Reveal Action
- [ ] چهار Rating
- [ ] Scheduling Rule ساده و مستند
- [ ] محاسبه‌ی `due_at` و `interval`
- [ ] Update CardProgress و Insert ReviewEvent
- [ ] Session Progress و Empty State
- [ ] Refresh بعد از Rating
- [ ] Deterministic Unit Test با Clock قابل کنترل
- [ ] نمایش Context/Example پس از Reveal

#### یادگیری اصلی

```text
active recall
scheduling
deterministic time logic
event persistence
session state
```

#### Definition of Done

یک Session چندکارتی کامل شود و Rating هر Card، Due Date و Event History قابل تست تولید کند.

---

## PHASE F — Repository Boundary

### `v0.25.0` — Async Repository Boundary

#### هدف

آماده‌کردن UI برای Data Provider شبکه‌ای که برخلاف `localStorage` هم‌زمان و فوری نیست.

#### تغییر اصلی

```text
poofStorage.getCards()
```

به یک Contract مستقل و Promise-based تبدیل می‌شود:

```text
await cardRepository.getCards()
```

#### کارها

- [ ] تعریف Repository Interface برای Card/Deck/Context
- [ ] ساخت `LocalCardRepository`
- [ ] Promise-based کردن Methodها
- [ ] Dependency Injection ساده برای Repository فعال
- [ ] جداکردن UI از `window.poofStorage`
- [ ] Loading/Error/Retry برای Read
- [ ] Pending/Disabled State برای Mutation
- [ ] Dictionary و Progress Repository Contractهای لازم
- [ ] Action Dispatcher وابسته به Use Case، نه Provider
- [ ] Regression Test کل Vertical Slice
- [ ] ثبت ADR

#### یادگیری اصلی

```text
repository pattern
async contract
dependency injection
network-ready UI
provider replacement
```

#### Definition of Done

Local Provider همچنان کل برنامه را اجرا کند، ولی هیچ Feature UI برای کارکردن به synchronous localStorage فرض مستقیم نداشته باشد.

---

## PHASE G — Real User Data

### `v0.26.0` — Supabase Foundation

#### هدف

ساخت Database، Migration و Security Foundation پیش از انتقال Featureها.

#### Personal Tableهای هدف

```text
profiles
decks
cards
card_contexts
lesson_progress
card_progress
review_events
```

Shared Dictionary/Lesson/Story در این Milestone می‌توانند همچنان JSON باقی بمانند.

#### کارها

- [ ] ساخت Supabase Project و Environmentهای لازم
- [ ] ایجاد پوشه‌ی Version-controlled برای SQL Migrations
- [ ] Naming Convention
- [ ] طراحی Tableها، Primary Key و Foreign Key
- [ ] Indexهای Queryهای اصلی
- [ ] استاندارد `created_at/updated_at`
- [ ] فعال‌کردن RLS روی تمام Personal Tableها
- [ ] نوشتن Policyهای اولیه‌ی Ownership
- [ ] نگهداری Publishable Client Config بدون Secret
- [ ] ممنوعیت Service Role/Secret Key در Frontend و Repository
- [ ] مستندسازی Local ID Import Strategy
- [ ] ساخت Supabase Repository Skeleton بدون Cutover

#### یادگیری اصلی

```text
PostgreSQL
SQL migration
primary/foreign key
index
RLS
public client key vs secret
```

#### Definition of Done

Schema از Migration خالی قابل بازسازی باشد، RLS فعال باشد و هیچ Secretای در Git یا Frontend وجود نداشته باشد.

---

### `v0.27.0` — Authentication & Profile

#### هدف

دادن Owner واقعی به Personal Data.

#### کارها

- [ ] Sign Up، Sign In و Sign Out
- [ ] Session Restore بعد از Refresh
- [ ] Auth State در Account UI
- [ ] ساخت Profile برای User
- [ ] افزودن/تثبیت `user_id` در Personal Tableها
- [ ] تست RLS با دو User واقعی آزمایشی
- [ ] جلوگیری از Read/Write داده‌ی User دیگر
- [ ] Loading، Auth Error و Expired Session State
- [ ] تعریف رفتار Guest/Local Data پیش از Login
- [ ] مستندسازی Account Deletion/Export به‌عنوان نیاز آینده

#### یادگیری اصلی

```text
authentication
authorization
session
ownership
RLS policy
```

#### Definition of Done

User A و User B فقط Profile و Personal Rows خود را ببینند و Refresh نشست معتبر را حفظ کند.

---

### `v0.28.0` — Remote Cards, Decks & Contexts

#### هدف

انتقال اولین Vertical Slice شخصی از Local Repository به Supabase Repository.

#### کارها

- [ ] پیاده‌سازی `SupabaseCardRepository`
- [ ] CRUD Remote برای Card، Deck و CardContext
- [ ] حفظ `dictionary_entry_id/sense_id`
- [ ] حفظ تمام Source Context و Position
- [ ] اعمال Ownership در تمام Queryها و RLS
- [ ] تکمیل Loading/Error/Retry Stateها
- [ ] One-time Import داده‌ی Local
- [ ] جلوگیری از Import دوباره با Import Marker/Idempotency
- [ ] تعریف رفتار Failure وسط Import
- [ ] تست دو Browser/Device با یک Account
- [ ] حفظ Local Repository برای Test و Development

#### یادگیری اصلی

```text
remote CRUD
data import
idempotency
cross-device persistence
provider swap
```

#### Definition of Done

Card همراه Deck و Context روی Device A ساخته و پس از Login روی Device B با همان Source Sentence دیده شود.

---

### `v0.29.0` — Remote Lesson Progress & Review

#### هدف

انتقال Learning State و Event History به Remote Repository.

#### کارها

- [ ] `SupabaseLessonProgressRepository`
- [ ] `SupabaseReviewRepository`
- [ ] Remote Query برای Due Cards
- [ ] Remote Insert برای ReviewEvent
- [ ] Resume Lesson روی Device دیگر
- [ ] Review روی Device A و مشاهده‌ی Due State روی Device B
- [ ] RLS Test برای Progress/Event
- [ ] Network Failure و Retry
- [ ] جلوگیری از Rating دوباره در Double Submit
- [ ] تعریف Conflict Policy ساده برای هم‌زمانی دو Device
- [ ] تست Timezone/UTC برای `due_at`

#### یادگیری اصلی

```text
remote state
event persistence
concurrency basics
network failure
UTC time
conflict policy
```

#### Definition of Done

Lesson Progress و Review Schedule میان دو Device یک User پایدار و متعلق به همان User باشند.

---

### `v0.30.0` — POOF Mini Core Alpha

#### هدف

هیچ Module بزرگ جدیدی ساخته نمی‌شود. این Milestone اتصال، Hardening و اثبات معماری کل Vertical Slice است.

#### سناریوی پذیرش نهایی

```text
Sign Up / Sign In
→ open Lesson or Story
→ select a word or phrase with SelectablePoofText
→ inspect Dictionary Entry/Sense
→ Quick Add or open Card Builder
→ choose Deck
→ save Card and original Context
→ review Card
→ save Review Progress/Event
→ close browser
→ open another device
→ sign in
→ continue with the same Card, Context and Progress
```

#### Hardening Checklist

- [ ] End-to-End Scenario کامل
- [ ] Story و Lesson هر دو از همان Engine
- [ ] Word/Phrase/Sentence Selection
- [ ] چند Card یا Context برای یک واژه بدون Block اجباری
- [ ] Entry/Sense Reference سالم
- [ ] Deck Referential Integrity
- [ ] Card Context و Source Position سالم
- [ ] Review Scheduling و Event History سالم
- [ ] Cross-device Persistence
- [ ] Classic و Snowy
- [ ] `fa/de/en`
- [ ] RTL/LTR و Mixed Direction
- [ ] Mobile/Desktop
- [ ] Keyboard/Touch Accessibility
- [ ] Loading/Empty/Error/Retry/Auth States
- [ ] Invalid URL/Data/Storage Cases
- [ ] RLS با دو User
- [ ] Automated Test Suite سبز
- [ ] بدون Console Error حل‌نشده
- [ ] README/ROADMAP/Testing/Decisions به‌روز
- [ ] Architecture Diagram نهایی
- [ ] Security/Secret Audit
- [ ] Tag و Release Notes `v0.30.0`

#### Definition of Success

در پایان باید بتوان با کد پروژه به این پرسش‌ها پاسخ داد:

| Domain | پرسش |
| --- | --- |
| UI | داده چگونه به Interface State و Component تبدیل می‌شود؟ |
| Text Interaction | Selection چگونه به Context و Action تبدیل می‌شود؟ |
| Dictionary | چرا Entry/Sense با Personal Card متفاوت است؟ |
| Context | چگونه Sentence، Source و Position در مسیر حفظ می‌شوند؟ |
| Storage | چرا UI به localStorage/Supabase مستقیم وابسته نیست؟ |
| Migration | تغییر Schema چگونه بدون نابودی داده انجام می‌شود؟ |
| Learn | چرا Lesson Content با User Progress جداست؟ |
| Review | چرا Card، CardProgress و ReviewEvent سه مفهوم جدا هستند؟ |
| Database | Foreign Key و Index کجا و چرا استفاده شده‌اند؟ |
| Auth | Authentication و Authorization چه تفاوتی دارند؟ |
| Security | RLS چگونه مالکیت داده را اعمال می‌کند؟ |
| Architecture | Local Repository چگونه با Remote Repository جایگزین شد؟ |

اگر این مفاهیم قابل توضیح، تست و دنبال‌کردن در کد باشند، Mini Core Alpha موفق است.

---

## 7. Definition of Done مشترک هر Milestone

یک نسخه فقط وقتی Complete است که:

- [ ] Scope نوشته‌شده‌ی همان نسخه کامل باشد.
- [ ] Feature اصلی در Flow واقعی کار کند، نه فقط در Console یا Proof UI.
- [ ] داده‌ی قبلی پس از Migration و Refresh باقی بماند.
- [ ] Classic و Snowy بررسی شوند.
- [ ] Mobile و Desktop بررسی شوند.
- [ ] RTL/LTR هرجا مرتبط است بررسی شود.
- [ ] Loading/Empty/Error Stateهای مرتبط وجود داشته باشند.
- [ ] Edge Caseهای اصلی ثبت و آزمایش شوند.
- [ ] Automated Tests مرتبط سبز باشند؛ اگر هنوز Test Foundation نرسیده، Manual Test ثبت شود.
- [ ] `docs/testing.md` به‌روزرسانی شود.
- [ ] Data Contractهای تغییرکرده به‌روزرسانی شوند.
- [ ] تصمیم معماری جدید در `docs/decisions.md` ثبت شود.
- [ ] README و این Roadmap Status درست نشان دهند.
- [ ] هیچ Console Error حل‌نشده وجود نداشته باشد.
- [ ] Commitهای قابل فهم، Tag و Release ثبت شوند.

---

## 8. Git Workflow

برای Mini Practice فعلاً یک Feature Branch برای هر Milestone کافی است:

```text
main
  ↓
feature/v0.x-feature-name
  ↓
implementation
  ↓
testing
  ↓
documentation
  ↓
merge to main
  ↓
tag
  ↓
release
```

نمونه:

```text
feature/v0.6-storage-migration
feature/v0.12-context-capture
feature/v0.16-text-interaction-engine
feature/v0.25-async-repositories
```

`main` باید همیشه نسخه‌ی سالم و قابل اجرا را نگه دارد.

---

## 9. خارج از Scope تا `v0.30.0`

موارد زیر حذف نشده‌اند؛ فقط تا اثبات Core Flow وارد Implementation نمی‌شوند:

- AI Tutor واقعی و OpenAI API
- Translation Provider واقعی
- Audio/TTS Pipeline کامل
- External Dictionary Aggregator
- Wiktionary/Tatoeba Integration
- Movie/Series Streaming
- Subtitle Extraction/Capture
- Speech-to-Text
- Social Feed، Friends، Messaging و League
- Billing/Premium
- تمام هشت Variant
- Flutter Client
- FastAPI Backend اختصاصی
- Production App Store Release
- SRS پیچیده و تطبیقی

Engine از نظر Contract برای Audio، Translation و AI آماده می‌شود، اما Action بدون Provider واقعی فعال نمی‌شود.

---

## 10. بعد از `v0.30.0`

Roadmap بعدی تنها پس از بازبینی Core Alpha نوشته می‌شود. Candidateهای `v0.31+`:

```text
AI Adapter and Ask POOF
Translation Adapter
Audio/Pronunciation
External Dictionary Providers
Media Transcript and Subtitle Capture
Advanced SRS
Additional POOF Variants
Social and Messaging
FastAPI Service Boundary
Flutter Prototype / Migration
Beta Hardening
```

`v1.0.0` زمانی تعریف می‌شود که Product Scope، Public Release Criteria، Security، Privacy، Accessibility، Deployment و Support Plan جداگانه تصویب شده باشند. از اکنون برای `v2.0.0` تا `v30.0.0` Feature تعیین نمی‌شود؛ Major Version باید نشان‌دهنده‌ی تغییر بزرگ و واقعی محصول باشد، نه شماره‌ی یک Milestone معمولی.

---

## 11. ترتیب بعدی از وضعیت امروز

```text

1. شروع v0.7 Deck Foundation
2. بررسی Card Storage Contract، js/storage.js و Card Builder
3. تعریف Deck Contract، Validation و قوانین Default Deck
4. طراحی Schema جدید و Migration واقعی از Schema v1
5. ساخت Deck CRUD و Referential Integrity میان Card و Deck
6. اتصال Deckهای واقعی به Card Builder و اجرای Regression Test

```

هیچ Feature از نسخه‌ی بعد پیش از بستن Definition of Done نسخه‌ی فعال وارد `main` نمی‌شود.

---

## اصل نهایی

POOF Mini Practice نباید مجموعه‌ای از صفحه‌های جدا باشد.

```text
Select → Understand → Explore → Save → Learn → Review
```

هدف این Repository تعداد Featureها نیست؛ هدف ساخت یک جریان متصل با داده‌ی قابل اعتماد، Context حفظ‌شده و مرزهای معماری قابل انتقال به POOF اصلی است.

**Build small. Understand deeply. Preserve context. Reuse the architecture.**
