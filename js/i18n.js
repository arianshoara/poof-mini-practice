(function initializePoofI18n() {
    "use strict";

    const SUPPORTED_UI_LANGUAGES =
        Object.freeze([
            "fa",
            "de",
            "en"
        ]);

    const DEFAULT_UI_LANGUAGE =
        "en";

    const FALLBACK_UI_LANGUAGE =
        "en";

    const UI_LANGUAGE_STORAGE_KEY =
        "poof-ui-language";

    const EMERGENCY_TRANSLATION =
        "Translation unavailable";

    function isPlainObject(value) {
        return (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value)
        );
    }

    function isValidUiLanguage(
        language
    ) {
        return (
            typeof language === "string" &&
            SUPPORTED_UI_LANGUAGES.includes(
                language
            )
        );
    }

    function readSavedUiLanguage() {
        try {
            const savedLanguage =
                window.localStorage.getItem(
                    UI_LANGUAGE_STORAGE_KEY
                );

            if (
                isValidUiLanguage(
                    savedLanguage
                )
            ) {
                return savedLanguage;
            }
        } catch (error) {
            console.warn(
                "POOF i18n could not read the saved UI language.",
                error
            );
        }

        return DEFAULT_UI_LANGUAGE;
    }

    let activeUiLanguage =
        readSavedUiLanguage();

        function getUiLanguage() {
        return activeUiLanguage;
    }

    function saveUiLanguage(
        language
    ) {
        try {
            window.localStorage.setItem(
                UI_LANGUAGE_STORAGE_KEY,
                language
            );

            return true;
        } catch (error) {
            console.warn(
                "POOF i18n could not save the UI language.",
                error
            );

            return false;
        }
    }

    function setUiLanguage(
        language
    ) {
        if (
            !isValidUiLanguage(
                language
            )
        ) {
            console.warn(
                "POOF i18n rejected unsupported UI language:",
                language
            );

            return false;
        }

        activeUiLanguage =
            language;

        saveUiLanguage(
            language
        );

        return true;
    }

    function getLocaleMessages(
        language
    ) {
        const registry =
            window.POOF_LOCALES;

        if (!isPlainObject(registry)) {
            return null;
        }

        const messages =
            registry[language];

        if (!isPlainObject(messages)) {
            return null;
        }

        return messages;
    }

    function isUsableTranslation(
        value
    ) {
        return (
            typeof value === "string" &&
            value.length > 0
        );
    }

    function interpolateTranslation(
        message,
        variables
    ) {
        if (!isPlainObject(variables)) {
            return message;
        }

        return message.replace(
            /\{([a-zA-Z0-9_]+)\}/g,
            function (
                placeholder,
                variableName
            ) {
                if (
                    !Object.prototype
                        .hasOwnProperty.call(
                            variables,
                            variableName
                        )
                ) {
                    return placeholder;
                }

                return String(
                    variables[
                        variableName
                    ]
                );
            }
        );
    }

    function t(key, variables) {
        if (
            typeof key !== "string" ||
            key.length === 0
        ) {
            console.error(
                "POOF i18n received an invalid translation key."
            );

            return EMERGENCY_TRANSLATION;
        }

        const activeMessages =
            getLocaleMessages(
                activeUiLanguage
            );

        const activeTranslation =
            activeMessages
                ? activeMessages[key]
                : undefined;

        if (
            isUsableTranslation(
                activeTranslation
            )
        ) {
            return interpolateTranslation(
                activeTranslation,
                variables
            );
        }

        if (
            activeUiLanguage !==
            FALLBACK_UI_LANGUAGE
        ) {
            console.warn(
                `POOF i18n missing translation in "${activeUiLanguage}":`,
                key
            );
        }

        const fallbackMessages =
            getLocaleMessages(
                FALLBACK_UI_LANGUAGE
            );

        const fallbackTranslation =
            fallbackMessages
                ? fallbackMessages[key]
                : undefined;

        if (
            isUsableTranslation(
                fallbackTranslation
            )
        ) {
            return interpolateTranslation(
                fallbackTranslation,
                variables
            );
        }

        console.error(
            "POOF i18n could not resolve translation:",
            key
        );

        return EMERGENCY_TRANSLATION;
    }

        window.poofI18n =
        Object.freeze({
            getUiLanguage,
            setUiLanguage,
            isValidUiLanguage,
            t
        });
})();
