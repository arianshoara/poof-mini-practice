# Architecture Decision Log

This file records important architectural decisions made during the development of POOF Mini Practice.

Each decision explains:

- What problem existed
- What solution was selected
- Why the solution was selected
- What consequences it creates

---

## Decision 001 — Use One Shared Theme System

**Status:** Accepted  
**Date:** 2026-08-14

### Context

POOF Mini Practice currently supports two visual themes:

- Classic
- Snowy

All pages share the same structure and behavior. Only visual values such as colors, borders, surfaces, and shadows should change between themes.

Creating separate HTML or component files for every theme would create duplication and make future changes difficult.

### Decision

The project will use one shared theme system.

Theme values are defined as CSS custom properties inside `css/themes.css`.

The active theme is stored on the root HTML element using the `data-theme` attribute.

Shared components use variables such as `var(--color-text)` and `var(--color-background)` instead of theme-specific hard-coded colors.

The JavaScript responsible for applying, validating, saving, and changing themes is located in `js/theme.js`.

### Consequences

Positive consequences:

- Pages do not need separate theme-specific HTML.
- Components automatically receive the active theme.
- New themes can be added without copying application structure.
- Theme values have one shared source of truth.

Trade-offs:

- New components must use shared CSS variables.
- Hard-coded colors should be avoided.
- Every supported theme must define all required variables.

---

## Decision 002 — Store Theme Preference in localStorage

**Status:** Accepted  
**Date:** 2026-08-14

### Context

The selected theme should remain active after refreshing the page, reopening the browser, and moving between pages.

POOF Mini Practice does not currently have a backend, database, or authentication system.

### Decision

The active theme will be stored in browser localStorage using the key `poof-theme`.

Only supported theme values are accepted:

- `classic`
- `snowy`

If the stored value is missing or invalid, the application uses the default theme.

### Consequences

Positive consequences:

- Theme preference survives page refreshes.
- No backend or database is required.
- All pages can read the same preference.

Limitations:

- The preference belongs to one browser and device.
- It does not synchronize between devices.
- Clearing browser data removes the preference.
- localStorage must not be treated as secure storage.

---

## Decision 003 — Auto-Hide Bottom Navigation While Reading

**Status:** Accepted
**Date:** 2026-08-14

### Context

A fixed bottom navigation occupies part of the mobile screen.

While reading lessons or stories, hiding the navigation during downward scrolling can provide more space for content.

The navigation should return when the user scrolls upward.

### Decision

The bottom navigation will:

- Remain visible when a page first opens
- Remain visible near the top of the page
- Hide after meaningful downward scrolling
- Return after meaningful upward scrolling
- Ignore very small scroll movements
- Remain visible on pages without scrolling

The behavior is controlled by `js/navigation.js`.

The hidden visual state is controlled by the `.navigation-hidden` CSS class.

### Consequences

Positive consequences:

- More screen space is available while reading.
- Navigation returns when the user appears to need it.
- The behavior may be useful for future lessons and stories.

Risks:

- Excessive sensitivity may cause visual flickering.
- Users may not immediately understand where the navigation went.
- The behavior requires testing with real long-form content.

### Validation Result

This behavior was reviewed during the data-driven Learn milestone after the Learn page received enough lesson content to create meaningful vertical scrolling.

The navigation was tested with the longer Learn page, particularly on mobile screens.

The tests confirmed that:

- The navigation remains visible when the page first opens.
- It remains visible near the top of the page.
- It hides during meaningful downward scrolling.
- It returns during upward scrolling.
- Small scroll movements do not cause excessive flickering.
- The transition works smoothly in both directions.
- The navigation does not prevent access to lesson content.

The behavior is now accepted for the current version of POOF Mini Practice.

It may still be reviewed again when longer lessons and stories are introduced.

---

## Decision 004 — Build Learn as a Data-Driven Interface

**Status:** Accepted  
**Date:** 2026-08-16

### Context

The Learn page needs to display a growing collection of language lessons.

One possible approach was to write every lesson card directly inside `learn.html`.

That approach would mix lesson data with page structure and create repeated HTML. Adding, removing, reordering, or updating lessons would require manually editing the HTML page.

This would become difficult to maintain as the number of lessons increases.

POOF Mini Practice also needs to practice an important architectural principle from the larger POOF project: shared content data should remain separate from the interface that displays it.

### Decision

The Learn page will use a data-driven architecture.

Shared lesson information is stored in:

`data/lessons.json`

The page structure remains inside:

`learn.html`

The behavior responsible for loading, validating, sorting, and rendering lessons is located in:

`js/learn.js`

The HTML page provides the initial Learn structure and the lesson container.

JavaScript receives lesson data and creates the lesson cards dynamically using DOM methods such as:

