const lessonList = document.getElementById("lesson-list");
const lessonStatus = document.getElementById("lesson-status");

async function loadLessons() {
    try {
        const response = await fetch("data/lessons.json");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const lessons = await response.json();

        if (!Array.isArray(lessons)) {
            throw new Error("Lesson data must be an array.");
        }

        lessonStatus.textContent = `${lessons.length} lessons loaded.`;
    } catch (error) {
        lessonStatus.textContent = "Lessons could not be loaded.";
        console.error("Failed to load lessons:", error);
    }
}

loadLessons();
