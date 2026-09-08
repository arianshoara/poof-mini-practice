# Localization and Bidirectional UI Contract

This document defines the localization, UI-language, content-language, persistence, fallback, dynamic-update, accessibility, and text-direction rules for POOF Mini Practice.

It becomes the architectural contract for:

`v0.8.0 — Localization & Bidirectional UI Foundation`

---

## Purpose

POOF Mini Practice must support multiple interface languages without duplicating Business Logic, duplicating application pages, or scattering language-specific conditions across Feature files.

Localization is a shared infrastructure concern.

Feature code must not decide separately how Persian, German, or English interfaces behave.

The intended architecture is:

```text
Feature UI
    ↓
Translation Key
    ↓
Localization Service
    ↓
Active Locale
    ↓
Translated UI
```

Changing the UI language must not change personal Card data, learning content, Deck identity, Theme, or other domain state.

---

## One Shared Application

POOF Mini Practice uses one shared application structure.

Localization must not create duplicated language-specific copies of application pages such as:

```text
fa/cards.html
de/cards.html
en/cards.html
```

The same HTML, CSS, Business Logic, and Feature code must support all UI languages.

Language differences belong in:

```text
Locale files
Localization Service
Document language and direction
Direction-aware presentation
```

They do not belong in duplicated pages or duplicated Feature implementations.

---

## Supported UI Languages

The first supported UI languages are:

```text
fa
de
en
```

Their user-visible language names are:

```text
fa → فارسی
de → Deutsch
en → English
```

These identifiers are stable UI-language identifiers.

Feature files must not invent alternative identifiers such as:

```text
persian
german
english
fa-IR
de-DE
en-US
```

unless a future architectural decision explicitly changes the contract.

---

## Default UI Language

The default UI language is:

```text
en
```

English is intentionally the default because the existing POOF Mini Practice interface is currently English.

A user with no saved UI-language preference must therefore continue receiving the existing language rather than experiencing an unexpected language change after the Localization system is introduced.

For `v0.8.0`, the application does not automatically replace this decision with:

```text
navigator.language
browser locale
device locale
geographic location
```

Automatic language detection may be considered separately in a future version.

The initial behavior must remain deterministic.

---

## Fallback UI Language

The fallback translation language is:

```text
en
```

The Default UI Language and Fallback UI Language are currently the same, but they represent different concepts.

```text
Default UI Language
=
language used when the user has no valid saved preference

Fallback UI Language
=
language used when the active locale does not contain a requested translation
```

A future version may change one without necessarily changing the other.

---

## UI Language Preference

The UI-language preference will use its own localStorage key:

```text
poof-ui-language
```

This preference is separate from:

```text
poof-theme
```

and separate from Card Storage:

```text
poof-mini-card-storage
```

Changing UI Language must not mutate Card Storage.

Changing Theme must not mutate UI-language preference.

Deleting or repairing Card Storage must not remove the selected UI language.

---

## Saved Language Validation

A saved UI language is valid only when it is exactly one of:

```text
fa
de
en
```

If the stored value is missing:

```text
use en
```

If the stored value is unsupported or invalid:

```text
ignore it
use en
```

Reading an invalid preference must not crash the page.

An invalid value must never become the active UI language.

Reading the preference does not need to rewrite or delete an invalid stored value.

Only valid language values may be saved through the public Localization API.

---

## Storage Failure

Browser storage access may fail because of browser restrictions, privacy settings, quota problems, or unavailable storage.

If reading the UI-language preference fails:

```text
do not crash
use en
log a diagnostic warning
```

If saving the UI-language preference fails:

```text
do not crash
keep the selected language active for the current page
log a diagnostic warning
```

A Language Preference failure must not modify or reset:

```text
Card Storage
Deck data
Theme preference
learning content
```

---

## UI Language and Content Language Are Different

POOF must keep these concepts separate:

```text
UI Language
Content Language
```

UI Language controls application interface text.

Examples:

```text
Navigation
buttons
labels
headings
dialogs
status messages
settings
search controls
sort controls
document title
accessible names
```

Content Language describes the language of learning content or user content.

Examples:

```text
German word
German sentence
Persian meaning
Story text
Lesson text
Dictionary example
Deck name
user-entered text
```

Example:

```text
UI Language: fa
Content Language: de
```

means:

```text
interface → Persian
learning content → German
```

Changing:

```text
fa → de
```

as the UI Language must not translate or modify German learning content.

The list of supported UI languages must not be reused as a validator for every future Content Language.

These are separate domain concepts.

---

## Translation Files

Translations will be stored separately from Feature code.

The planned files are:

```text
locales/fa.js
locales/de.js
locales/en.js
```

Each Locale contains the same stable Translation Keys.

The English Locale acts as the canonical fallback Key Set.

