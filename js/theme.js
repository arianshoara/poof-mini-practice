const THEME_STORAGE_KEY = "poof-theme";
const DEFAULT_THEME = "snowy";

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
}

const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
const initialTheme = savedTheme || DEFAULT_THEME;

applyTheme(initialTheme);

document.addEventListener("DOMContentLoaded", function () {
    const themeButton = document.querySelector("#theme-toggle");
    const themeStatus = document.querySelector("#theme-status");

    if (!themeButton || !themeStatus) {
        return;
    }

    function updateThemeControls() {
        const currentTheme = document.documentElement.dataset.theme;
        const isSnowy = currentTheme === "snowy";

        themeStatus.textContent =
            `Current theme: ${isSnowy ? "Snowy" : "Classic"}`;

        themeButton.textContent =
            `Switch to ${isSnowy ? "Classic" : "Snowy"}`;
    }

    updateThemeControls();

    themeButton.addEventListener("click", function () {
        const currentTheme = document.documentElement.dataset.theme;

        const nextTheme =
            currentTheme === "snowy" ? "classic" : "snowy";

        applyTheme(nextTheme);
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        updateThemeControls();
    });
});
