# POOF — Public Product Roadmap

## نسخه‌های عمومی `v1.0.0` تا `v50.0.0`

این سند افق بلندمدت نسخه‌های عمومی POOF را تعریف می‌کند. جزئیات ساخت هسته‌ی پیش از انتشار عمومی در [Development Roadmap](ROADMAP.md) نگهداری می‌شود.

```text
Development Roadmap: v0.5.0 → v0.30.0
Public Product Roadmap: v1.0.0 → v50.0.0
```

این دو سند نقش متفاوت دارند:

- `v0.x` قراردادها، مرزهای معماری و Core Flow را می‌سازد و اثبات می‌کند.
- `v1+` فصل‌های عمومی رشد محصول را تعریف می‌کند.
- هیچ Major Version فقط برای بزرگ‌کردن شماره منتشر نمی‌شود.
- بین دو Major Version می‌توان چندین نسخه‌ی `MINOR` و `PATCH` برای تکمیل، آزمایش و اصلاح همان فصل منتشر کرد.

> این Roadmap قرارداد زمانی یا وعده‌ی تاریخ انتشار نیست. `v1` تا `v10` نسبتاً مشخص، `v11` تا `v26` هدف‌دار اما قابل بازبینی، و `v27` تا `v50` افق جهت‌دهنده است. قبل از شروع هر Major، شواهد نسخه‌ی قبلی می‌توانند Scope یا شماره‌ی نسخه‌های بعدی را تغییر دهند.

---

## 1. مقصد نهایی

POOF باید به یک اکوسیستم متصل یادگیری زبان تبدیل شود، نه مجموعه‌ای از صفحه‌ها و Featureهای جدا:

```text
LEARN → TEXT / MEDIA → POOF SELECT → DICTIONARY → CARD
  ↑                                                ↓
REAL LIFE ← CONVERSATION ← AI ← REVIEW ← PROGRESS
```

در این اکوسیستم:

- تقریباً هر متن آموزشی با `SelectablePoofText` قابل فهم، ذخیره و پیگیری است.
- Dictionary معنی را براساس Context توضیح می‌دهد.
- Card جمله، منبع و موقعیت اصلی را حفظ می‌کند.
- Learn، Library، Media، AI، Review، Social و Chat یک Language Context مشترک دارند.
- POOF یک همراه آرام و مفید است؛ نه قاضی، فروشنده یا ابزار ایجاد اضطراب.
- رقابت اختیاری، عادلانه و جدا از مسیر اصلی یادگیری است.
- توسعه از فارسی‌زبانان و زبان آلمانی آغاز می‌شود، سپس انگلیسی و جوامع کمترخدمت‌گرفته‌شده را پوشش می‌دهد و در نهایت به Language Pairهای گسترده می‌رسد.

---

## 2. پل لازم بین `v0.30.0` و `v1.0.0`

پایان `v0.30.0` به‌تنهایی مجوز انتشار عمومی نیست. یک دوره‌ی Alpha/Beta باید این موارد را تکمیل کند:

- انتخاب و آماده‌سازی Production Client؛ ترجیح معماری محصول Flutter است، اما قراردادهای Domain نباید به Client قفل شوند.
- Threat Modeling، RLS Audit، Secret Management و Backup/Restore Drill.
- Privacy Policy، Terms، Export/Delete Account و سیاست نگهداری داده.
- Accessibility، RTL/LTR، عملکرد موبایل و Network Interruption Recovery.
- Content QA برای مسیر اولیه‌ی فارسی → آلمانی.
- Crash Reporting، Product Analytics با رضایت کاربر و کانال Support.
- Closed Alpha، سپس Beta محدود و رفع Blockerهای واقعی.

تا عبور از این Gate، شماره‌ی `v1.0.0` استفاده نمی‌شود.

---

## 3. معماری داده‌ی بلندمدت

اصل مهم این است که از روز اول برای هر Module یک Database جدا ساخته نشود. ابتدا یک Source of Truth رابطه‌ای و چند سرویس تخصصی پیرامون آن کافی است؛ جداسازی بیشتر فقط با شواهد مقیاس، امنیت یا مالکیت تیمی انجام می‌شود.

