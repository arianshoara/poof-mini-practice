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
