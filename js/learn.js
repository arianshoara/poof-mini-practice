const lessonList = document.getElementById("lesson-list");

const testState =
    new URLSearchParams(window.location.search).get("state");

function showMessage(message, state) {
    const messageElement = document.createElement("p");

    messageElement.id = "lesson-status";
    messageElement.className =
        `lesson-message lesson-message--${state}`;

    messageElement.textContent = message;

    lessonList.replaceChildren(messageElement);
}

function createLessonCard(lesson) {
    const card = document.createElement("article");
    card.className = "lesson-card";
    card.dataset.lessonId = lesson.id;

    const header = document.createElement("div");
    header.className = "lesson-card__header";

    const number = document.createElement("span");
    number.className = "lesson-card__number";
    number.textContent = `Lesson ${lesson.order}`;

    const level = document.createElement("span");
    level.className = "lesson-card__level";
    level.textContent = lesson.level;

    const title = document.createElement("h3");
    title.className = "lesson-card__title";
    title.textContent = lesson.title;

    const description = document.createElement("p");
    description.className = "lesson-card__description";
    description.textContent = lesson.description;

    const footer = document.createElement("div");
    footer.className = "lesson-card__footer";

    const duration = document.createElement("span");
    duration.textContent = `${lesson.estimated_minutes} min`;

    const status = document.createElement("span");
    status.className = "lesson-card__status";

    if (lesson.status === "available") {
        status.textContent = "Available";
        status.classList.add("is-available");
    } else {
        status.textContent = "Coming soon";
        status.classList.add("is-coming-soon");
    }

    header.append(number, level);
    footer.append(duration, status);

    card.append(
        header,
        title,
        description,
        footer
    );

    return card;
}

function renderLessons(lessons) {
    if (lessons.length === 0) {
        showMessage("No lessons are available yet.");
        "empty"
        return;
    }

    const lessonFragment = document.createDocumentFragment();

    const sortedLessons = [...lessons].sort(
        (firstLesson, secondLesson) =>
            firstLesson.order - secondLesson.order
    );

    sortedLessons.forEach((lesson) => {
        const lessonCard = createLessonCard(lesson);
        lessonFragment.append(lessonCard);
    });

    lessonList.replaceChildren(lessonFragment);
}

async function loadLessons() {
    try {
        if (testState === "loading") {
            return;
        }

        if (testState === "empty") {
            renderLessons([]);
            return;
        }

        const lessonDataPath =
            testState === "error"
                ? "data/missing-lessons.json"
                : "data/lessons.json";

        const response = await fetch(lessonDataPath);

        if (!response.ok) {
            throw new Error(HTTP error: ${response.status});
        }

        const lessons = await response.json();

        if (!Array.isArray(lessons)) {
            throw new Error("Lesson data must be an array.");
        }

        renderLessons(lessons);
    } catch (error) {
        showMessage(
            "Lessons could not be loaded.",
            "error"
        );

        console.error("Failed to load lessons:", error);
    }
}

loadLessons();
