const navigation = document.querySelector("#main-navigation");

navigation.innerHTML = `
    <ul>
        <li>
            <a
                href="account.html"
                data-i18n="nav.account"
            >
                Account
            </a>
        </li>

        <li>
            <a
                href="learn.html"
                data-i18n="nav.learn"
            >
                Learn
            </a>
        </li>

        <li>
            <a
                href="index.html"
                data-i18n="nav.home"
            >
                Home
            </a>
        </li>

        <li>
            <a
                href="cards.html"
                data-i18n="nav.cards"
            >
                Cards
            </a>
        </li>

        <li>
            <a
                href="library.html"
                data-i18n="nav.library"
            >
                Library
            </a>
        </li>
    </ul>
`;

window.poofI18n.applyTranslations();

const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

const navigationLinks = navigation.querySelectorAll("a");

navigationLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
        link.classList.add("active");
    }
});

let lastScrollPosition = Math.max(window.scrollY, 0);

const navigationHidePoint = 120;
const minimumScrollDifference = 8;

function showNavigation() {
    navigation.classList.remove("navigation-hidden");
}

function hideNavigation() {
    navigation.classList.add("navigation-hidden");
}

window.addEventListener(
    "scroll",
    function () {
        const currentScrollPosition =
            Math.max(window.scrollY, 0);

        const scrollDifference =
            currentScrollPosition - lastScrollPosition;

        if (currentScrollPosition <= 40) {
            showNavigation();
            lastScrollPosition = currentScrollPosition;
            return;
        }

        if (
            Math.abs(scrollDifference) <
            minimumScrollDifference
        ) {
            return;
        }

        if (
            scrollDifference > 0 &&
            currentScrollPosition > navigationHidePoint
        ) {
            hideNavigation();
        }

        if (scrollDifference < 0) {
            showNavigation();
        }

        lastScrollPosition = currentScrollPosition;
    },
    {
        passive: true
    }
);