| نوع داده یا قابلیت | محل پیشنهادی | قانون اصلی |
| --- | --- | --- |
| User، Profile، Lesson، Dictionary، Card، Deck، Progress، Post، Comment، Message Metadata، Media Catalog و Entitlement | PostgreSQL / Supabase | منبع حقیقت رابطه‌ای؛ Migration، Constraint، Audit و RLS الزامی |
| عکس، جلد، PDF، Audio، Attachment و فایل Subtitle بزرگ | Object Storage | Database فقط Metadata، مالکیت، Hash، Version و Object Key را نگه می‌دارد |
| فیلم و سریال | Stream Provider پشت `MediaProvider`؛ Bunny Stream کاندیدای آغازین | فایل و Transcode در سرویس Stream؛ Catalog، Rights، Subtitle Segment و Watch Progress در PostgreSQL |
| چت پایدار | PostgreSQL | Conversation، Membership و Message ذخیره می‌شوند؛ Attachment در Object Storage |
| Presence، Typing و تحویل زنده‌ی چت | Supabase Realtime در شروع | Event زنده جای Message پایدار را نمی‌گیرد؛ Channel خصوصی و مجوز دسترسی لازم است |
| نبرد زنده | Realtime + Cache/Event Service در مقیاس بالاتر | State لحظه‌ای و Matchmaking می‌تواند در Redis یا سرویس مشابه باشد؛ Result نهایی در PostgreSQL ثبت می‌شود |
| AI | Backend `AIGateway` + PostgreSQL + Vector Store | API Key هرگز در Client نیست؛ Context، Consent، Retention، Cost Limit و Provider Adapter اجباری است |
| Semantic Search / RAG | `pgvector` در شروع | Embedding از داده‌ی Canon/مجاز ساخته می‌شود؛ دسترسی آن از RLS و Rights تبعیت می‌کند |
| Search عمومی | PostgreSQL Full-Text Search در شروع | موتور Search مستقل فقط وقتی وارد می‌شود که کیفیت، زبان‌ها یا مقیاس آن را اثباتاً لازم کنند |
| پرداخت | `PaymentProvider` Adapter + Gateway مجاز هر بازار | اطلاعات کارت بانکی در POOF ذخیره نمی‌شود؛ Subscription و Entitlement در PostgreSQL ثبت می‌شود |
| Analytics | Event Pipeline جدا از Transactional DB در مقیاس بالاتر | Analytics منبع حقیقت User Progress نیست و باید با رضایت و حداقل‌سازی داده کار کند |
| Canon Asset Registry | PostgreSQL + Object Storage | `asset_id`، Version، Status، Revision History و Approval Owner حفظ می‌شوند |

### قواعد اتصال محتوا

- کتاب، مقاله، روزنامه، فیلم، موسیقی و Podcast فقط با محتوای دارای مجوز، Public Domain، Partner Feed یا Upload مجاز وارد می‌شوند.
- YouTube Connector نباید بر «دانلود زیرنویس همه‌ی ویدئوهای عمومی» بنا شود؛ API رسمی دانلود Caption به مجوز مدیریت ویدئو نیاز دارد. Embed، لینک مجاز، Caption متعلق به کاربر/Partner یا Transcript دارای حق استفاده مسیرهای قابل اتکاترند.
- Lyrics و Subtitle دارای Copyright هستند و باید Rights، Territory و Expiry داشته باشند.
- Provider خارجی باید پشت Adapter باشد تا Domain Model به یک شرکت قفل نشود.

### منابع فنی مبنا

