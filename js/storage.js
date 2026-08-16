const CARD_STORAGE_KEY =
    "poof-mini-card-storage";

const CARD_SCHEMA_VERSION = 1;

function createEmptyCardStorage() {
    return {
        schema_version: CARD_SCHEMA_VERSION,
        cards: []
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

window.poofStorage = {
    getCards
};
