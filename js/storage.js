const CARD_STORAGE_KEY =
    "poof-mini-card-storage";

const CARD_SCHEMA_VERSION = 1;

const ALLOWED_CARD_SOURCE_TYPES = [
    "manual",
    "dictionary",
    "lesson",
    "story"
];

function createEmptyCardStorage() {
    return {
        schema_version: CARD_SCHEMA_VERSION,
        cards: []
    };
}

function isNonEmptyString(value) {
    return (
        typeof value === "string" &&
        value.trim() !== ""
    );
}

function isOptionalString(value) {
    return (
        value === undefined ||
        typeof value === "string"
    );
}

function isOptionalReference(value) {
    return (
        value === undefined ||
        value === null ||
        isNonEmptyString(value)
    );
}

function isValidCardInput(cardInput) {
    if (
        cardInput === null ||
        typeof cardInput !== "object"
    ) {
        return false;
    }

    const sourceType =
        cardInput.source_type === undefined
            ? "manual"
            : cardInput.source_type;

    const hasValidDeck =
        cardInput.deck_id === undefined ||
        isNonEmptyString(cardInput.deck_id);

    const hasValidSourceType =
        ALLOWED_CARD_SOURCE_TYPES.includes(
            sourceType
        );

    return (
        isNonEmptyString(cardInput.word) &&
        isNonEmptyString(cardInput.meaning) &&
        isOptionalString(cardInput.example) &&
        hasValidDeck &&
        isOptionalReference(
            cardInput.dictionary_entry_id
        ) &&
        hasValidSourceType &&
        isOptionalReference(cardInput.source_id) &&
        (
            cardInput.source_text === undefined ||
            cardInput.source_text === null ||
            typeof cardInput.source_text === "string"
        )
    );
}

function isValidCardStorage(storageData) {
    return (
        storageData !== null &&
        typeof storageData === "object" &&
        storageData.schema_version ===
            CARD_SCHEMA_VERSION &&
        Array.isArray(storageData.cards)
    );
}

function readCardStorage() {
    try {
        const storedValue =
            localStorage.getItem(CARD_STORAGE_KEY);

        if (storedValue === null) {
            return createEmptyCardStorage();
        }

        const parsedValue = JSON.parse(storedValue);

        if (!isValidCardStorage(parsedValue)) {
            console.error(
                "Invalid card storage structure."
            );

            return createEmptyCardStorage();
        }

        return parsedValue;
    } catch (error) {
        console.error(
            "Failed to read card storage:",
            error
        );

        return createEmptyCardStorage();
    }
}

function writeCardStorage(storageData) {
    if (!isValidCardStorage(storageData)) {
        console.error(
            "Card storage cannot be written because its structure is invalid."
        );

        return false;
    }

    try {
        const serializedValue =
            JSON.stringify(storageData);

        localStorage.setItem(
            CARD_STORAGE_KEY,
            serializedValue
        );

        return true;
    } catch (error) {
        console.error(
            "Failed to write card storage:",
            error
        );

        return false;
    }
}

function getCards() {
    const storageData = readCardStorage();

    return [...storageData.cards];
}

window.poofStorage = {
    getCards
};
