const navigation = document.querySelector("#main-navigation");

navigation.innerHTML = `
    <ul>
        <li><a href="account.html">Account</a></li>
        <li><a href="library.html">Library</a></li>
        <li><a href="index.html">Home</a></li>
        <li><a href="cards.html">Cards</a></li>
        <li><a href="learn.html">Learn</a></li>
    </ul>
`;

const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

const navigationLinks = navigation.querySelectorAll("a");

navigationLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
        link.classList.add("active");
    }
});