- [Supabase Architecture](https://supabase.com/docs/guides/getting-started/architecture)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Realtime Authorization](https://supabase.com/docs/guides/realtime/authorization)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase pgvector](https://supabase.com/docs/guides/database/extensions/pgvector)
- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [PostgreSQL Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)
- [Bunny Stream API](https://bunny.net/docs/api-reference/stream)
- [YouTube Captions: download](https://developers.google.com/youtube/v3/docs/captions/download)

---

## 4. قوانین ثابت تمام نسخه‌های عمومی

هر Major Version فقط زمانی قابل انتشار است که علاوه بر Scope خودش، این Gateها را پاس کند:

1. یک User Promise واضح و قابل لمس داشته باشد.
2. Feature جدید به Flow متصل POOF وصل شود؛ صفحه‌ی جزیره‌ای پذیرفته نیست.
3. Migration، Rollback، Backup و Recovery Plan داشته باشد.
4. Privacy، Security، Accessibility، Abuse و Content Rights بررسی شده باشند.
5. Loading، Empty، Error، Retry، Permission و Expired Session متناسب با Feature پوشش داده شوند.
6. Metric موفقیت و Failure Budget قبل از Release مشخص باشد.
7. Classic و Snowy و هر World فعال، منطق یکسان و Visual Layer سازگار داشته باشند.
8. Release Notes، Data Contract و Decision Log به‌روز باشند.
9. حذف یا تغییر ناسازگار API/Data فقط در Major و با Migration روشن انجام شود.
10. هیچ Feature اجتماعی، AI یا Gamification بدون کنترل کاربر و Safety Layer منتشر نشود.

---

## بخش اول — مسیر نسبتاً مشخص `v1.0.0` تا `v10.0.0`

### `v1.0.0` — German Core Public

**وعده‌ی عمومی:** یک فارسی‌زبان می‌تواند مسیر ابتدایی آلمانی را شروع کند، متن را بفهمد، واژه را با Context ذخیره کند و روی چند دستگاه مرور را ادامه دهد.

**تحویل اصلی:**

- Learn آلمانی A1 Starter با Unit، Lesson و Exerciseهای پایه.
- Story Reader کوچک، Dictionary پایه و POOF Select.
- Card، Deck، Review/SRS پایه و Progress همگام‌شده.
- Sign in، Profile، Export/Delete Account و Recovery.
- Classic و Snowy با Navigation و Logic مشترک.

**زیرساخت:** Production Client، Supabase/PostgreSQL، Auth، RLS، Storage، Observability و Content Versioning.

**دروازه‌ی انتشار:** Core Loop انتها‌به‌انتها، Audit امنیت، Beta واقعی و نبودن Data-loss Blocker.

### `v2.0.0` — German Learning Path A1–A2

**وعده‌ی عمومی:** POOF از یک Core قابل استفاده به یک مسیر آموزشی منظم و روزانه تبدیل می‌شود.

**تحویل اصلی:**

- مسیر کامل‌تر A1 و A2، Unit Map، Skill Prerequisite و Placement سبک.
- Grammar Notes، Listening، Dictation و تمرین‌های متنوع‌تر.
- XP شخصی، Goal و Streak محافظت‌شده بدون Shame یا Punishment.
- جعبه‌کارت‌های آماده برای هر Unit، موضوع و سطح.
- POOF Home که «قدم بعدی مناسب» را نشان می‌دهد.

**زیرساخت:** Content CMS/Authoring اولیه، Skill Graph و Versioned Learning Content.

**دروازه‌ی انتشار:** گروه آزمایشی بتواند A1 را بدون مسیر شکسته طی کند و Progress با تغییر محتوای نسخه‌ای خراب نشود.

### `v3.0.0` — Library: Text & Audio

**وعده‌ی عمومی:** یادگیری از Lesson به محتوای واقعی و سطح‌بندی‌شده گسترش می‌یابد.

**تحویل اصلی:**

- Story، Graded Reader، Article، Podcast و Transcript.
- Collection، Bookmark، Resume، Difficulty و Content Filters.
- POOF Select در Reader و Transcript.
- Card Packهای آماده‌ی هر محتوا و مسیر Content → Card → Review.
- Rights/Provenance قابل مشاهده برای محتوا.

**زیرساخت:** Library Catalog، Object Storage، Transcript Segment Model، Rights Registry و Editorial Workflow.

**دروازه‌ی انتشار:** حداقل یک مجموعه‌ی منسجم و قانونی برای A1–A2 با Search و Resume پایدار.

### `v4.0.0` — Ask POOF: AI Tutor v1

**وعده‌ی عمومی:** کاربر می‌تواند درباره‌ی متن فعلی توضیح Context-aware بگیرد، بدون خروج از مسیر یادگیری.

**تحویل اصلی:**

- Explain meaning، Grammar، Example و Sentence Translation از POOF Select.
- Card Draft پیشنهادی؛ ذخیره فقط با تأیید کاربر.
- AI Chat محدود به Context آموزشی و تاریخچه‌ی قابل مدیریت.
- نمایش منبع و مرز عدم قطعیت در پاسخ‌های مبتنی بر محتوای POOF.
- Daily/Plan Limit و Cost Controls.

**زیرساخت:** Backend `AIGateway`، Provider Adapter، Prompt/Evaluation Registry، Moderation، Usage Ledger و `pgvector` برای محتوای مجاز.

**دروازه‌ی انتشار:** Evalهای آلمانی–فارسی، کنترل Hallucination پرخطر، Privacy/Retention و Kill Switch عملیاتی.

### `v5.0.0` — POOF Moments: Social v1

**وعده‌ی عمومی:** کاربر می‌تواند لحظه‌های کوتاه یادگیری را مثل Post کوتاه منتشر و درباره‌ی زبان گفت‌وگو کند.

**تحویل اصلی:**

- Post کوتاه، Comment، Reply، Like/Reaction، Save و Follow.
- POOF Select روی Post و Comment آموزشی.
- Share Card/Context بدون افشای داده‌ی خصوصی منبع.
- Feed محدود و قابل کنترل، نه Infinite Scroll اعتیادآور.
- Report، Block، Mute و Moderator Console از روز اول.

**زیرساخت:** Social Graph، Moderation Queue، Visibility Model، Abuse Rate Limit و Audit Log.

**دروازه‌ی انتشار:** Policy اجتماعی، ابزار رسیدگی، ضد Spam و کنترل مخاطب قبل از Public Feed.

### `v6.0.0` — Direct Conversation: Chat v1

**وعده‌ی عمومی:** کاربران می‌توانند گفت‌وگوی متنی امن و آموزشی یک‌به‌یک داشته باشند.

**تحویل اصلی:**

- Conversation، Message، Reply، Reaction، Attachment محدود و Read State.
- Presence/Typing اختیاری و Notification Controls.
- POOF Select، Dictionary و Card Capture داخل Message.
- Report/Block، Message Request و محدودیت‌های سنی/حریم خصوصی.
- Export/Delete و Retention Policy پیام‌ها.

**زیرساخت:** Messageهای پایدار در PostgreSQL، Attachment در Storage و Delivery/Presence با Realtime Channel خصوصی.

**دروازه‌ی انتشار:** RLS Membership Tests، Abuse Tools، Delivery Reliability و عدم نشت Message میان Conversationها.

### `v7.0.0` — Connected Media: Podcast, Music & YouTube

**وعده‌ی عمومی:** کاربر می‌تواند از محتوای صوتی و ویدئویی مجاز، همراه Transcript، یاد بگیرد.

**تحویل اصلی:**

- Podcast RSS، Audio Player، Transcript Sync و Resume.
- Music Metadata و Lyrics فقط از منبع مجاز.
- YouTube Embed/Partner Connector و Transcriptهای مجاز.
- Queue، Playlist، Speed Control و Capture از Timestamp.
- POOF Select روی Transcript و ساخت Card با Source Position.

**زیرساخت:** `MediaProvider` و `TranscriptProvider` Adapter، Rights/Territory/Expiry و Media Progress.

**دروازه‌ی انتشار:** حداقل یک Provider قانونی و پایدار برای هر نوع فعال؛ هیچ Scraping مبهمی مسیر اصلی نباشد.

### `v8.0.0` — Film & Series Learning

**وعده‌ی عمومی:** فیلم و سریال به یک محیط یادگیری Contextual تبدیل می‌شوند، نه فقط Player.

**تحویل اصلی:**

- Catalog فصل/قسمت، Video Player، Subtitle Tracks و Watch Progress.
- Select از Subtitle، Dictionary، Ask POOF و Card با Timestamp.
- Dual Subtitle اختیاری، Loop Segment و Comprehension Mode.
- Collections و Recommendation براساس سطح، نه صرفاً Engagement.
- Content Rights و Geo/Territory Control.

**زیرساخت:** Stream Provider پشت Adapter؛ Bunny Stream کاندیدای آغازین برای Upload/Transcode/Delivery، در حالی که Metadata و Progress در PostgreSQL می‌مانند.

**دروازه‌ی انتشار:** Playback پایدار، Subtitle Alignment، هزینه‌ی Egress کنترل‌شده و مجوز روشن تمام عناوین.

### `v9.0.0` — Premium & Sustainable Business

**وعده‌ی عمومی:** POOF مدل درآمدی شفاف دارد و Core Learning را با Dark Pattern قفل نمی‌کند.

**تحویل اصلی:**

- Free/Premium Entitlement روشن، Trial کنترل‌شده و Restore Purchase.
- Monthly/Yearly Plan، Receipt، Cancel، Refund Path و Invoice در بازارهای قابل پشتیبانی.
- Premium برای ظرفیت بیشتر AI/Media و امکانات پیشرفته؛ نه حذف عمدی هسته‌ی یادگیری.
- Gift/Scholarship یا Sponsored Access برای گروه‌های کم‌برخوردار.
- Subscription Settings و Usage Transparency.

**زیرساخت:** `PaymentProvider` Adapter، Webhook Verification، Entitlement Ledger و Financial Audit؛ داده‌ی کارت فقط نزد Gateway.

**دروازه‌ی انتشار:** بررسی حقوقی/مالیاتی هر بازار، Failure Recovery و عدم از‌دست‌رفتن دسترسی پس از پرداخت معتبر.

### `v10.0.0` — Living POOF Companion v1

**وعده‌ی عمومی:** شخصیت POOF در اپ «زندگی» را شروع می‌کند و مسیر روزانه را به شکلی آرام و شخصی همراهی می‌کند.

**تحویل اصلی:**

- حضور پیوسته در Home، Learn، Review و Library با Stateهای منسجم.
- Routine، Celebration آرام، Rest Mode و پیشنهاد قدم بعد.
- Memory محدود و شفاف از Goal و Preferences، با امکان مشاهده/پاک‌کردن.
- Snowy POOF و Classic POOF مطابق Character/World Bible.
- Companion هیچ‌گاه کاربر را سرزنش، تحقیر یا برای خرید تحت فشار نمی‌گذارد.

**زیرساخت:** Companion State Machine، Canon Asset Registry، Behavior Rules و User Memory Controls.

**دروازه‌ی انتشار:** Consistency Test شخصیت، Accessibility، Battery/Performance و تأیید Canon Owner.

---

## بخش دوم — تسلط آلمانی و غنی‌شدن اکوسیستم `v11.0.0` تا `v15.0.0`

### `v11.0.0` — German B1 Journey

**وعده‌ی عمومی:** مسیر ساختاریافته‌ی B1 با تمرکز بر زندگی واقعی، کار و مکالمه.

**تحویل اصلی:** Curriculum کامل B1، Speaking/Writing Task، Scenario، Long-form Reading، واژگان موضوعی و آمادگی پایه‌ی آزمون.

**زیرساخت و Gate:** Rubric و Human-reviewed Content؛ اثبات پوشش Skillها و کیفیت نمونه‌های پاسخ.

### `v12.0.0` — German B2 Journey

**وعده‌ی عمومی:** کاربر از محتوای آموزشی ساده به استدلال، رسانه و مکالمه‌ی جدی‌تر می‌رسد.

**تحویل اصلی:** B2 Path، Debate/Opinion، Workplace/University German، Listening بلند و Writing Feedback.

**زیرساخت و Gate:** Assessment Engine دقیق‌تر، Writing Review Pipeline و Level Calibration با مدرس متخصص.

### `v13.0.0` — German C1–C2 & Exam Studio

**وعده‌ی عمومی:** POOF از سطح متوسط عبور می‌کند و مسیر پیشرفته و آزمون‌محور معتبر ارائه می‌دهد.

**تحویل اصلی:** C1/C2 Tracks، Academic/Professional German، Mock Exam، Timed Practice، Portfolio و Progress Evidence.

**زیرساخت و Gate:** Blueprint سطح/آزمون، Expert Review و ادعاهای دقیق؛ POOF بدون مجوز، مدرک رسمی صادر نمی‌کند.

### `v14.0.0` — German Dictionary Pro

**وعده‌ی عمومی:** معنی واژه براساس جمله و کاربرد واقعی فهمیده می‌شود، نه فقط یک ترجمه‌ی تخت.

**تحویل اصلی:** Lemma، Sense، Gender، Plural، Inflection، Valency، Collocation، Register، Synonym/Antonym، Audio و مثال‌های فراوان با Provenance.

**زیرساخت و Gate:** Normalized Lexical Model، Sense Linking، Corpus Rights و Context Ranking Eval؛ User Card همچنان از Shared Dictionary جدا می‌ماند.

### `v15.0.0` — German Library Pro

**وعده‌ی عمومی:** Library به مرکز بزرگ منابع سطح‌بندی‌شده شبیه یک کتابخانه‌ی آموزشی حرفه‌ای تبدیل می‌شود.

**تحویل اصلی:** کتاب، داستان، مقاله، روزنامه، Course، Podcast، Film/Series Collection، Topic Path و Card Boxهای آماده.

**زیرساخت و Gate:** Publisher/Partner Pipeline، Editorial CMS، Rights Expiry Alerts، Search Ranking و پوشش متوازن A1–C2.

---

## بخش سوم — زبان‌ها و جوامع کمترخدمت‌گرفته‌شده `v16.0.0` تا `v23.0.0`

### `v16.0.0` — English Core A1–A2

**وعده‌ی عمومی:** همان Core Loop اثبات‌شده برای فارسی → انگلیسی، بدون Forkکردن معماری.

**تحویل اصلی:** Learn A1–A2، Dictionary پایه، Stories، Card Packs، POOF Select و AI Evalهای انگلیسی–فارسی.

**زیرساخت و Gate:** Language-neutral Contracts، Locale QA و عدم Regression مسیر آلمانی.

### `v17.0.0` — English B1–B2

**وعده‌ی عمومی:** مسیر انگلیسی برای تحصیل، کار، رسانه و مکالمه‌ی واقعی کامل‌تر می‌شود.

**تحویل اصلی:** B1/B2 Curriculum، Writing/Speaking، Media Collections و Contextual Vocabulary.

**زیرساخت و Gate:** Level Calibration مستقل و Content Team/Review متخصص انگلیسی.

### `v18.0.0` — English C1–C2 & Dictionary Pro

**وعده‌ی عمومی:** انگلیسی پیشرفته، Academic/Professional و Dictionary Contextual به سطح محصول آلمانی نزدیک می‌شوند.

**تحویل اصلی:** C1/C2، Exam/Academic Tracks، Lexical Senses، Collocations، Media/News و Advanced AI Feedback.

**زیرساخت و Gate:** Corpus/License Coverage، Expert Review و Feature Parity تعریف‌شده، نه ترجمه‌ی سطحی محتوا.

### `v19.0.0` — Persian Communities: Iran, Afghanistan & Tajikistan

**وعده‌ی عمومی:** POOF برای فارسی ایران، دری افغانستان و تاجیکی تجربه‌ی بومی و محترمانه می‌سازد.

**تحویل اصلی:** Locale/Script Support، Terminology محلی، Content Voices، Community Spaces، Moderation و Support متناسب هر جامعه.

**زیرساخت و Gate:** Regional Locale Model، Community Advisory Review، Safety/Escalation و سنجش کیفیت با کاربران همان جامعه.

### `v20.0.0` — Turkish & Turkmen Bridge

**وعده‌ی عمومی:** چارچوب توسعه برای زبان‌ها و جوامعی که محصولات بزرگ کمتر عمیق پوشش داده‌اند، عملی می‌شود.

**تحویل اصلی:** یک مسیر ترکی کامل‌تر و Turkmen Pilot براساس شریک محتوایی و تقاضا؛ Dictionary/Card/POOF Select بومی.

**زیرساخت و Gate:** Script/Morphology Plugin، Native Reviewer، Rights Coverage و تصمیم Go/No-Go جدا برای هر زبان.

### `v21.0.0` — Multilingual Language Graph

**وعده‌ی عمومی:** محتوا و واژگان از مدل «هر زبان یک جزیره» به Graph چندزبانه منتقل می‌شوند.

**تحویل اصلی:** Concept/Lemma/Sense Graph، Source/Target Language جدا، Pivot Links، Translation Provenance و Cross-language Search.

**زیرساخت و Gate:** Stable IDs، Sense Alignment و Migration بدون ادغام اشتباه معنی‌های متفاوت.

### `v22.0.0` — First New-Language Wave

**وعده‌ی عمومی:** دو یا سه زبان بعدی براساس داده و آمادگی واقعی، نه محبوبیت لحظه‌ای، اضافه می‌شوند.

**تحویل اصلی:** Language Onboarding Kit، Starter Learn، Dictionary، Card Packs و Community Beta برای زبان‌های منتخب، روی Language Graph نسخه‌ی قبل.

**زیرساخت و Gate:** انتخاب زبان با Scorecard شامل تقاضا، شکاف بازار، Reviewer، Corpus، Rights، هزینه و توان پشتیبانی؛ نام زبان‌ها در زمان Planning Gate قطعی می‌شود.

### `v23.0.0` — Any Language Pair v1

**وعده‌ی عمومی:** کاربر می‌تواند Source Language و Learning Language را آزادانه‌تر انتخاب کند؛ جهت DuoCards-like اما با Context عمیق POOF.

**تحویل اصلی:** Pair-aware Dictionary/Card/Review، UI Language مستقل، Fallback Translation و Pair Coverage Indicator.

**زیرساخت و Gate:** همه‌ی Pairها ادعای کیفیت یکسان ندارند؛ Coverage و Confidence باید شفاف باشد و Pair ضعیف برچسب Beta بگیرد.

---

## بخش چهارم — جامعه، رقابت و جهان‌های POOF `v24.0.0` تا `v26.0.0`

### `v24.0.0` — Community & Chat Pro

**وعده‌ی عمومی:** Social و Chat به یک شبکه‌ی چندزبانه‌ی آموزشی بالغ تبدیل می‌شوند.

**تحویل اصلی:** Group، Channel، Thread، Club، Search، Translation Assist، Voice Note، Event و Moderator Roles.

**زیرساخت و Gate:** Message Partitioning در صورت نیاز، Media Scanning، Trust/Reputation، Appeals و Regional Moderation Coverage.

### `v25.0.0` — Live XP Battles

**وعده‌ی عمومی:** کاربران می‌توانند هم‌زمان وارد Quiz Battle اختیاری شوند و براساس سطح و مهارت رقابت کنند.

**تحویل اصلی:** Lobby، Friend Fight، Matchmaking، Real-time Questions، XP/Rating، Season و Spectator محدود؛ الهام از Quiz of Kings بدون کپی مکانیک اعتیادآور.

**زیرساخت و Gate:** Authoritative Match Server، Realtime Events، Ephemeral Cache، Result Ledger، Anti-cheat، Latency Budget و Fairness by Level.

رقابت نباید شرط Progress، Premium یا ارزش‌گذاری شخصیت کاربر باشد؛ امکان خاموش‌کردن کامل آن وجود دارد.

### `v26.0.0` — Eight Living Worlds

**وعده‌ی عمومی:** Themeها از Skin ساده به هشت جهان منسجم با رفتار، صدا و فضای خاص تبدیل می‌شوند.

**تحویل اصلی:** تکمیل Classic و Snowy و اضافه‌شدن Berry، Ocean، Lavender، Sun، Forest و Nebula/Galactic؛ Navigation و Domain Logic ثابت می‌ماند.

**زیرساخت و Gate:** Design Token System، World/Character Bible، Versioned Asset Pipeline، Performance Budget، Accessibility و Canon Approval.

هیچ World نباید Feature اصلی را پنهان، رفتار POOF را متناقض یا اپ را روی دستگاه ضعیف غیرقابل استفاده کند.

---

## بخش پنجم — افق قابل‌تغییر `v27.0.0` تا `v50.0.0`

این بخش جهت حرکت را مشخص می‌کند، نه Scope نهایی. هر ردیف پیش از اجرا باید به PRD، Data Contract، Threat/Rights Review و Release Gate مستقل تبدیل شود.

| Version | فصل پیشنهادی | اثبات لازم برای خروج |
| --- | --- | --- |
| `v27.0.0` | **Adaptive Review Pro** — SRS تطبیقی، Forgetting Signal و Review Mix | بهبود Retention بدون افزایش آزاردهنده‌ی زمان مرور |
| `v28.0.0` | **Pronunciation Lab** — Phoneme، Recording، Feedback و Shadowing | ارزیابی معتبر برای Accentهای هدف و کنترل حریم صوت |
| `v29.0.0` | **Voice AI Roleplay** — سناریوی مکالمه، Hint و Debrief | Latency/Cost/Safety قابل قبول و Rubric انسانی |
| `v30.0.0` | **Media Comprehension Studio** — Clip، Dictation، Loop و Quiz از Transcript | اتصال واقعی Media → Select → Card → Review |
| `v31.0.0` | **Creator Studio** — ساخت Lesson، Story، Deck و Transcript Pack | Versioning، Preview، Rights Declaration و Moderation |
| `v32.0.0` | **Learning Marketplace** — محتوای Creator/Teacher و Revenue Share | کیفیت، Refund، Fraud Control و سازوکار Payout قانونی |
| `v33.0.0` | **Teacher & Classroom** — Assignment، Cohort و Progress Dashboard | رضایت زبان‌آموز، حداقل‌سازی داده و Role Security |
| `v34.0.0` | **School & Institution** — Tenant، Admin، SSO و Reporting | جداسازی Tenant، قرارداد پردازش داده و Support SLA |
| `v35.0.0` | **Global Dictionary Graph** — Lexical Knowledge Graph چندزبانه | Provenance، Sense Quality و Conflict Resolution |
| `v36.0.0` | **Global Licensed Library Network** — Publisher/Media Partners | Rights/Territory/Expiry Automation و Economics پایدار |
| `v37.0.0` | **Adaptive Learning Graph** — مسیر شخصی براساس Skill Evidence | قابل توضیح بودن توصیه و جلوگیری از قفل‌شدن در مسیر AI |
| `v38.0.0` | **Assessment Studio** — Placement، Diagnostic و Readiness | Reliability، Bias Review و ادعای غیرگمراه‌کننده |
| `v39.0.0` | **Accessible & Low-Bandwidth POOF** — Cache، Resume و Lite Assets | Online-first باقی می‌ماند؛ تحمل قطعی و مصرف داده واقعاً بهتر شود، نه ادعای Full Offline |
| `v40.0.0` | **Trust, Safety & Global Moderation** — Policy Engine و Appeals | پوشش زبانی، زمان پاسخ و گزارش شفاف Safety |
| `v41.0.0` | **Clubs, Cohorts & Live Events** — گروه‌های هدف‌دار و تقویم یادگیری | Community Health بهتر از Feed Engagement صرف |
| `v42.0.0` | **Live Conversation Rooms** — Pair/Group Speaking و Matching | Consent، Safety، Quality Matching و Exit سریع |
| `v43.0.0` | **Cross-lingual Communication** — Translation Assist در Chat/Community | حفظ متن اصلی، Confidence و جلوگیری از جعل معنای قطعی |
| `v44.0.0` | **Persistent POOF Companion** — Memory، Goal و Long-term Coaching | Memory قابل مشاهده/ویرایش/حذف و عدم وابستگی ناسالم |
| `v45.0.0` | **Living Worlds & Seasons** — روایت، Event و World Progress | Season بدون FOMO/Pay Pressure و Canon منسجم |
| `v46.0.0` | **User-built Learning Worlds** — Scenario/Simulation قابل ساخت | Sandbox، Moderation، Asset Rights و Safety |
| `v47.0.0` | **Cross-platform Ecosystem** — Mobile، Web، Desktop و Surfaceهای مجاز | Feature Continuity، Sync و Platform-specific Quality |
| `v48.0.0` | **POOF Platform & Integrations** — API/SDK برای مدرسه، محتوا و ابزارها | Versioned API، Scope/Consent، Rate Limit و Developer Docs |
| `v49.0.0` | **Global Scale & Reliability** — Multi-region، Queue، Search و Observability | SLO، Disaster Recovery، Data Residency و هزینه‌ی پایدار |
| `v50.0.0` | **Connected Learning Ecosystem** — همگرایی Learn، Media، Dictionary، Card، AI، Review، Conversation و Real Life | یک Context بتواند بدون گسست میان همه‌ی Moduleها حرکت کند و کنترل داده نزد کاربر بماند |

`v50.0.0` قرار نیست «پایان POOF» باشد. این نسخه باید نشان دهد حلقه‌ی متصل محصول در مقیاس جهانی بالغ شده است؛ نه اینکه هر ایده‌ی ممکن داخل اپ ریخته شده باشد.

---

## 5. بودجه‌ی تغییر و جای اضافه‌شدن ایده‌های تازه

برای اینکه Roadmap خاک زنده‌ای برای کاشت ایده‌های آینده باشد، میزان قطعیت نسخه‌ها یکسان نیست:

| بازه | درجه‌ی قطعیت پیشنهادی | امکان تغییر |
| --- | --- | --- |
| `v1` تا `v5` | 70–80٪ | تغییر فقط با شواهد Beta، Safety یا مانع حقوقی/فنی |
| `v6` تا `v10` | 60–70٪ | ترتیب می‌تواند با نیاز واقعی کاربران جابه‌جا شود |
| `v11` تا `v26` | 40–60٪ | Scope در Planning Gate هر فصل دوباره سنجیده می‌شود |
| `v27` تا `v50` | 20–30٪ | فقط North Star و Dependency Direction ثابت است |

هر ایده‌ی تازه ابتدا وارد **Idea Seed Backlog** می‌شود، نه مستقیماً یک Version:

```text
Idea Seed
├── User problem
├── Connected loop node
├── Target users / languages
├── Data needed
├── Dependency
├── Rights / privacy / safety
├── Smallest experiment
├── Success and kill metrics
└── Candidate horizon: Now / Next / Later / Horizon
```

ایده فقط وقتی Version Number می‌گیرد که:

- با Promise همان فصل سازگار باشد؛
- Dependencyهایش ساخته شده باشند؛
- هزینه‌ی دائمی محتوا، Moderation و Support مشخص باشد؛
- بتوان برایش Definition of Done نوشت؛
- Feature دیگری را به شکل پنهان شکننده نکند.

حدود 20٪ ظرفیت هر Major می‌تواند برای Idea Seedهای هم‌راستا، Accessibility، Performance و بدهی معماری نگه داشته شود. Feature نامرتبط به نسخه‌ی بعدی منتقل می‌شود، نه اینکه Roadmap را بی‌معنا کند.

---

## 6. Planning Gate قبل از هر Major Version

پیش از شروع هر نسخه‌ی عمومی، یک سند کوتاه باید این سؤال‌ها را پاسخ دهد:

1. دقیقاً چه مشکل کاربر در نسخه‌ی قبلی حل‌نشده باقی مانده است؟
2. User Promise این Major چیست و چه چیزی عمداً خارج از Scope است؟
3. این Feature به کدام بخش از Loop متصل POOF وصل می‌شود؟
4. چه Data Contract یا Migration تازه‌ای لازم است؟
5. Source، Provider، License و هزینه‌ی دائمی آن چیست؟
6. چه Abuse، Privacy، Accessibility یا Bias Riskی دارد؟
7. چگونه با یک Pilot کوچک قبل از Build کامل آزمایش می‌شود؟
8. Metric موفقیت، Kill Criterion و Rollback Plan چیست؟
9. آیا تغییر واقعاً سزاوار Major Version است یا باید `vX.Y.0` باشد؟

---

## 7. مسیر خلاصه

| دوره | نسخه‌ها | مقصد |
| --- | --- | --- |
| Core Public | `v1`–`v4` | فارسی → آلمانی، Learn، Library و AI متصل |
| Community & Media | `v5`–`v10` | Social، Chat، Media، Premium و POOF زنده |
| German Mastery | `v11`–`v15` | B1–C2، Dictionary و Library حرفه‌ای |
| Language Expansion | `v16`–`v23` | انگلیسی، جوامع منطقه‌ای و Language Pairها |
| Worlds & Competition | `v24`–`v26` | Community Pro، Live Battle و هشت جهان |
| Intelligence & Creation | `v27`–`v35` | Review/Speech/AI پیشرفته، Creator و Dictionary Graph |
| Global Learning Network | `v36`–`v43` | Library جهانی، Assessment، Access و Conversation |
| Living Ecosystem | `v44`–`v50` | Companion، Worlds، Platform، Scale و همگرایی کامل |

---

## اصل نهایی

Roadmap موفق آن نیست که پنجاه شماره را بدون تغییر اجرا کند. Roadmap موفق آن است که در هر فصل، POOF را یک قدم واقعی به این حلقه نزدیک کند:

```text
Select → Understand → Explore → Save → Learn → Review → Converse → Live
```

**هر نسخه باید یک اتصال واقعی را عمیق‌تر کند؛ نه اینکه فقط یک صفحه‌ی تازه به اپ اضافه کند.**
