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

    word.className = "saved-card__word";
    word.textContent = card.word;
    word.lang = "de";

    const meaning =
        document.createElement("p");

    meaning.className = "saved-card__meaning";
    meaning.textContent = card.meaning;
    meaning.dir = "auto";

    article.append(word, meaning);

    if (card.example) {
        const example =
            document.createElement("p");

        example.className =
            "saved-card__example";

        example.textContent = card.example;
        example.lang = "de";
        example.dir = "auto";

        article.append(example);
    }

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

        cardFragment.append(cardElement);
    });

    savedCardList.replaceChildren(
        cardFragment
    );
}

window.addEventListener(
    "poof:cards-changed",
    renderSavedCards
);

renderSavedCards();
