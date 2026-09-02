# Card Storage Contract

This document defines how personal card data is represented and stored in POOF Mini Practice.

## Purpose

The first storage implementation uses browser `localStorage`.

Other parts of the project must not access `localStorage` directly.

All card storage operations will be handled by:

`js/storage.js`

This separation will make it possible to replace localStorage with Supabase or another database in a future version.

---

## Storage Key

Personal card data will be stored using this key:

`poof-mini-card-storage`

The key must be defined only inside `js/storage.js`.

Other files must not depend on the storage key.

---

## Stored Structure

The stored value will be converted to JSON and will use this structure:

{
  "schema_version": 1,
  "cards": []
}

### schema_version

`schema_version` identifies the persisted Card Storage contract.

The current version uses:

`schema_version: 1`

The schema version changes only when the persisted data contract actually changes.

Every structural change to persisted Card Storage must include an explicit migration path from the previous supported schema.

A schema change is not considered complete unless it includes:

- A new schema version
- Migration from the previous version
- Validation after migration
- Backup and recovery behavior
- Regression testing

Schema versions must not be increased only to create an artificial migration.

Migrations are sequential.

A migration registered for version `N` is responsible for:

`N → N + 1`

For example, migrating from version `1` to version `3` requires:

`1 → 2 → 3`

Missing migration steps must stop the process rather than guessing how stored data should be transformed.

### cards

`cards` contains the personal cards created by the user.

It must always be an array.

---

## User Card Structure

Every personal card must use the following structure:

{
  "id": "card_example",
  "dictionary_entry_id": null,
  "word": "Schule",
  "meaning": "مدرسه",
  "example": "Heute gehe ich zur Schule.",
  "deck_id": "default",
  "source_type": "manual",
  "source_id": null,
  "source_text": null,
  "created_at": "2026-08-16T10:00:00.000Z",
  "updated_at": "2026-08-16T10:00:00.000Z"
}

---

## Card Field Rules

### id

- Must be a non-empty string.
- Must be unique.
- Identifies one personal card.
- Must not change after the card is created.

### dictionary_entry_id

- May contain the identifier of a dictionary entry.
- May be `null` for manually created cards.
- Must not cause dictionary data and personal card data to become the same object.

### word

- Must be a non-empty string.
- Contains the word or expression being learned.

### meaning

- Must be a non-empty string.
- Contains the meaning selected by the user.

### example

- Must be a string.
- May be empty in the first version.
- May contain the sentence in which the word appeared.

### deck_id

In schema version 1:

- Must be a non-empty string.
- The normal UI uses `default`.
- The value is stored directly on the Card.

Starting with schema version 2:

- Must be a non-empty string.
- Must reference the `id` of an existing Deck.
- A Card must never reference a missing Deck.
- Changing a Deck name must not change Card `deck_id` values.
- Moving a Card between Decks changes only its `deck_id`.

### source_type

The first version supports:

- `manual`
- `dictionary`
- `lesson`
- `story`

A manually created card uses:

`source_type: "manual"`

### source_id

- May contain the identifier of a lesson, story, or another source.
- May be `null` when the card has no external source.

### source_text

- May contain the original sentence or surrounding context.
- May be `null` for manually created cards.

### created_at

- Must contain the card creation time.
- Must use an ISO date string.

### updated_at

- Must contain the last update time.
- Must use an ISO date string.

---

---

## Planned Schema Version 2 — Deck Foundation

Schema version 2 introduces real Deck entities.

The persisted structure will become:

    {
      "schema_version": 2,
      "cards": [],
      "decks": []
    }

The application must not switch to schema version 2 until the migration and validation logic are implemented and tested.

### Deck Structure

Every Deck uses this structure:

    {
      "id": "deck_example",
      "name": "German B1",
      "is_default": false,
      "created_at": "2026-08-20T10:00:00.000Z",
      "updated_at": "2026-08-20T10:00:00.000Z"
    }

### Deck id

- Must be a non-empty string.
- Must be unique inside `decks`.
- Identifies one Deck.
- Must not change after the Deck is created.
- New user-created Decks receive an automatically generated ID.
- A Deck ID must not be generated from the Deck name.
- The Default Deck uses the stable ID `default`.

### Deck name

- Is chosen by the user.
- May contain normal Unicode text, including Persian, German characters, spaces, symbols, and emoji.
- Leading and trailing whitespace must be removed before storage.
- Must remain non-empty after trimming.
- Must not exceed 80 characters.
- Does not identify the Deck.
- May be changed without changing the Deck ID.
- Duplicate Deck names are allowed because Deck identity is determined by `id`.

### is_default

Exactly one Deck must be the Default Deck.

The Default Deck must use:

    id: default
    is_default: true

All other Decks must use:

    is_default: false

The Default Deck:

- Must always exist.
- May be renamed by the user.
- Must not be deleted.

Renaming the Default Deck changes only its visible `name`.

Its stable ID remains:

    default

### created_at

- Must contain the Deck creation time.
- Must use an ISO date string.

### updated_at

- Must contain the last Deck update time.
- Must use an ISO date string.
- Must not be earlier than `created_at`.

### Card and Deck Relationship

