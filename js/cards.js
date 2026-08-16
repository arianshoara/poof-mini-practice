const cardCountElement =
    document.getElementById("card-count");

const addSampleCardButton =
    document.getElementById("add-sample-card");

const cardStorageResult =
    document.getElementById(
        "card-storage-result"
    );

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

function getSampleCard() {
    const cards = poofStorage.getCards();

    return cards.find(
        (card) =>
            card.source_id ===
            "storage_test_card"
    );
}

function updateSampleCardButton() {
    const sampleCard = getSampleCard();

    if (sampleCard) {
        addSampleCardButton.disabled = true;
        addSampleCardButton.textContent =
            "Sample card saved";

        return;
    }

    addSampleCardButton.disabled = false;
    addSampleCardButton.textContent =
        "Save sample card";
}

function handleAddSampleCard() {
    const result = poofStorage.addCard({
        word: "Schule",
        meaning: "مدرسه",
        example:
            "Heute gehe ich zur Schule.",
        deck_id: "default",
        dictionary_entry_id: null,
        source_type: "manual",
        source_id: "storage_test_card",
        source_text:
            "Heute gehe ich zur Schule."
    });

    if (!result.success) {
        cardStorageResult.textContent =
            "The sample card could not be saved.";

        return;
    }

    cardStorageResult.textContent =
        "The sample card was saved successfully.";

    renderCardCount();
    updateSampleCardButton();
}

addSampleCardButton.addEventListener(
    "click",
    handleAddSampleCard
);

renderCardCount();
updateSampleCardButton();
