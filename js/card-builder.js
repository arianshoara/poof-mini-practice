const cardBuilderForm =
    document.getElementById("card-builder-form");

const cardBuilderMessage =
    document.getElementById("card-builder-message");

const cardBuilderSubmit =
    cardBuilderForm.querySelector(
        ".card-builder__submit"
    );

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

    const result =
        window.poofStorage.addCard(cardInput);

    cardBuilderSubmit.disabled = false;

    if (!result.success) {
        showCardBuilderMessage(
            result.error ||
                "The card could not be saved.",
            "error"
        );

        return;
    }

    cardBuilderForm.reset();

    showCardBuilderMessage(
        "The card was saved successfully.",
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
