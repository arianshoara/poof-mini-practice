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

`schema_version` identifies the structure of the stored data.

The first version uses:

`schema_version: 1`

If the card structure changes in the future, this number can be used to create a migration.

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

- Must be a non-empty string.
- The first version uses `default`.
- Real deck management will be introduced later.

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

The storage layer must handle:

- Missing stored data
- Invalid JSON
- Invalid storage structure
- Unsupported schema versions
- Invalid card objects
- Duplicate card identifiers
- Browser storage errors

A storage error must not crash the entire page.

Errors should be reported through `console.error()` until a visible error system is introduced.

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

## Future Migration

In a future version, the implementation behind `js/storage.js` may change from localStorage to Supabase.

Pages such as Cards, Dictionary, and Library should continue using the same storage operations instead of directly communicating with the storage technology.