- `document.createElement()`
- `append()`
- `replaceChildren()`
- `createDocumentFragment()`

Lesson cards will not be written repeatedly by hand inside `learn.html`.

### Lesson Data Contract

Every lesson must contain the following properties:

- `id`
- `order`
- `title`
- `description`
- `level`
- `estimated_minutes`
- `status`

The properties must follow these rules:

- `id` must be a non-empty string.
- `order` must be a positive integer.
- `title` must be a non-empty string.
- `description` must be a non-empty string.
- `level` must be a non-empty string.
- `estimated_minutes` must be a positive number.
- `status` must be either `available` or `coming_soon`.

Lesson identifiers must be unique.

Lesson order values must also be unique.

The `id` represents the stable identity of a lesson.

The `order` controls the visual learning sequence and may be used to sort lessons before rendering.

### Validation Strategy

Lesson data is validated before it is rendered.

The application checks:

1. Whether the received data is an array.
2. Whether every lesson follows the lesson data contract.
3. Whether lesson identifiers are unique.
4. Whether lesson order values are unique.

If any validation fails, the lesson cards are not rendered.

Instead, the Learn page displays an error state.

This prevents partially invalid lesson data from silently creating broken or inconsistent interfaces.

### Rendering Strategy

Lessons are sorted by their `order` property before rendering.

A new lesson card element is created for every valid lesson.

Each card displays:

- Lesson number
- Language level
- Lesson title
- Lesson description
- Estimated duration
- Availability status

The created cards are first added to a `DocumentFragment`.

The completed fragment is then inserted into the lesson container.

This reduces repeated direct updates to the page while the cards are being constructed.

### Interface States

The Learn page supports four interface states:

- Loading
- Success
- Empty
- Error

The initial HTML contains the Loading state.

After the data request finishes:

- Valid lesson data produces the Success state.
- An empty lesson array produces the Empty state.
- A failed request or invalid data produces the Error state.

The page must not be designed only for the successful response.

### Separation of Responsibilities

The responsibilities are divided as follows:

`data/lessons.json`

- Stores shared lesson information.
- Acts as the current source of lesson data.
- Does not contain HTML or visual styling.
- Does not store personal user progress.

`learn.html`

- Defines the semantic structure of the Learn page.
- Provides the lesson container.
- Provides the initial Loading state.
- Does not contain repeated lesson cards.

`js/learn.js`

- Requests the lesson data.
- Validates the received data.
- Sorts the lessons.
- Creates lesson card elements.
- Manages Loading, Empty, Error, and Success states.

`css/main.css`

- Controls the visual presentation of the Learn page.
- Styles lesson cards and interface states.
- Uses shared theme variables instead of lesson-specific hard-coded theme colors.

### Consequences

Positive consequences:

- Lesson data is separated from page structure.
- New lessons can be added without copying HTML card structures.
- All lesson cards follow one rendering implementation.
- Lessons can be reordered through data.
- Invalid lesson data is detected before rendering.
- Loading, Empty, Error, and Success states are handled explicitly.
- The Learn interface works with both Classic and Snowy themes.
- The current JSON source can later be replaced by an API or database.
- The rendering layer does not need to know where the data ultimately comes from.

Trade-offs:

- The Learn page depends on JavaScript to display lesson cards.
- A failed JSON request prevents lessons from appearing.
- Data validation adds more code and must remain synchronized with the lesson structure.
- Changes to the lesson data contract may require updates to both the JSON data and the validation logic.
- Manual testing is currently required because automated tests have not yet been introduced.

### Current Limitations

The current lesson data is static and public.

The Learn system does not yet support:

- Opening a complete lesson
- Personal lesson progress
- Completed or locked lesson states
- User-specific availability
- Lesson exercises
- Lesson vocabulary
- Audio
- Review scheduling
- Database synchronization

These capabilities are outside the scope of the current milestone.

### Future Impact

In future versions, `data/lessons.json` may be replaced by:

- Supabase
- A PostgreSQL database
- A backend API
- Another content service

The Learn page should continue to receive lesson objects through a defined data contract.

Personal user data, such as lesson progress or completion status, must not be stored inside the shared lesson catalog.

That information will require a separate storage layer and, later, a user-specific database model.

---

## Decision 005 — Access Personal Card Data Through One Storage Layer

**Status:** Accepted  
**Date:** 2026-08-16

### Context

POOF Mini Practice needs to store personal vocabulary cards.

The current project does not have:

- A backend
- A database
- Authentication
- User accounts
- Cross-device synchronization

Browser localStorage is sufficient for the current learning milestone.

However, allowing every page to access localStorage directly would tightly connect the application interface to one storage technology.

For example, Cards, Dictionary, Library, and Learn could each begin using their own storage keys, JSON structures, validation rules, and error handling.

