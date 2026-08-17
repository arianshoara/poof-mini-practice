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

let pendingDeleteCardId = null;
let savedCardSearchQuery = "";
let savedCardSortMode = "newest";



function getStoredCards() {
    const result =
        window.poofStorage.getCards();

    if (Array.isArray(result)) {
        return result;
    }

    if (
        result &&
        Array.isArray(result.cards)
    ) {
        return result.cards;
    }

    return [];
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
        return sortedCards;
    }

    if (sortMode === "alphabetical") {
        return sortedCards.sort(
            (firstCard, secondCard) =>
                String(firstCard.word || "")
                    .localeCompare(
                        String(
                            secondCard.word || ""
                        ),
                        "de",
                        {
                            sensitivity: "base"
                        }
                    )
        );
    }

    return sortedCards.reverse();
}

function renderSavedCards() {
    const cards = getStoredCards();

    updateSavedCardsCount(cards);

    if (cards.length === 0) {
        const emptyMessage =
            document.createElement("p");

        emptyMessage.className =
            "saved-card-list__empty";

        emptyMessage.textContent =
            "Create your first vocabulary card.";

        savedCardList.replaceChildren(
            emptyMessage
        );

        return;
    }

    const matchingCards =
            cards.filter((card) =>
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

function handleSavedCardSort(event) {
    savedCardSortMode =
        event.target.value;

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

savedCardSearchInput.addEventListener(
    "input",
    handleSavedCardSearch
);

savedCardSortSelect.addEventListener(
    "change",
    handleSavedCardSort
);


renderSavedCards();