Before `v0.8.0` is considered complete, all Translation Keys used by the supported UI scope must exist in all three Locale files.

---

## Locale Key Parity

The English Locale defines the canonical set of Translation Keys.

The German and Persian Locale files must contain the same required Key Set.

Before release, validation must detect:

```text
missing keys
unexpected stale keys
duplicate keys
empty translation values
non-string translation values
```

Runtime fallback protects the user from a broken screen, but fallback does not make an incomplete Locale acceptable for release.

A missing translation remains a defect.

---

## Translation Registry

Locale files will register their messages in one shared Locale Registry.

The planned runtime registry is:

```text
window.POOF_LOCALES
```

Conceptually:

```javascript
window.POOF_LOCALES = {
    en: {},
    de: {},
    fa: {}
};
```

Every Locale file must initialize or extend the Registry safely.

Loading one Locale file must not erase Locales that were registered earlier.

Feature code must not access Locale objects directly.

Feature code must use the Localization Service.

---

## Translation Key Contract

Translation Keys are stable identifiers.

They describe UI meaning, not translated wording.

Valid examples:

```text
nav.home
nav.learn
nav.library
nav.cards
nav.account

cards.title
cards.create
cards.delete
cards.empty
cards.search
cards.sort

account.title
account.theme
account.language
```

Feature code must use Keys such as:

```javascript
poofI18n.t("cards.delete")
```

Feature code must not contain language-specific branching such as:

```javascript
if (language === "fa") {
    button.textContent = "حذف";
} else if (language === "de") {
    button.textContent = "Löschen";
}
```

That pattern is forbidden.

---

## Translation Key Naming

Translation Keys use:

```text
domain.element
```

or when additional grouping is needed:

```text
domain.group.element
```

Examples:

```text
cards.deck.create
cards.deck.rename
cards.deck.delete
cards.delete.confirm
account.language.title
```

Keys must:

```text
use lowercase ASCII
use dot-separated namespaces
describe meaning
remain independent from translated wording
```

Changing visible English wording must not require changing the Translation Key when the meaning remains the same.

Two interface messages with different meanings must not share a Key merely because their current English text happens to be identical.

---

## Translation Parameters

Some interface messages require dynamic values.

Examples:

```text
card count
Deck name
search result count
maximum length
```

The Localization Service may support named parameters conceptually through:

```javascript
poofI18n.t(
    "cards.deck.deleteConfirm",
    {
        deckName: "German A1"
    }
);
```

Locale messages may use named placeholders such as:

```text
Delete {deckName}?
```

Dynamic values must be treated as plain text.

They must not be interpreted as HTML.

Complex pluralization is not required for the first Localization foundation. Separate semantic Keys may be used where singular and plural wording differ.

---

## No Raw UI Strings in Migrated Scope

After a UI area is migrated to the Localization system, new user-facing interface strings must not be hard-coded inside Feature JavaScript or HTML.

For example, this is not allowed:

```javascript
button.textContent = "Delete";
```

The intended form is:

```javascript
button.textContent =
    poofI18n.t("cards.delete");
```

Static HTML may temporarily contain fallback text during migration, but the completed `v0.8.0` scope must obtain translated UI text from Translation Keys.

This rule applies only to interface text.

It does not mean user content or learning content must be translated.

---

## Translations Are Plain Text

Locale messages are plain user-facing text.

Translation values must not contain executable markup or be inserted through:

```javascript
innerHTML
```

The default rendering path must use safe text operations such as:

```javascript
textContent
```

Translated dynamic values and user-provided values must never be combined into trusted HTML.

If rich translated content is required in a future version, it needs a separate reviewed rendering contract.

---

## Localization Service

The central service will live at:

```text
js/i18n.js
```

The planned public interface is:

```text
getUiLanguage()
setUiLanguage(language)
isValidUiLanguage(language)
t(key, variables)
applyTranslations()
applyDocumentLanguage()
```

The public browser API will be exposed through:

```text
window.poofI18n
```

Feature code must use this public boundary instead of:

```text
reading poof-ui-language directly
reading Locale objects directly
changing document direction independently
implementing its own fallback logic
implementing its own parameter replacement
```

---

## Translation Lookup

For:

```javascript
t(key, variables)
```

the lookup order is:

```text
1. active UI language
2. fallback language: en
3. emergency missing-translation result
```

If a Key is missing from the active Locale but exists in English:

```text
return the English translation
log a diagnostic warning
```

If a Key is also missing from English:

```text
log a diagnostic error
return "Translation unavailable"
```

The raw Key must not be displayed to the user.

For example, the UI must never visibly show:

```text
cards.delete.confirm
```

Missing translations are considered defects and must be found during Regression before release.

---

## Static Translation Targets

Static HTML elements may declare Translation Keys through attributes such as:

```html
<h1 data-i18n="cards.title">
    Cards
</h1>
```