That duplication would make the future transition to Supabase or a backend difficult.

### Decision

All personal card storage operations will be handled by one shared file:

`js/storage.js`

Other project files must not directly call:

- `localStorage.getItem()`
- `localStorage.setItem()`
- `localStorage.removeItem()`

Pages must use the public storage interface instead.

The current public interface is available through:

`window.poofStorage`

It provides these operations:

- `getCards()`
- `getCardById(cardId)`
- `addCard(cardInput)`
- `updateCard(cardId, changes)`
- `deleteCard(cardId)`

### Storage Key

Personal card data is stored using one localStorage key:

`poof-mini-card-storage`

The key is defined only inside `js/storage.js`.

Other files must not depend on the key name.

### Storage Envelope

Stored card data uses this top-level structure:

{
  "schema_version": 1,
  "cards": []
}

The top-level object contains:

- A storage schema version
- An array of personal cards

The schema version is used to identify the structure of the stored data.

Future structural changes may require migrations from one schema version to another.

### Card Creation

The storage layer is responsible for creating the final stored card.

A card input may initially contain only the required learning information, such as:

- `word`
- `meaning`

The storage layer adds or normalizes:

- A unique card identifier
- Default deck information
- Default source information
- Creation time
- Update time
- Optional dictionary references
- Optional source context

Card identifiers are generated inside the storage layer.

Pages must not manually create or control stored card identifiers.

### Card Identity

The following values must remain stable:

- `id`
- `created_at`

Editing a card must not create a new identity for it.

The `updateCard()` operation may change editable learning fields but must preserve the original card identifier and creation time.

The `updated_at` value changes when an update is successfully stored.

### Validation

Card data is validated at multiple boundaries.

Before adding a card:

- Required input fields are checked.
- Supported source types are checked.
- Optional references are checked.

Before writing Storage:

- The top-level structure is checked.
- The schema version is checked.
- The cards value must be an array.

When reading Storage:

- Every stored card is validated.
- Required card fields are checked.
- Date values are checked.
- Card identifiers must be unique.
- The update date must not be earlier than the creation date.

Invalid data must not be silently treated as valid application data.

### Error Handling

Storage operations must not crash the entire page.

Read and write operations use error handling for situations such as:

- Invalid JSON
- Invalid Storage structure
- Unsupported Schema version
- Invalid card input
- Missing cards
- Browser Storage restrictions
- Failed writes

Storage mutations return a result object containing:

- `success`
- `card`
- `error`

This allows the interface to display a useful message without needing direct knowledge of the internal Storage implementation.

Read operations return safe values:

- `getCards()` returns an array.
- `getCardById()` returns a card or `null`.

### Separation of Shared and Personal Data

Personal cards must remain separate from shared dictionary data.

Shared dictionary information represents general language knowledge.

Personal cards represent:

- A user-selected word
- A selected meaning
- A personal example
- A source
- Learning context
- Personal organization

A card may contain `dictionary_entry_id` as a reference to a shared dictionary entry.

Creating, editing, or deleting a personal card must not modify shared dictionary data.

### Current Consumer

The Cards page currently uses:

`poofStorage.getCards()`

The page displays the number of stored cards without directly accessing localStorage.

The temporary controls used to test adding and deleting cards were removed after the storage flow was verified.

The underlying Storage operations remain available for the real Card Builder.

### Consequences

Positive consequences:

- Storage rules have one source of truth.
- Pages remain independent from localStorage details.
- Card validation is shared.
- Storage keys are not duplicated across files.
- Error handling is centralized.
- Card identity is controlled consistently.
- A future Storage implementation can preserve the same public operations.
- Card Builder, Dictionary, Library, and Learn can reuse the same layer.

Trade-offs:

- `storage.js` contains more logic than a direct localStorage call.
- All consumers depend on the public Storage contract.
- Changes to the public operations may affect multiple features.
- localStorage operations are synchronous.
- The current implementation uses a global `window.poofStorage` object.
- Automated tests have not yet been introduced.

### Current Limitations

The current Storage implementation:

- Belongs to one browser and device
- Does not synchronize between browsers
- Does not synchronize between devices
- Has no authenticated user owner
- Can be cleared by the browser or user
- Is not suitable for secrets
- Is not a production database
- Does not currently perform Schema migrations
- Does not provide automatic backup or recovery

Passwords, API keys, access tokens, and other secrets must never be stored through this layer.

### Future Impact

A future version may replace localStorage with:

- Supabase
- PostgreSQL
- A backend API
- Another persistent Storage provider

The implementation behind the public interface may change, but pages should continue using operations such as:

- `getCards()`
- `addCard()`
- `updateCard()`
- `deleteCard()`

This decision creates the first Storage Adapter boundary in POOF Mini Practice.

The same architectural principle can later be applied to:

