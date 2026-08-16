const savedCardsCount =
    document.getElementById("saved-cards-count");

const savedCardList =
    document.getElementById("saved-card-list");

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

    const cardFragment =
        document.createDocumentFragment();

    cards.forEach((card) => {
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
        const cards = getStoredCards();

        const selectedCard =
            cards.find(
                (card) =>
                    card.id === cardId
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

    if (action !== "delete-card") {
        return;
    }

    const shouldDelete =
        window.confirm(
            "Are you sure you want to delete this card?"
        );

    if (!shouldDelete) {
        return;
    }

    const result =
        window.poofStorage.deleteCard(
            cardId
        );

    if (!result.success) {
        window.alert(
            result.error ||
                "The card could not be deleted."
        );

        return;
    }

    window.dispatchEvent(
        new CustomEvent(
            "poof:cards-changed"
        )
    );
}

savedCardList.addEventListener(
    "click",
    handleSavedCardListClick
);

window.addEventListener(
    "poof:cards-changed",
    renderSavedCards
);

renderSavedCards();
