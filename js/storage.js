const CARD_STORAGE_KEY =
    "poof-mini-card-storage";

const CARD_SCHEMA_VERSION = 1;

const ALLOWED_CARD_SOURCE_TYPES = [
    "manual",
    "dictionary",
    "lesson",
    "story"
];

const EDITABLE_CARD_FIELDS = [
    "dictionary_entry_id",
    "word",
    "meaning",
    "example",
    "deck_id",
    "source_type",
    "source_id",
    "source_text"
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

function createCardId() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return "card_" + crypto.randomUUID();
    }

    return (
        "card_" +
        Date.now() +
        "_" +
        Math.random().toString(16).slice(2)
    );
}

function createStoredCard(cardInput) {
    const currentTime =
        new Date().toISOString();

    return {
        id: createCardId(),

        dictionary_entry_id:
            cardInput.dictionary_entry_id ===
            undefined
                ? null
                : cardInput.dictionary_entry_id,

        word: cardInput.word.trim(),

        meaning: cardInput.meaning.trim(),

        example:
            cardInput.example === undefined
                ? ""
                : cardInput.example.trim(),

        deck_id:
            cardInput.deck_id === undefined
                ? "default"
                : cardInput.deck_id.trim(),

        source_type:
            cardInput.source_type === undefined
                ? "manual"
                : cardInput.source_type,

        source_id:
            cardInput.source_id === undefined
                ? null
                : cardInput.source_id,

        source_text:
            cardInput.source_text === undefined
                ? null
                : cardInput.source_text,

        created_at: currentTime,
        updated_at: currentTime
    };
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

function getCardById(cardId) {
    if (!isNonEmptyString(cardId)) {
        return null;
    }

    const cards = getCards();

    const matchingCard = cards.find(
        (card) => card.id === cardId
    );

    if (matchingCard === undefined) {
        return null;
    }

    return matchingCard;
}

function addCard(cardInput) {
    if (!isValidCardInput(cardInput)) {
        console.error(
            "Card could not be added because its input is invalid."
        );

        return {
            success: false,
            card: null,
            error: "Invalid card input."
        };
    }

    const storageData = readCardStorage();

    const newCard =
        createStoredCard(cardInput);

    storageData.cards.push(newCard);

    const wasSaved =
        writeCardStorage(storageData);

    if (!wasSaved) {
        return {
            success: false,
            card: null,
            error: "Card storage failed."
        };
    }

    return {
        success: true,
        card: newCard,
        error: null
    };
}

function updateCard(cardId, changes) {
    if (!isNonEmptyString(cardId)) {
        return {
            success: false,
            card: null,
            error: "Invalid card ID."
        };
    }

    if (
        changes === null ||
        typeof changes !== "object" ||
        Array.isArray(changes)
    ) {
        return {
            success: false,
            card: null,
            error: "Invalid card changes."
        };
    }

    const hasEditableChange =
        EDITABLE_CARD_FIELDS.some(
            (fieldName) =>
                changes[fieldName] !== undefined
        );

    if (!hasEditableChange) {
        return {
            success: false,
            card: null,
            error: "No editable changes were provided."
        };
    }

    const storageData = readCardStorage();

    const cardIndex = storageData.cards.findIndex(
        (card) => card.id === cardId
    );

    if (cardIndex === -1) {
        return {
            success: false,
            card: null,
            error: "Card not found."
        };
    }

    const currentCard =
        storageData.cards[cardIndex];

    const updatedCard = {
        ...currentCard
    };

    EDITABLE_CARD_FIELDS.forEach(
        (fieldName) => {
            if (
                changes[fieldName] !== undefined
            ) {
                updatedCard[fieldName] =
                    changes[fieldName];
            }
        }
    );

    if (!isValidCardInput(updatedCard)) {
        return {
            success: false,
            card: null,
            error: "Updated card data is invalid."
        };
    }

    updatedCard.word =
        updatedCard.word.trim();

    updatedCard.meaning =
        updatedCard.meaning.trim();

    updatedCard.example =
        updatedCard.example.trim();

    updatedCard.deck_id =
        updatedCard.deck_id.trim();

    if (
        typeof updatedCard.dictionary_entry_id ===
        "string"
    ) {
        updatedCard.dictionary_entry_id =
            updatedCard.dictionary_entry_id.trim();
    }

    if (
        typeof updatedCard.source_id === "string"
    ) {
        updatedCard.source_id =
            updatedCard.source_id.trim();
    }

    updatedCard.updated_at =
        new Date().toISOString();

    storageData.cards[cardIndex] =
        updatedCard;

    const wasSaved =
        writeCardStorage(storageData);

    if (!wasSaved) {
        return {
            success: false,
            card: null,
            error: "Card update could not be saved."
        };
    }

    return {
        success: true,
        card: updatedCard,
        error: null
    };
}

function deleteCard(cardId) {
    if (!isNonEmptyString(cardId)) {
        console.error(
            "Card could not be deleted because its ID is invalid."
        );

        return {
            success: false,
            card: null,
            error: "Invalid card ID."
        };
    }

    const storageData = readCardStorage();

    const cardIndex = storageData.cards.findIndex(
        (card) => card.id === cardId
    );

    if (cardIndex === -1) {
        return {
            success: false,
            card: null,
            error: "Card not found."
        };
    }

    const deletedCards =
        storageData.cards.splice(cardIndex, 1);

    const deletedCard = deletedCards[0];

    const wasSaved =
        writeCardStorage(storageData);

    if (!wasSaved) {
        return {
            success: false,
            card: null,
            error: "Card deletion could not be saved."
        };
    }

    return {
        success: true,
        card: deletedCard,
        error: null
    };
}

window.poofStorage = {
    getCards,
    getCardById,
    addCard,
    updateCard,
    deleteCard
};
