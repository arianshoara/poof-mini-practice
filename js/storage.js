const CARD_STORAGE_KEY =
    "poof-mini-card-storage";

const CARD_STORAGE_BACKUP_KEY =
    "poof-mini-card-storage-backup";

const CURRENT_CARD_SCHEMA_VERSION = 2;

const DEFAULT_DECK_ID = "default";
const DEFAULT_DECK_NAME = "Default Deck";
const MAX_DECK_NAME_LENGTH = 80;

const CARD_STORAGE_MIGRATIONS = {};

const CARD_STORAGE_READ_STATUS = {
    OK: "ok",
    EMPTY: "empty",
    INVALID_JSON: "invalid_json",
    INVALID_VERSION: "invalid_version",
    FUTURE_VERSION: "future_version",
    MIGRATION_FAILED: "migration_failed",
    INVALID_STRUCTURE: "invalid_structure"
};

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

function createDefaultDeck(
    timestamp =
        new Date().toISOString()
) {
    return {
        id: DEFAULT_DECK_ID,
        name: DEFAULT_DECK_NAME,
        is_default: true,
        created_at: timestamp,
        updated_at: timestamp
    };
}

function createEmptyCardStorage(
    schemaVersion =
        CURRENT_CARD_SCHEMA_VERSION
) {
    const storageData = {
        schema_version: schemaVersion,
        cards: []
    };

    if (schemaVersion === 2) {
        storageData.decks = [
            createDefaultDeck()
        ];
    }

    return storageData;
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

function isValidIsoDate(value) {
    if (typeof value !== "string") {
        return false;
    }

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return false;
    }

    return parsedDate.toISOString() === value;
}

