// sidebar.js: Logic for managing the sidebar
import { setCookie } from "./cookies.js";
import { alphabet } from "./utils.js";

const guessedLetters = JSON.parse(getCookie("guessedLetters") || "{}");

function initializeSidebar(letterFrequencyList, updatePuzzleCallback) {
  // Initialize sidebar with the alphabet and guess inputs
  alphabet.split("").forEach((letter) => {
    const listItem = document.createElement("li");
    listItem.className =
      "list-group-item d-flex justify-content-between align-items-center";
    listItem.innerHTML = `
      <span>${letter}</span>
      <input type="text" class="form-control form-control-sm guess-input" maxlength="1" data-letter="${letter}" value="${guessedLetters[letter] || ""}">
    `;
    letterFrequencyList.appendChild(listItem);
  });

  // Add event listener for guesses
  letterFrequencyList.addEventListener("input", (e) => {
    if (e.target.classList.contains("guess-input")) {
      const letter = e.target.dataset.letter;
      guessedLetters[letter] = e.target.value.toUpperCase(); // Force uppercase
      e.target.value = guessedLetters[letter]; // Reflect uppercase in input
      setCookie("guessedLetters", JSON.stringify(guessedLetters), 7);
      updatePuzzleCallback();
    }
  });
}

function updateSidebarFrequencies(letterCounts, totalLetters) {
  // Update frequencies in the sidebar
  alphabet.split("").forEach((letter) => {
    const inputs = document.querySelectorAll(`[data-letter="${letter}"]`);
    inputs.forEach((input) => {
      const frequency =
        totalLetters > 0
          ? ((letterCounts[letter] / totalLetters) * 100).toFixed(2)
          : "0.00";
      input.parentNode.querySelector("span").textContent = `${letter} (${frequency}%)`;
    });
  });
}

export { initializeSidebar, updateSidebarFrequencies, guessedLetters };
