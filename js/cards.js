const cardCountElement =
    document.getElementById("card-count");

const addSampleCardButton =
    document.getElementById("add-sample-card");

const deleteSampleCardButton =
    document.getElementById(
        "delete-sample-card"
    );

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

function updateSampleCardButtons() {
    const sampleCard = getSampleCard();

    if (sampleCard) {
        addSampleCardButton.disabled = true;
        addSampleCardButton.textContent =
            "Sample card saved";

        deleteSampleCardButton.disabled = false;

        return;
    }

    addSampleCardButton.disabled = false;
    addSampleCardButton.textContent =
        "Save sample card";

    deleteSampleCardButton.disabled = true;
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
    updateSampleCardButtons();
}

function handleDeleteSampleCard() {
    const sampleCard = getSampleCard();

    if (!sampleCard) {
        cardStorageResult.textContent =
            "The sample card was not found.";

        updateSampleCardButtons();

        return;
    }

    const result =
        poofStorage.deleteCard(sampleCard.id);

    if (!result.success) {
        cardStorageResult.textContent =
            "The sample card could not be deleted.";

        return;
    }

    cardStorageResult.textContent =
        "The sample card was deleted successfully.";

    renderCardCount();
    updateSampleCardButtons();
}

addSampleCardButton.addEventListener(
    "click",
    handleAddSampleCard
);

deleteSampleCardButton.addEventListener(
    "click",
    handleDeleteSampleCard
);


renderCardCount();
updateSampleCardButtons();
