const savedCardsCount =
    document.getElementById("saved-cards-count");

const savedCardList =
    document.getElementById("saved-card-list");

const deleteCardDialog =
    document.getElementById(
        "delete-card-dialog"
    );

const deleteCardDialogMessage =
    document.getElementById(
        "delete-card-dialog-message"
    );

const deleteCardDialogError =
    document.getElementById(
        "delete-card-dialog-error"
    );

const cancelDeleteCardButton =
    document.getElementById(
        "cancel-delete-card"
    );

const confirmDeleteCardButton =
    document.getElementById(
        "confirm-delete-card"
    );

const savedCardSearchInput =
    document.getElementById(
        "saved-card-search-input"
    );

const savedCardSortSelect =
    document.getElementById(
        "saved-card-sort-select"
    );

const savedCardDeckFilter =
    document.getElementById(
        "saved-card-deck-filter"
    );

const SAVED_CARD_SORT_STORAGE_KEY =
    "poof-saved-card-sort";

const SAVED_CARD_DECK_STORAGE_KEY =
    "poof-active-deck-id";

const ALL_DECKS_FILTER_VALUE =
    "all";

const SAVED_CARD_SORT_MODES = [
    "newest",
    "oldest",
    "alphabetical"
];

function getSavedCardSortMode() {
    const savedSortMode =
        localStorage.getItem(
            SAVED_CARD_SORT_STORAGE_KEY
        );

    if (
        SAVED_CARD_SORT_MODES.includes(
            savedSortMode
        )
    ) {
        return savedSortMode;
    }

    return "newest";
}

function saveSavedCardSortMode(sortMode) {
    if (
        !SAVED_CARD_SORT_MODES.includes(
            sortMode
        )
    ) {
        return;
    }

    localStorage.setItem(
        SAVED_CARD_SORT_STORAGE_KEY,
        sortMode
    );
}

function getSavedCardDeckId() {
    const savedDeckId =
        localStorage.getItem(
            SAVED_CARD_DECK_STORAGE_KEY
        );

    if (
        typeof savedDeckId ===
            "string" &&
        savedDeckId !== ""
    ) {
        return savedDeckId;
    }

    return ALL_DECKS_FILTER_VALUE;
}

function saveSavedCardDeckId(
    deckId
) {
    localStorage.setItem(
        SAVED_CARD_DECK_STORAGE_KEY,
        deckId
    );
}

let savedCardSortMode =
    getSavedCardSortMode();

savedCardSortSelect.value =
    savedCardSortMode;

let savedCardDeckId =
    getSavedCardDeckId();

function renderSavedCardDeckFilter() {
    const decksResult =
        window.poofStorage
            .getDecksResult();

    savedCardDeckFilter
        .replaceChildren();

    if (!decksResult.success) {
        const unavailableOption =
            document.createElement(
                "option"
            );

        unavailableOption.value = "";
        unavailableOption.textContent =
            "Decks unavailable";

        savedCardDeckFilter.append(
            unavailableOption
        );

        savedCardDeckFilter.disabled =
            true;

        return false;
    }

    const allDecksOption =
        document.createElement(
            "option"
        );

    allDecksOption.value =
        ALL_DECKS_FILTER_VALUE;

    allDecksOption.textContent =
        "All Decks";

    savedCardDeckFilter.append(
        allDecksOption
    );

    decksResult.decks.forEach(
        (deck) => {
            const option =
                document.createElement(
                    "option"
                );

            option.value = deck.id;
            option.textContent =
                deck.name;

            savedCardDeckFilter.append(
                option
            );
        }
    );

    const savedDeckStillExists =
        savedCardDeckId ===
            ALL_DECKS_FILTER_VALUE ||
        decksResult.decks.some(
            (deck) =>
                deck.id ===
                savedCardDeckId
        );

    if (!savedDeckStillExists) {
        savedCardDeckId =
            ALL_DECKS_FILTER_VALUE;

        saveSavedCardDeckId(
            savedCardDeckId
        );
    }

    savedCardDeckFilter.value =
        savedCardDeckId;

    savedCardDeckFilter.disabled =
        false;

    return true;
}

