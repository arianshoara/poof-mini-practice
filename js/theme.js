const THEME_STORAGE_KEY = "poof-theme";
const DEFAULT_THEME = "classic";

const AVAILABLE_THEMES = [
    "classic",
    "snowy"
];

function isValidTheme(theme) {
    return AVAILABLE_THEMES.includes(theme);
}

function getSavedTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (isValidTheme(savedTheme)) {
        return savedTheme;
    }

    return DEFAULT_THEME;
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
}

function saveTheme(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function updateThemeControls(theme) {
    const themeStatus = document.querySelector("#theme-status");
    const themeButtons = document.querySelectorAll("[data-theme-value]");

    if (themeStatus) {
        const themeName =
            theme === "snowy" ? "Snowy" : "Classic";

        themeStatus.textContent = `Current theme: ${themeName}`;
    }

    themeButtons.forEach(function (button) {
        const buttonTheme = button.dataset.themeValue;
        const isSelected = buttonTheme === theme;

        button.classList.toggle("selected", isSelected);

        button.setAttribute(
            "aria-pressed",
            String(isSelected)
        );
    });
}

const initialTheme = getSavedTheme();

applyTheme(initialTheme);

document.addEventListener("DOMContentLoaded", function () {
    const themeButtons = document.querySelectorAll("[data-theme-value]");

    updateThemeControls(initialTheme);

    themeButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedTheme = button.dataset.themeValue;

            if (!isValidTheme(selectedTheme)) {
                return;
            }

            applyTheme(selectedTheme);
            saveTheme(selectedTheme);
            updateThemeControls(selectedTheme);
        });
    });
});