Different translated properties must not be treated as identical targets.

Conceptually, the Localization system must be able to update:

```text
text content
placeholder
title attribute
accessible label
document title
```

The exact DOM attribute contract will be finalized before UI migration begins.

Feature-specific code must not scan and translate the document independently.

---

## Dynamic UI Translation

Some interface elements are created after the initial page translation.

Examples:

```text
Card controls
Deck controls
confirmation dialogs
empty states
validation messages
status messages
search result messages
```

Dynamic Feature UI must request translated text through:

```javascript
poofI18n.t(...)
```

It must not copy translated text from existing DOM elements.

When the language changes without a full page reload, existing dynamic interface elements must also update.

---

## Language Change Event

After a valid UI-language change is applied, the Localization Service must publish one shared browser event.

The planned event name is:

```text
poof:ui-language-change
```

Conceptually:

```javascript
document.dispatchEvent(
    new CustomEvent(
        "poof:ui-language-change",
        {
            detail: {
                language
            }
        }
    )
);
```

Feature code that owns dynamic UI may listen for this event and render its interface text again.

Feature code must not create competing Language Change events.

The event must be dispatched only after:

```text
active language updated
document language applied
document direction applied
static translations applied
```

---

## Document Language and Direction

The active UI language controls the root document attributes.

For Persian:

```html
<html lang="fa" dir="rtl">
```

For German:

```html
<html lang="de" dir="ltr">
```

For English:

```html
<html lang="en" dir="ltr">
```

The direction mapping is:

```text
fa → rtl
de → ltr
en → ltr
```

The values of:

```text
html.lang
html.dir
```

must describe the UI language, not the language of one Card or one learning sentence.

---

## Initial Page Load

The saved UI-language preference should be applied as early as practical during page startup.

The goal is to avoid displaying the page briefly in the wrong language or direction before switching to the saved preference.

The initialization path must conceptually be:

```text
read saved UI language
→ validate
→ choose active language
→ apply html.lang
→ apply html.dir
→ translate UI
```

Directly opening any supported application page must follow the same initialization path.

Localization must not depend on visiting the Account page first.

---

## Bidirectional Content

Changing the page to RTL must not force German or English learning text to behave as RTL content.

The root page direction and individual content direction are separate layers.

When Content Language is known, the element should use explicit language and direction information.

Example:

```html
<span lang="de" dir="ltr">
    Ich gehe zur Schule.
</span>
```

When the language or direction of user-generated text is not reliably known, the element should use:

```html
dir="auto"
```

Example:

```html
<span dir="auto">
    User-entered Deck name
</span>
```

Known LTR content should not depend unnecessarily on automatic direction detection, especially when it may begin with:

```text
numbers
punctuation
parentheses
symbols
```

---

## Mixed-Direction Example

This interface state is valid:

```text
UI Language: fa
Content Language: de
```

Visible meaning:

```text
کلمه: der Apfel
معنی: سیب
مثال: Ich esse einen Apfel.
```

The Persian labels follow RTL UI layout.

German words and sentences remain readable in their natural LTR direction.

Numbers, punctuation, parentheses, Deck names, and mixed Persian/German text must be included in Bidirectional Regression.

---

## CSS Direction Rules

Layout code that must respond to interface direction should prefer logical CSS properties.

Preferred examples:

```css
margin-inline-start
margin-inline-end
padding-inline-start
padding-inline-end
inset-inline-start
inset-inline-end
text-align: start
text-align: end
border-inline-start
border-inline-end
```

Direction-sensitive layout must avoid unnecessary assumptions based only on:

```css
left
right
margin-left
margin-right
padding-left
padding-right
```

Not every physical CSS property is forbidden.

The rule applies when a property represents logical reading direction or layout flow.

Decorative positioning that is intentionally physical may continue using physical properties when documented and tested.

---

## Theme Independence

Theme and Localization are separate systems.

All supported combinations must remain valid:

```text
fa + classic
fa + snowy

de + classic
de + snowy

en + classic
en + snowy
```

Changing Theme must not change UI Language.

Changing UI Language must not change Theme.

Applying one Preference must not overwrite the storage key of the other Preference.

---

## Language Selector

The Account page will provide the UI-language selector.

The choices are displayed using their native names:

```text
فارسی
Deutsch
English
```

These labels remain recognizable regardless of the currently active UI language.

Selecting a valid language must:

```text
save the preference when storage is available
update the active language
apply the new document language
apply the new document direction
refresh static translated UI immediately
notify dynamic Feature UI
remain active after Refresh
remain active across page navigation
```

A full page reload must not be required merely to change the language.

The selected state must be visually and accessibly identifiable.

---

## Scope of v0.8.0

The required translated interface scope is:

```text
Navigation
Cards
Learn
Account
```