function cardMatchesActiveDeck(
    card
) {
    if (
        savedCardDeckId ===
        ALL_DECKS_FILTER_VALUE
    ) {
        return true;
    }

    return (
        card.deck_id ===
        savedCardDeckId
    );
}

let pendingDeleteCardId = null;
let savedCardSearchQuery = "";




function getStoredCardsResult() {
    const result =
        window.poofStorage
            .getCardsResult();

    if (
        result &&
        typeof result.success ===
            "boolean" &&
        Array.isArray(result.cards)
    ) {
        return result;
    }

    return {
        success: false,
        status: "unknown_error",
        cards: [],
        error:
            "Card storage could not be read safely."
    };
}

function updateSavedCardsCount(cards) {
    if (cards.length === 0) {
        savedCardsCount.textContent =
            "No cards saved yet.";

        return;
    }

    if (cards.length === 1) {
        savedCardsCount.textContent =
            "1 saved card.";

        return;
    }

    savedCardsCount.textContent =
        cards.length + " saved cards.";
}

function createSavedCardElement(card) {
    const article =
        document.createElement("article");

    article.className = "saved-card";
    article.dataset.cardId = card.id;

    const word =
        document.createElement("h4");

    word.className =
        "saved-card__word";

    word.textContent = card.word;
    word.lang = "de";

    const meaning =
        document.createElement("p");

    meaning.className =
        "saved-card__meaning";

    meaning.textContent = card.meaning;
    meaning.dir = "auto";

    article.append(
        word,
        meaning
    );

    if (card.example) {
        const example =
            document.createElement("p");

        example.className =
            "saved-card__example";

        example.textContent =
            card.example;

        example.lang = "de";
        example.dir = "auto";

        article.append(example);
    }

    const actions =
        document.createElement("div");

    actions.className =
        "saved-card__actions";

    const editButton =
        document.createElement("button");

    editButton.type = "button";

    editButton.className =
        "saved-card__edit";

    editButton.dataset.action =
        "edit-card";

    editButton.dataset.cardId =
        card.id;

    editButton.textContent =
        "Edit";

    editButton.setAttribute(
        "aria-label",
        "Edit card " + card.word
    );

    const deleteButton =
        document.createElement("button");

    deleteButton.type = "button";

    deleteButton.className =
        "saved-card__delete";

    deleteButton.dataset.action =
        "delete-card";

    deleteButton.dataset.cardId =
        card.id;

    deleteButton.textContent =
        "Delete";

    deleteButton.setAttribute(
        "aria-label",
        "Delete card " + card.word
    );

    actions.append(
        editButton,
        deleteButton
    );

    article.append(actions);

    return article;
}

function normalizeSearchText(value) {
    return String(value || "")
        .trim()
        .toLocaleLowerCase();
}

function cardMatchesSearch(card, query) {
    if (!query) {
        return true;
    }

    const searchableText =
        normalizeSearchText(
            [
                card.word,
                card.meaning,
                card.example
            ].join(" ")
        );

    return searchableText.includes(query);
}

function sortSavedCards(cards, sortMode) {
    const sortedCards = [...cards];

    if (sortMode === "oldest") {
        return sortedCards.sort(
            (firstCard, secondCard) =>
                new Date(firstCard.created_at).getTime() -
                new Date(secondCard.created_at).getTime()
        );
    }

    if (sortMode === "alphabetical") {
        return sortedCards.sort(
            (firstCard, secondCard) =>
                String(firstCard.word || "").localeCompare(
                    String(secondCard.word || ""),
                    "de",
                    {
                        sensitivity: "base"
                    }
                )
        );
    }

    return sortedCards.sort(
        (firstCard, secondCard) =>
            new Date(secondCard.created_at).getTime() -
            new Date(firstCard.created_at).getTime()
    );
}