function isValidStoredDeck(deck) {
    if (
        deck === null ||
        typeof deck !== "object" ||
        Array.isArray(deck)
    ) {
        return false;
    }

    if (
        typeof deck.name !== "string"
    ) {
        return false;
    }

    const trimmedName =
        deck.name.trim();

    const hasValidName =
        trimmedName !== "" &&
        deck.name === trimmedName &&
        Array.from(trimmedName).length <=
            MAX_DECK_NAME_LENGTH;

    const hasValidDates =
        isValidIsoDate(
            deck.created_at
        ) &&
        isValidIsoDate(
            deck.updated_at
        );

    if (!hasValidDates) {
        return false;
    }

    const creationTime =
        new Date(
            deck.created_at
        ).getTime();

    const updateTime =
        new Date(
            deck.updated_at
        ).getTime();

    return (
        isNonEmptyString(deck.id) &&
        hasValidName &&
        typeof deck.is_default ===
            "boolean" &&
        updateTime >= creationTime
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

function isValidStoredCard(card) {
    if (
        card === null ||
        typeof card !== "object" ||
        Array.isArray(card)
    ) {
        return false;
    }

    const hasValidDictionaryReference =
        card.dictionary_entry_id === null ||
        isNonEmptyString(
            card.dictionary_entry_id
        );

    const hasValidSourceId =
        card.source_id === null ||
        isNonEmptyString(card.source_id);

    const hasValidSourceText =
        card.source_text === null ||
        typeof card.source_text === "string";

    const hasValidSourceType =
        ALLOWED_CARD_SOURCE_TYPES.includes(
            card.source_type
        );

    const hasValidDates =
        isValidIsoDate(card.created_at) &&
        isValidIsoDate(card.updated_at);

    if (!hasValidDates) {
        return false;
    }

    const creationTime =
        new Date(card.created_at).getTime();

    const updateTime =
        new Date(card.updated_at).getTime();

    return (
        isNonEmptyString(card.id) &&
        hasValidDictionaryReference &&
        isNonEmptyString(card.word) &&
        isNonEmptyString(card.meaning) &&
        typeof card.example === "string" &&
        isNonEmptyString(card.deck_id) &&
        hasValidSourceType &&
        hasValidSourceId &&
        hasValidSourceText &&
        updateTime >= creationTime
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

function isValidCardStorage(
    storageData,
    expectedSchemaVersion =
        CURRENT_CARD_SCHEMA_VERSION
) {
    if (
        storageData === null ||
        typeof storageData !== "object" ||
        Array.isArray(storageData)
    ) {
        return false;
    }

    if (
        storageData.schema_version !==
        expectedSchemaVersion
    ) {
        return false;
    }

    if (
        !Array.isArray(
            storageData.cards
        )
    ) {
        return false;
    }

    const allCardsAreValid =
        storageData.cards.every(
            (card) =>
                isValidStoredCard(card)
        );

    if (!allCardsAreValid) {
        return false;
    }

    const cardIds =
        storageData.cards.map(
            (card) => card.id
        );

    const uniqueCardIds =
        new Set(cardIds);

    if (
        uniqueCardIds.size !==
        cardIds.length
    ) {
        return false;
    }

    if (
        expectedSchemaVersion === 1
    ) {
        return true;
    }

    if (
        expectedSchemaVersion !== 2
    ) {
        return false;
    }

    if (
        !Array.isArray(
            storageData.decks
        )
    ) {
        return false;
    }

    const allDecksAreValid =
        storageData.decks.every(
            (deck) =>
                isValidStoredDeck(deck)
        );

    if (!allDecksAreValid) {
        return false;
    }

    const deckIds =
        storageData.decks.map(
            (deck) => deck.id
        );

    const uniqueDeckIds =
        new Set(deckIds);

    if (
        uniqueDeckIds.size !==
        deckIds.length
    ) {
        return false;
    }

    const defaultDecks =
        storageData.decks.filter(
            (deck) =>
                deck.is_default === true
        );

    if (
        defaultDecks.length !== 1 ||
        defaultDecks[0].id !==
            DEFAULT_DECK_ID
    ) {
        return false;
    }

    const everyCardHasDeck =
        storageData.cards.every(
            (card) =>
                uniqueDeckIds.has(
                    card.deck_id
                )
        );

    return everyCardHasDeck;
}

function readRawCardStorage() {
    return localStorage.getItem(
        CARD_STORAGE_KEY
    );
}

function writeRawCardStorage(
    storedValue
) {
    localStorage.setItem(
        CARD_STORAGE_KEY,
        storedValue
    );
}

function readRawCardStorageBackup() {
    return localStorage.getItem(
        CARD_STORAGE_BACKUP_KEY
    );
}

function writeRawCardStorageBackup(
    storedValue
) {
    localStorage.setItem(
        CARD_STORAGE_BACKUP_KEY,
        storedValue
    );
}

function createCardStorageBackup() {
    const storedValue =
        readRawCardStorage();

    if (storedValue === null) {
        return {
            success: true,
            backupCreated: false,
            error: null
        };
    }

    try {
        writeRawCardStorageBackup(
            storedValue
        );

        return {
            success: true,
            backupCreated: true,
            error: null
        };
    } catch (error) {
        console.error(
            "Failed to create card storage backup:",
            error
        );

        return {
            success: false,
            backupCreated: false,
            error:
                "Card storage backup could not be created."
        };
    }
}

function parseCardStorage(storedValue) {
    return JSON.parse(storedValue);
}

function getCardStorageSchemaVersion(storageData) {
    if (
        storageData === null ||
        typeof storageData !== "object" ||
        Array.isArray(storageData)
    ) {
        return null;
    }

    const schemaVersion =
        storageData.schema_version;

    if (
        !Number.isInteger(schemaVersion) ||
        schemaVersion < 1
    ) {
        return null;
    }

    return schemaVersion;
}

function createLegacyDeckName(
    legacyDeckId
) {
    return Array.from(
        legacyDeckId.trim()
    )
        .slice(
            0,
            MAX_DECK_NAME_LENGTH
        )
        .join("");
}

function migrateCardStorageV1ToV2(
    storageData
) {
    if (
        !isValidCardStorage(
            storageData,
            1
        )
    ) {
        throw new Error(
            "Schema version 1 storage is invalid."
        );
    }

    const migrationTime =
        new Date().toISOString();

    const decks = [
        createDefaultDeck(
            migrationTime
        )
    ];

    const seenDeckIds =
        new Set([
            DEFAULT_DECK_ID
        ]);

    storageData.cards.forEach(
        (card) => {
            if (
                seenDeckIds.has(
                    card.deck_id
                )
            ) {
                return;
            }

            seenDeckIds.add(
                card.deck_id
            );

            decks.push({
                id: card.deck_id,
                name:
                    createLegacyDeckName(
                        card.deck_id
                    ),
                is_default: false,
                created_at:
                    migrationTime,
                updated_at:
                    migrationTime
            });
        }
    );

    const migratedStorage = {
        schema_version: 2,
        cards: storageData.cards,
        decks
    };

    if (
        !isValidCardStorage(
            migratedStorage,
            2
        )
    ) {
        throw new Error(
            "Migrated schema version 2 storage is invalid."
        );
    }

    return migratedStorage;
}

CARD_STORAGE_MIGRATIONS[1] =
    migrateCardStorageV1ToV2;

function migrateCardStorage(
    storageData,
    fromVersion,
    targetVersion = CURRENT_CARD_SCHEMA_VERSION
) {
    if (
        !Number.isInteger(fromVersion) ||
        !Number.isInteger(targetVersion) ||
        fromVersion < 1 ||
        targetVersion < fromVersion
    ) {
        return {
            success: false,
            storage: null,
            error:
                "Invalid card storage migration range."
        };
    }

    let migratedStorage;

    try {
        migratedStorage =
            JSON.parse(
                JSON.stringify(storageData)
            );
    } catch (error) {
        return {
            success: false,
            storage: null,
            error:
                "Card storage could not be cloned for migration."
        };
    }

    let currentVersion =
        fromVersion;

    while (
        currentVersion <
        targetVersion
    ) {
        const migration =
            CARD_STORAGE_MIGRATIONS[
                currentVersion
            ];

        if (
            typeof migration !==
            "function"
        ) {
            return {
                success: false,
                storage: null,
                error:
                    "Missing card storage migration from version " +
                    currentVersion +
                    "."
            };
        }

        try {
            migratedStorage =
                migration(
                    migratedStorage
                );
        } catch (error) {
            console.error(
                "Card storage migration failed:",
                error
            );

            return {
                success: false,
                storage: null,
                error:
                    "Card storage migration failed."
            };
        }

        const expectedNextVersion =
            currentVersion + 1;

        if (
            migratedStorage === null ||
            typeof migratedStorage !==
                "object" ||
            Array.isArray(
                migratedStorage
            ) ||
            migratedStorage.schema_version !==
                expectedNextVersion
        ) {
            return {
                success: false,
                storage: null,
                error:
                    "Card storage migration returned an invalid next version."
            };
        }

        currentVersion =
            expectedNextVersion;
    }

    return {
        success: true,
        storage: migratedStorage,
        error: null
    };
}

function readCardStorageResult(
    targetVersion =
        CURRENT_CARD_SCHEMA_VERSION,
    storedValueOverride = undefined
) {
    const storedValue =
        storedValueOverride === undefined
            ? readRawCardStorage()
            : storedValueOverride;

    if (storedValue === null) {
        return {
            status:
                CARD_STORAGE_READ_STATUS.EMPTY,
            storage:
                createEmptyCardStorage(
                    targetVersion
                ),
            error: null
        };
    }

    let parsedValue;

    try {
        parsedValue =
            parseCardStorage(storedValue);
    } catch (error) {
        console.error(
            "Failed to parse card storage:",
            error
        );

        return {
            status:
                CARD_STORAGE_READ_STATUS.INVALID_JSON,
            storage: null,
            error
        };
    }

    const schemaVersion =
        getCardStorageSchemaVersion(
            parsedValue
        );

    if (schemaVersion === null) {
        console.error(
            "Card storage schema version is missing or invalid."
        );

        return {
            status:
                CARD_STORAGE_READ_STATUS.INVALID_VERSION,
            storage: null,
            error:
                "Card storage schema version is missing or invalid."
        };
    }

    if (
        schemaVersion >
        targetVersion
    ) {
        console.error(
            "Card storage uses a future schema version:",
            schemaVersion
        );

        return {
            status:
                CARD_STORAGE_READ_STATUS.FUTURE_VERSION,
            storage: null,
            error:
                "Card storage uses a future schema version."
        };
    }

    let storageToValidate =
        parsedValue;

    if (
        schemaVersion <
        targetVersion
    ) {
        const migrationResult =
            migrateCardStorage(
                parsedValue,
                schemaVersion,
                targetVersion
            );

        if (!migrationResult.success) {
            console.error(
                "Card storage could not be migrated:",
                migrationResult.error
            );

            return {
                status:
                    CARD_STORAGE_READ_STATUS.MIGRATION_FAILED,
                storage: null,
                error:
                    migrationResult.error
            };
        }

        storageToValidate =
            migrationResult.storage;
    }

    if (
        !isValidCardStorage(
            storageToValidate,
            targetVersion
        )
    ) {
        console.error(
            "Invalid card storage structure."
        );

        return {
            status:
                CARD_STORAGE_READ_STATUS.INVALID_STRUCTURE,
            storage: null,
            error:
                "Invalid card storage structure."
        };
    }

    return {
        status:
            CARD_STORAGE_READ_STATUS.OK,
        storage: storageToValidate,
        error: null
    };
}

function readCardStorageBackupResult(
    targetVersion =
        CURRENT_CARD_SCHEMA_VERSION
) {
    const backupValue =
        readRawCardStorageBackup();

    if (backupValue === null) {
        return {
            available: false,
            readResult: null
        };
    }

    return {
        available: true,
        readResult:
            readCardStorageResult(
                targetVersion,
                backupValue
            )
    };
}

function getCardStorageRecoveryStatus() {
    const backupResult =
        readCardStorageBackupResult();

    if (!backupResult.available) {
        return {
            available: false,
            canRestore: false,
            status: "no_backup",
            error:
                "No card storage backup is available."
        };
    }

    const readResult =
        backupResult.readResult;

    const canRestore =
        readResult.status ===
        CARD_STORAGE_READ_STATUS.OK;

    return {
        available: true,
        canRestore,
        status: readResult.status,
        error:
            canRestore
                ? null
                : "No safe card storage backup is available."
    };
}

function restoreCardStorageFromBackup(
    options = {}
) {
    if (
        options === null ||
        typeof options !== "object" ||
        options.confirmRestore !== true
    ) {
        return {
            success: false,
            storage: null,
            error:
                "Card storage restore requires explicit confirmation."
        };
    }

    const backupResult =
        readCardStorageBackupResult();

    if (!backupResult.available) {
        return {
            success: false,
            storage: null,
            error:
                "No card storage backup is available."
        };
    }

    if (
        backupResult.readResult.status !==
        CARD_STORAGE_READ_STATUS.OK
    ) {
        return {
            success: false,
            storage: null,
            error:
                "Card storage backup is not safe to restore."
        };
    }

    const restoredStorage =
        backupResult.readResult.storage;

    let serializedValue;

    try {
        serializedValue =
            JSON.stringify(
                restoredStorage
            );
    } catch (error) {
        console.error(
            "Failed to serialize card storage recovery:",
            error
        );

        return {
            success: false,
            storage: null,
            error:
                "Card storage recovery could not be serialized."
        };
    }

    try {
        writeRawCardStorage(
            serializedValue
        );

        return {
            success: true,
            storage: restoredStorage,
            error: null
        };
    } catch (error) {
        console.error(
            "Failed to restore card storage backup:",
            error
        );

        return {
            success: false,
            storage: null,
            error:
                "Card storage backup could not be restored."
        };
    }
}

function readCardStorage() {
    const readResult =
        readCardStorageResult();

    if (
        readResult.status ===
            CARD_STORAGE_READ_STATUS.OK ||
        readResult.status ===
            CARD_STORAGE_READ_STATUS.EMPTY
    ) {
        return readResult.storage;
    }

    return null;
}

function writeCardStorage(storageData) {
    if (!isValidCardStorage(storageData)) {
        console.error(
            "Card storage cannot be written because its structure is invalid."
        );

        return false;
    }

    let serializedValue;

    try {
        serializedValue =
            JSON.stringify(storageData);
    } catch (error) {
        console.error(
            "Failed to serialize card storage:",
            error
        );

        return false;
    }

    const backupResult =
        createCardStorageBackup();

    if (!backupResult.success) {
        console.error(
            "Card storage write stopped because backup failed."
        );

        return false;
    }

    try {
        writeRawCardStorage(
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

function getCardsResult() {
    const readResult =
        readCardStorageResult();

    if (
        readResult.status ===
            CARD_STORAGE_READ_STATUS.OK ||
        readResult.status ===
            CARD_STORAGE_READ_STATUS.EMPTY
    ) {
        return {
            success: true,
            status: readResult.status,
            cards: [
                ...readResult.storage.cards
            ],
            error: null
        };
    }

    return {
        success: false,
        status: readResult.status,
        cards: [],
        error:
            typeof readResult.error ===
            "string"
                ? readResult.error
                : "Card storage could not be read safely."
    };
}

function getCards() {
    const result =
        getCardsResult();

    return result.cards;
}

function getDecksResult() {
    const readResult =
        readCardStorageResult();

    if (
        readResult.status ===
            CARD_STORAGE_READ_STATUS.OK ||
        readResult.status ===
            CARD_STORAGE_READ_STATUS.EMPTY
    ) {
        return {
            success: true,
            status: readResult.status,
            decks: [
                ...readResult.storage.decks
            ],
            error: null
        };
    }

    return {
        success: false,
        status: readResult.status,
        decks: [],
        error:
            typeof readResult.error ===
            "string"
                ? readResult.error
                : "Card storage could not be read safely."
    };
}

function getDecks() {
    const result =
        getDecksResult();

    return result.decks;
}

function getDeckById(deckId) {
    if (!isNonEmptyString(deckId)) {
        return null;
    }

    const decks = getDecks();

    const matchingDeck =
        decks.find(
            (deck) =>
                deck.id === deckId
        );

    if (matchingDeck === undefined) {
        return null;
    }

    return matchingDeck;
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

    if (storageData === null) {
            return {
                success: false,
                card: null,
                error:
                    "Card storage could not be read safely."
            };
        }

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
            if (storageData === null) {
            return {
                success: false,
                card: null,
                error:
                    "Card storage could not be read safely."
            };
        }

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
            if (storageData === null) {
            return {
                success: false,
                card: null,
                error:
                    "Card storage could not be read safely."
            };
        }

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
    getCardsResult,
    getCardById,
    getDecks,
    getDecksResult,
    getDeckById,
    addCard,
    updateCard,
    deleteCard,
    getCardStorageRecoveryStatus,
    restoreCardStorageFromBackup
};