This includes user-facing strings in those areas such as:

```text
document titles
titles
headings
buttons
form labels
placeholders
status messages
validation messages
empty states
error states
search controls
sort controls
Deck management
confirmation dialogs
Theme settings
Language settings
JavaScript-generated UI messages
accessible names
```

Localization infrastructure must be loaded consistently on every page needed to preserve the selected language across navigation.

---

## Content Is Not Automatically Translated

`v0.8.0` does not translate stored learning content.

Changing UI Language must not translate:

```text
Card word
Card meaning
Card example
Deck name
Lesson learning content
user-entered text
```

These values are Domain or User Content, not interface strings.

---

## Card Storage Schema

The active Card Storage schema remains:

```text
schema_version: 2
```

`v0.8.0` must not silently add a required persisted:

```text
language
```

field to existing Cards.

Doing so would make previously valid Cards incompatible with the current contract.

If a future version adds persisted Content Language Metadata to Cards, that is a Card Storage schema change and must include:

```text
new schema version
migration
validation
backup and recovery regression
```

No Card Storage schema bump is required merely for storing UI Language Preference.

The UI-language preference belongs to:

```text
poof-ui-language
```

not Card Storage.

---

## Future Content Language Metadata

Future structured learning content should explicitly carry Language Metadata where required.

Conceptually:

```json
{
  "language": "de"
}
```

This prepares future:

```text
Dictionary
Story
Lesson
POOF Select
Context Capture
Review
```

for correct text direction, pronunciation, Dictionary lookup, and language semantics.

This requirement does not mean `v0.8.0` must redesign the existing persisted Card schema.

---

## Accessibility

Localization must preserve accessible names and states.

Translated UI must also update relevant:

```text
aria-label
aria-description
aria-live messages
dialog text
button text
form labels
input placeholders
document title
```

Language switching must not remove Keyboard accessibility or Focus behavior that already works.

The Language Selector itself must expose the selected state accessibly.

Changing language must not unexpectedly move Keyboard Focus or close an active Dialog.

Screen readers must receive the correct root document language after a language change.

---

## Failure Rules

Localization failure must not crash the page.

An unsupported saved UI language falls back to:

```text
en
```

A missing active-Locale Translation Key falls back to:

```text
en
```

A Key missing from both the active Locale and English must:

```text
log an error
show the emergency fallback
not show the raw Translation Key
```

Failure to read or write Language Preference must not crash the page.

Language failure must not modify:

```text
Card Storage
Deck data
Theme preference
learning content
```

---

## Regression Requirements

Before `v0.8.0` is complete, Regression must cover:

```text
3 UI languages
×
2 Themes
×
Mobile and Desktop
```

The final user flow must include:

```text
select Persian
→ open Cards
→ create or inspect German learning text
→ open Learn
→ Refresh
→ return to Account
→ switch to German
→ verify Theme
→ navigate again
```

Direct-page testing must include opening these pages without first visiting Home or Account:

```text
index.html
cards.html
learn.html
library.html
account.html
```

Bidirectional testing must include combinations such as:

```text
Persian UI + German content
Persian UI + English content
German UI + Persian text
numbers
punctuation
parentheses
mixed-script Deck names
```

Failure testing must include:

```text
missing saved preference
valid saved preference
invalid saved preference
unavailable localStorage read
failed localStorage write
missing active-Locale Key
missing English fallback Key
```

Dynamic UI testing must include:

```text
change language while Cards are visible
change language while Deck controls are visible
change language while a Dialog is open
change language after a status or validation message exists
```

No raw Translation Key may remain visible in the final UI.

No supported page may require visiting another page first before applying the saved language.

---

## Out of Scope for v0.8.0

This Milestone does not implement:

```text
real Dictionary data
automatic AI translation
multiple learning-language systems
DuoCards-style language pairs
automatic translation of user Cards
Story
POOF Select
remote language sync
database-backed settings
browser-language auto-detection
advanced pluralization framework
separate HTML pages for each language
```

These remain separate future capabilities.

---

## Definition of Done

`v0.8.0` is complete when:

```text
fa
de
en
```

all operate through the same Business Logic;

the selected UI language survives Refresh and page navigation when browser storage is available;

the page remains usable when Language Preference cannot be read or saved;

Theme and UI Language remain independent;

the interface applies the correct root language and direction;

known German learning text remains correctly readable as LTR content inside Persian RTL UI;

unknown or user-entered mixed content receives safe direction handling;

static and dynamic interface text both update without requiring a full page reload;

document titles and accessible interface text are localized;

missing translations fail safely through the defined fallback path;

the three Locale files pass Key Set validation;

no duplicated language-specific application pages exist;

and the migrated UI scope no longer depends on scattered language-specific conditions, hard-coded translated strings, or unsafe HTML translation rendering.
```
