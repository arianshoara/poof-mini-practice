(function registerGermanLocale() {
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

    window.POOF_LOCALES.de =
        Object.freeze({
            "app.name":
                "POOF Mini Practice",

            "nav.home":
                "Startseite",

            "nav.learn":
                "Lernen",

            "nav.library":
                "Bibliothek",

            "nav.cards":
                "Karten",

            "nav.account":
                "Konto"
        });
})();
