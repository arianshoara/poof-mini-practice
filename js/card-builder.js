const cardBuilderForm =
    document.getElementById("card-builder-form");

const cardBuilderMessage =
    document.getElementById("card-builder-message");

const cardBuilderSubmit =
    cardBuilderForm.querySelector(
        ".card-builder__submit"
    );

const cardBuilderTitle =
    document.getElementById(
        "card-builder-title"
    );

const cardBuilderCancel =
    document.getElementById(
        "card-builder-cancel"
    );

let editingCardId = null;

function showCardBuilderMessage(message, state) {
    cardBuilderMessage.textContent = message;
    cardBuilderMessage.className =
        "card-builder__message";

    if (state) {
        cardBuilderMessage.classList.add(
            "is-" + state
        );
    }
}

function getFormValue(formData, fieldName) {
    const value = formData.get(fieldName);

    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
}

function createCardInput(form) {
    const formData = new FormData(form);

    return {
        dictionary_entry_id: null,
        word: getFormValue(formData, "word"),
        meaning: getFormValue(formData, "meaning"),
        example: getFormValue(formData, "example"),
        deck_id: getFormValue(formData, "deck_id"),
        source_type: "manual",
        source_id: null,
        source_text: null
    };
}

function setFormFieldValue(fieldName, value) {
    const field =
        cardBuilderForm.elements.namedItem(
            fieldName
        );

    if (!field) {
        return;
    }

    field.value = value || "";
}

function resetCardBuilderMode() {
    editingCardId = null;

    cardBuilderForm.reset();

    cardBuilderTitle.textContent =
        "Create a card";

    cardBuilderSubmit.textContent =
        "Save card";

    cardBuilderCancel.hidden = true;
}

function startEditingCard(event) {
    const card = event.detail.card;

    if (!card) {
        return;
    }

    editingCardId = card.id;

    setFormFieldValue(
        "word",
        card.word
    );

    setFormFieldValue(
        "meaning",
        card.meaning
    );

    setFormFieldValue(
        "example",
        card.example
    );

    setFormFieldValue(
        "deck_id",
        card.deck_id
    );

    cardBuilderTitle.textContent =
        "Edit card";

    cardBuilderSubmit.textContent =
        "Save changes";

    cardBuilderCancel.hidden = false;

    showCardBuilderMessage(
        "You are editing " + card.word + ".",
        null
    );

    cardBuilderForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    document
        .getElementById("card-word")
        .focus();
}

function cancelCardEditing() {
    resetCardBuilderMode();

    showCardBuilderMessage(
        "Editing was cancelled.",
        null
    );
}

function handleCardBuilderSubmit(event) {
    event.preventDefault();

    showCardBuilderMessage("", null);

    if (!cardBuilderForm.checkValidity()) {
        cardBuilderForm.reportValidity();
        return;
    }

    const cardInput =
        createCardInput(cardBuilderForm);

    cardBuilderSubmit.disabled = true;

    let result;

    if (editingCardId) {
        result =
            window.poofStorage.updateCard(
                editingCardId,
                {
                    word: cardInput.word,
                    meaning: cardInput.meaning,
                    example: cardInput.example,
                    deck_id: cardInput.deck_id
                }
            );
    } else {
        result =
            window.poofStorage.addCard(
                cardInput
            );
    }

    cardBuilderSubmit.disabled = false;

    if (!result.success) {
        showCardBuilderMessage(
            result.error ||
                "The card could not be saved.",
            "error"
        );

        return;
    }

    const wasEditing =
        editingCardId !== null;

    resetCardBuilderMode();

    showCardBuilderMessage(
        wasEditing
            ? "The card was updated successfully."
            : "The card was saved successfully.",
        "success"
    );

    window.dispatchEvent(
        new CustomEvent("poof:cards-changed")
    );

    document
        .getElementById("card-word")
        .focus();
}

cardBuilderForm.addEventListener(
    "submit",
    handleCardBuilderSubmit
);

window.addEventListener(
    "poof:edit-card",
    startEditingCard
);

cardBuilderCancel.addEventListener(
    "click",
    cancelCardEditing
);