function createStorageErrorState() {
    const errorState =
        document.createElement("div");

    errorState.className =
        "saved-card";

    const errorMessage =
        document.createElement("p");

    errorMessage.textContent =
        "Your saved cards could not be read safely. Your stored data was not overwritten.";

    errorState.append(
        errorMessage
    );

    const recoveryStatus =
        window.poofStorage
            .getCardStorageRecoveryStatus();

    if (!recoveryStatus.canRestore) {
        const recoveryMessage =
            document.createElement("p");

        recoveryMessage.className =
            "saved-card__example";

        recoveryMessage.textContent =
            "No safe backup is currently available.";

        errorState.append(
            recoveryMessage
        );

        return errorState;
    }

    const restoreButton =
        document.createElement("button");

    restoreButton.type = "button";

    restoreButton.className =
        "saved-card__edit";

    restoreButton.dataset.action =
        "restore-card-backup";

    restoreButton.textContent =
        "Restore last backup";

    errorState.append(
        restoreButton
    );

    return errorState;
}

function renderSavedCards() {
    const result =
        getStoredCardsResult();

    if (!result.success) {
            savedCardsCount.textContent =
                "Saved cards unavailable.";
        
            savedCardSearchInput.disabled =
                true;
        
            savedCardSortSelect.disabled =
                true;
        
            savedCardList.replaceChildren(
                createStorageErrorState()
            );
        
            return;
        }

    savedCardSearchInput.disabled =
        false;

    savedCardSortSelect.disabled =
        false;

    const cards = result.cards;

        const deckCards =
            cards.filter(
                cardMatchesActiveDeck
            );
        
        updateSavedCardsCount(
            deckCards
        );
        
        if (deckCards.length === 0) {
        const emptyMessage =
            document.createElement("p");

        emptyMessage.className =
            "saved-card-list__empty";

        emptyMessage.textContent =
            cards.length === 0
                ? "Create your first vocabulary card."
                : "No cards in this deck yet.";
        savedCardList.replaceChildren(
            emptyMessage
        );

        return;
    }

    const matchingCards =
            deckCards.filter((card) =>
                cardMatchesSearch(
                    card,
                    savedCardSearchQuery
                )
            );
        
     const visibleCards =
            sortSavedCards(
                matchingCards,
                savedCardSortMode
            );

    if (visibleCards.length === 0) {
        const noResultsMessage =
            document.createElement("p");

        noResultsMessage.className =
            "saved-card-list__empty";

        noResultsMessage.textContent =
            "No cards match your search.";

        savedCardList.replaceChildren(
            noResultsMessage
        );

        return;
    }

    const cardFragment =
        document.createDocumentFragment();

    visibleCards.forEach((card) => {
        const cardElement =
            createSavedCardElement(card);

        cardFragment.append(
            cardElement
        );
    });

    savedCardList.replaceChildren(
        cardFragment
    );
}

function openDeleteCardDialog(cardId) {
    const selectedCard =
        window.poofStorage.getCardById(
            cardId
        );

    if (!selectedCard) {
        return;
    }

    pendingDeleteCardId =
        selectedCard.id;

    deleteCardDialogMessage.textContent =
        'Delete "' +
        selectedCard.word +
        '"? This action cannot be undone.';

    deleteCardDialogError.textContent =
        "";

    deleteCardDialog.showModal();

    cancelDeleteCardButton.focus();
}

function closeDeleteCardDialog() {
    deleteCardDialog.close();
}

function confirmCardDeletion() {
    if (!pendingDeleteCardId) {
        return;
    }

    confirmDeleteCardButton.disabled =
        true;

    const result =
        window.poofStorage.deleteCard(
            pendingDeleteCardId
        );

    confirmDeleteCardButton.disabled =
        false;

    if (!result.success) {
        deleteCardDialogError.textContent =
            result.error ||
            "The card could not be deleted.";

        return;
    }

    deleteCardDialog.close();

    window.dispatchEvent(
        new CustomEvent(
            "poof:cards-changed"
        )
    );
}

function resetDeleteCardDialog() {
    pendingDeleteCardId = null;

    deleteCardDialogMessage.textContent =
        "Are you sure you want to delete this card?";

    deleteCardDialogError.textContent =
        "";

    confirmDeleteCardButton.disabled =
        false;
}

