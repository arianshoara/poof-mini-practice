const cardCountElement =
    document.getElementById("card-count");

function createCardCountMessage(cardCount) {
    if (cardCount === 0) {
        return "No cards saved yet.";
    }

    if (cardCount === 1) {
        return "1 saved card.";
    }

    return cardCount + " saved cards.";
}

function renderCardCount() {
    const cards = poofStorage.getCards();

    cardCountElement.textContent =
        createCardCountMessage(cards.length);
}

renderCardCount();