Every Card must reference exactly one existing Deck through:

    card.deck_id

The referenced value must match:

    deck.id

A stored Card with a `deck_id` that does not exist in `decks` makes the storage structure invalid.

Changing a Deck name must not require rewriting its Cards.

### Deck Deletion Rules

The Default Deck must not be deleted.

A non-default Deck may be deleted only when no Cards reference its ID.

If Cards still reference the Deck, deletion must fail without modifying the Deck or the Cards.

The application must not silently move Cards to another Deck during deletion.

The user must move those Cards first and then delete the empty Deck.

### Migration from Schema Version 1 to Version 2

Migration must preserve every valid Card from schema version 1.

The migration must always create a real Default Deck:

    id: default
    name: Default Deck
    is_default: true

Existing Cards using:

    deck_id: default

must keep the same `deck_id`.

For every distinct non-default `deck_id` already present in valid schema version 1 Cards, migration must create one corresponding Deck.

For example, if schema version 1 contains:

    card A → deck_id: default
    card B → deck_id: german
    card C → deck_id: german

schema version 2 must contain Decks representing:

    default
    german

The Card references themselves remain:

    card A → default
    card B → german
    card C → german

For a migrated non-default Deck:

- Its `id` must preserve the original legacy `deck_id`.
- Its initial visible name uses the trimmed legacy `deck_id` when that name is 80 Unicode code points or fewer.
- If the trimmed legacy `deck_id` exceeds 80 Unicode code points, the initial visible name uses only the first 80 Unicode code points.
- Truncating the visible name must not change the preserved legacy Deck `id`.
- It uses `is_default: false`.
- Migration assigns valid ISO timestamps to `created_at` and `updated_at`.

This prevents migration from discarding legacy Deck references that were valid under schema version 1.

After migration:

- Every Card from version 1 must still exist.
- Every Card must reference an existing Deck.
- Exactly one Default Deck must exist.
- Deck IDs must be unique.
- Card IDs must remain unchanged.
- Card `created_at` values must remain unchanged.

If these conditions are not satisfied, migration must fail instead of writing the migrated Storage.

## Storage Operations

The storage layer will eventually provide these operations:

### getCards()

Returns all personal cards.

### getCardById(cardId)

Returns one card matching the given identifier.

### addCard(card)

Validates and stores a new personal card.

### updateCard(cardId, changes)

Updates an existing personal card without changing its identifier or creation date.

### deleteCard(cardId)

Deletes one personal card.

The first implementation may introduce these operations gradually.

---

## Separation Rule

Dictionary data and personal card data must remain separate.

Dictionary data represents shared language knowledge.

Personal cards represent the user’s selected learning material and personal context.

Creating, editing, or deleting a personal card must not modify `data/dictionary.json`.

A card may reference a dictionary entry using `dictionary_entry_id`, but it remains an independent personal object.

---

## Error Rules

The storage layer must distinguish genuinely empty Storage from unreadable or unsupported Storage.

Supported read states include:

- `ok`
- `empty`
- `invalid_json`
- `invalid_version`
- `future_version`
- `migration_failed`
- `invalid_structure`

`empty` means no stored Card Storage exists.

Invalid, unsupported, or failed Storage must not silently become `empty`.

The storage layer must handle situations including:

- Missing stored data
- Invalid JSON
- Missing or invalid schema versions
- Unsupported future schema versions
- Failed migrations
- Invalid storage structure
- Invalid card objects
- Duplicate card identifiers
- Browser storage errors
- Failed writes

A storage error must not crash the entire page.

Errors may be reported through `console.error()` for diagnostics, but user-facing consumers must receive explicit result states through the public Storage API.

The Cards UI may display an Error State instead of incorrectly presenting unreadable Storage as an empty card list.

---

## Backup and Recovery Rules

Before a normal Card Storage mutation, the current raw Storage value must be copied to the dedicated backup key when Storage already exists.

The backup must preserve the previous raw stored value.

If the required backup cannot be created, the normal write must stop.

Primary Card Storage must not be overwritten after a backup failure.

A backup is not automatically considered safe to restore.

Before recovery, the backup must pass through the same processing pipeline used for primary Storage:

    parse
    → detect schema version
    → migrate when required
    → validate

An invalid backup must not be restored.

A valid backup using an older supported schema may be migrated in memory before recovery.

Recovery must require explicit user confirmation.

The application must not automatically replace primary Card Storage merely because a backup exists.

The current recovery interaction uses two explicit steps:

    Restore last backup
    → Confirm restore
    → restore

Recovery writes are intentionally separate from normal writes so that a valid backup is not replaced by unreadable primary Storage during recovery.

---

## Current Limitations

localStorage:

- Belongs to one browser and device
- Does not synchronize between devices
- Can be cleared by the user or browser
- Is not a secure place for sensitive information
- Does not provide real user authentication
- Does not replace a production database

POOF Mini Practice must not store passwords, API keys, access tokens, or other secrets inside localStorage.

---

## Future Persistence Migration

In a future version, the implementation behind `js/storage.js` may change from localStorage to Supabase.

Pages such as Cards, Dictionary, and Library should continue using the same storage operations instead of directly communicating with the storage technology.
