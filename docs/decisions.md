# Architecture Decision Log

This file records important architectural decisions made during the development of POOF Mini Practice.

A decision should explain:

- What problem existed
- What solution was selected
- Why that solution was selected
- What consequences it creates

---

## Decision 001 — Use One Shared Theme System

**Status:** Accepted  
**Date:** 2026-08-14

### Context

POOF Mini Practice currently supports two visual themes:

- Classic
- Snowy

All pages have the same structure and behavior. Only colors and visual values should change between themes.

Creating separate HTML or CSS files for every page and theme would cause duplication and make future changes difficult.

### Decision

The project will use one shared theme system.

Theme values are defined as CSS custom properties inside:

```text
css/themes.css
```
The active theme is stored on the root HTML element:
```
<html data-theme="snowy">
```
Shared components continue to use the same variables:
```
color: var(--color-text);
background-color: var(--color-background);
```
The JavaScript file responsible for applying and changing themes is:
```
js/theme.js
```
Consequences
Positive consequences:
Pages do not need separate theme-specific HTML.
Components automatically receive the active theme.
New themes can be added without copying the application structure.
Theme logic has one source of truth.
Trade-offs:
Every new component must use shared CSS variables.
Hard-coded colors should be avoided.
New themes must define every required variable.
Decision 002 — Store Theme Preference in localStorage
Status: Accepted
Date: 2026-08-14
Context
The selected theme should remain active after:
Refreshing the page
Closing and reopening the browser
Moving between pages
POOF Mini Practice does not currently have a backend or user account system.
Decision
The active theme will be stored in browser localStorage using this key:
poof-theme
Only supported theme values are accepted:
classic
snowy
If the stored value is missing or invalid, the application uses the default theme.
Consequences
Positive consequences:
Theme preference survives page refreshes.
No backend or database is required.
All pages can read the same preference.
Limitations:
The preference belongs to one browser and device.
It will not synchronize between devices.
Clearing browser data removes the saved preference.
localStorage must not be treated as secure storage.
Decision 003 — Auto-Hide Bottom Navigation While Reading
Status: Provisional
Date: 2026-08-14
Context
A fixed bottom navigation occupies part of the mobile screen.
While reading lessons or stories, hiding the navigation during downward scrolling can provide more space for content.
The navigation should return when the user scrolls upward.
Decision
The bottom navigation will:
Remain visible when a page first opens
Remain visible near the top of the page
Hide after meaningful downward scrolling
Return after meaningful upward scrolling
Ignore very small scroll movements
Remain visible on pages without scrolling
The behavior is controlled by:
```
js/navigation.js
```
The visual hidden state is controlled by:
```
.navigation-hidden
```
Consequences
Positive consequences:
More screen space is available while reading.
Navigation returns when the user appears to need it.
The behavior is suitable for future lessons and stories.
Risks:
Excessive sensitivity may cause visual flickering.
Users may not immediately understand where the navigation went.
The behavior requires testing with real long-form content.
Validation Status
The implementation exists, but the current pages do not contain enough content for complete testing.
This decision must be reviewed during the data-driven Learn milestone.
