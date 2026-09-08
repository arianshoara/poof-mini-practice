(function registerPersianLocale() {
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

    window.POOF_LOCALES.fa =
        Object.freeze({
            "app.name":
                "POOF Mini Practice",

            "nav.home":
                "خانه",

            "nav.learn":
                "یادگیری",

            "nav.library":
                "کتابخانه",

            "nav.cards":
                "کارت‌ها",

            "nav.account":
                "حساب"
        });
})();