function handleCardStorageRestore(
    restoreButton
) {
    if (
        restoreButton.dataset
            .confirmRestore !== "true"
    ) {
        restoreButton.dataset
            .confirmRestore = "true";

        restoreButton.textContent =
            "Confirm restore";

        const warning =
            document.createElement("p");

        warning.className =
            "saved-card__example";

        warning.dataset.recoveryWarning =
            "true";

        warning.textContent =
            "This will replace the unreadable card storage with the last validated backup. Click Confirm restore again to continue.";

        restoreButton.before(
            warning
        );

        return;
    }

    restoreButton.disabled =
        true;

    const result =
        window.poofStorage
            .restoreCardStorageFromBackup({
                confirmRestore: true
            });

    if (!result.success) {
        restoreButton.disabled =
            false;

        restoreButton.textContent =
            "Restore last backup";

        restoreButton.dataset
            .confirmRestore = "false";

        const warning =
            restoreButton.parentElement
                ?.querySelector(
                    "[data-recovery-warning]"
                );

        if (warning) {
            warning.textContent =
                result.error ||
                "The backup could not be restored.";
        }

        return;
    }

    renderSavedCards();
}

function handleSavedCardListClick(event) {
    const actionButton =
        event.target.closest(
            "[data-action]"
        );

    if (
        !actionButton ||
        !savedCardList.contains(
            actionButton
        )
    ) {
        return;
    }

    const action =
        actionButton.dataset.action;

    if (
            action ===
            "restore-card-backup"
        ) {
            handleCardStorageRestore(
                actionButton
            );
        
            return;
        }

    const cardId =
        actionButton.dataset.cardId;

    if (!cardId) {
        return;
    }

    if (action === "edit-card") {
        const selectedCard =
            window.poofStorage.getCardById(
                cardId
            );

        if (!selectedCard) {
            return;
        }

        window.dispatchEvent(
            new CustomEvent(
                "poof:edit-card",
                {
                    detail: {
                        card: selectedCard
                    }
                }
            )
        );

        return;
    }

    if (action === "delete-card") {
        openDeleteCardDialog(cardId);
    }
}

function handleSavedCardSearch(event) {
    savedCardSearchQuery =
        normalizeSearchText(
            event.target.value
        );

    renderSavedCards();
}

function handleSavedCardDeckFilter(
    event
) {
    const nextDeckId =
        event.target.value;

    const decksResult =
        window.poofStorage
            .getDecksResult();

    if (!decksResult.success) {
        return;
    }

    const isValidDeckSelection =
        nextDeckId ===
            ALL_DECKS_FILTER_VALUE ||
        decksResult.decks.some(
            (deck) =>
                deck.id ===
                nextDeckId
        );

    if (!isValidDeckSelection) {
        renderSavedCardDeckFilter();

        return;
    }

    savedCardDeckId =
        nextDeckId;

    saveSavedCardDeckId(
        savedCardDeckId
    );

    window.dispatchEvent(
            new CustomEvent(
                "poof:active-deck-changed",
                {
                    detail: {
                        deckId:
                            savedCardDeckId
                    }
                }
            )
        );

    renderSavedCards();
}

function handleSavedCardSort(event) {
    const nextSortMode =
        event.target.value;

    if (
        !SAVED_CARD_SORT_MODES.includes(
            nextSortMode
        )
    ) {
        return;
    }

    savedCardSortMode =
        nextSortMode;

    saveSavedCardSortMode(
        savedCardSortMode
    );

    renderSavedCards();
}

savedCardList.addEventListener(
    "click",
    handleSavedCardListClick
);


window.addEventListener(
    "poof:cards-changed",
    renderSavedCards
);

cancelDeleteCardButton.addEventListener(
    "click",
    closeDeleteCardDialog
);

confirmDeleteCardButton.addEventListener(
    "click",
    confirmCardDeletion
);

deleteCardDialog.addEventListener(
    "close",
    resetDeleteCardDialog
);

savedCardDeckFilter.addEventListener(
    "change",
    handleSavedCardDeckFilter
);

savedCardSearchInput.addEventListener(
    "input",
    handleSavedCardSearch
);

savedCardSortSelect.addEventListener(
    "change",
    handleSavedCardSort
);


renderSavedCardDeckFilter();
renderSavedCards();
