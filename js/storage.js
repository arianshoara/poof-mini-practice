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

function getCards() {
    const storageData = readCardStorage();

    return [...storageData.cards];
}

window.poofStorage = {
    getCards
};