- Lesson progress
- Theme preferences
- Decks
- Review history
- Library progress
- User settings

---

## Decision 006 — Use Explicit, Fail-Safe Card Storage Migrations and Recovery

Status: Accepted

Date: 2026-08-19

### Context

POOF Mini Practice stores personal card data in browser localStorage.

The Card Storage envelope already contains a `schema_version`, but before `v0.6.0` that value did not drive a real migration process.

This created an important risk.

If the stored structure changed in a future version, older user data could fail validation. If that failure were treated as an empty Storage state, the application could incorrectly appear to have no saved cards and a later write could overwrite the original data.

Storage failures must therefore be distinguishable from genuinely empty Storage.

The system also needs a controlled recovery path when a valid backup exists.

### Decision

Card Storage will use an explicit, sequential, fail-safe migration pipeline.

The current schema is identified by:

`CURRENT_CARD_SCHEMA_VERSION`

Storage is processed through the following stages:

    read raw
    → parse
    → detect schema version
    → migrate when required
    → validate
    → expose result

These stages must remain logically separate so that a failure can be identified before any mutation occurs.

### Read Result States

Card Storage reads use explicit states instead of treating every failure as an empty card list.

The current states include:

    ok
    empty
    invalid_json
    invalid_version
    future_version
    migration_failed
    invalid_structure

`empty` means no Card Storage exists.

The other failure states must not silently become `empty`.

The UI may present these failures as an Error State while preserving the underlying stored data.

### Migration Strategy

Migrations are registered sequentially.

A migration registered for version `N` is responsible only for:

    N → N + 1

For example:

    1 → 2
    2 → 3
    3 → 4

A migration from version `1` to version `4` must therefore pass through all required intermediate migrations.

Missing migration steps stop the process.

The system must not guess how to transform an unknown schema.

Migration logic works on a cloned representation of the stored data so the original parsed object is not mutated during migration.

Already-current Storage does not run previous migrations again.

This preserves migration idempotency at the pipeline level.

### Future Versions

If stored data has a schema version newer than the version understood by the running application, the Storage is classified as:

`future_version`

The application must not downgrade, rewrite, reset, or silently reinterpret that data.

This protects data created by a newer application version from being damaged by an older version.

### Backup Before Mutation

Before normal Card Storage writes, the existing raw Storage value is copied to a dedicated backup key.

The backup stores the raw previous value rather than a newly reconstructed approximation.

If the backup cannot be created, the normal write is stopped.

The main Storage must not be mutated when the required backup step fails.

### Recovery

Recovery is separate from normal Storage writes.

A backup must first pass through the same safe processing pipeline:

    parse
    → detect version
    → migrate when required
    → validate

An invalid backup is not recoverable.

A valid older backup may be migrated in memory before it is restored.

Recovery must require explicit user confirmation.

The application must not automatically replace primary Card Storage merely because a backup exists.

The current UI uses a two-step recovery interaction:

    Restore last backup
    → Confirm restore
    → restore

### UI Boundary

The Cards UI must not directly inspect or mutate localStorage.

Storage errors and recovery availability are exposed through the public Storage API.

This keeps the existing architectural boundary:

    UI
    → Public Storage API
    → Storage / Migration / Recovery logic
    → localStorage

The UI distinguishes at least:

    valid data
    empty data
    unreadable data
    recoverable unreadable data

Unreadable Storage must not be presented as if the user simply has no cards.

### Schema Change Rule

Every future structural change to persisted Card Storage must include an explicit migration path from the previous supported schema.

Changing the Storage contract without defining the required migration is not considered a complete schema change.

A schema version must not be increased only to create an artificial migration.

Schema versions change when the persisted data contract actually changes.

### Consequences

Positive consequences:

- Older Storage can be upgraded through explicit steps.
- Invalid JSON is distinguishable from empty Storage.
- Unsupported future Storage is preserved instead of rewritten.
- Missing migrations fail safely.
- Writes stop when required backup creation fails.
- Recovery uses validated data.
- Recovery requires an informed user action.
- UI error states no longer imply that personal cards were deleted.
- Migration behavior can be tested with reusable fixtures.

Trade-offs:

- Storage logic is more complex than direct localStorage access.
- Every persisted schema change requires migration maintenance.
- Backup data consumes additional browser Storage.
- Recovery currently protects only data still present in the same browser and device.
- localStorage remains local persistence and is not a substitute for a remote database or cross-device backup.

### Relationship to Decision 005

Decision 005 established the shared Card Storage boundary and introduced `schema_version`.

This decision extends that architecture with real migration, backup, failure reporting, and recovery behavior.

The earlier limitations in Decision 005 stating that Card Storage did not yet perform migrations or provide backup/recovery describe the state before `v0.6.0` and are superseded by this decision.

