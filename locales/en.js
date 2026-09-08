(function registerEnglishLocale() {
    "use strict";

    const existingRegistry =
        window.POOF_LOCALES;

    const localeRegistry =
        existingRegistry &&
        typeof existingRegistry === "object" &&
        !Array.isArray(existingRegistry)
            ? existingRegistry
            : {};

    window.POOF_LOCALES =
        localeRegistry;

    window.POOF_LOCALES.en =
        Object.freeze({
            "app.name":
                "POOF Mini Practice",

            "nav.home":
                "Home",

            "nav.learn":
                "Learn",

            "nav.library":
                "Library",

            "nav.cards":
                "Cards",

            "nav.account":
                "Account",

            "cards.search.label":
                "Search saved cards",

            "cards.search.placeholder":
                "Search by word, meaning or example..."
        });
})();
