// events.js: Event listeners for user interactions
import { setCookie, getCookie } from "./cookies.js";
import { updatePuzzle } from "./puzzle.js";
import { initializeSidebar, updateSidebarFrequencies } from "./sidebar.js";

function setupEventListeners(cipherTextArea, mainArea, letterFrequencyList) {
  const savedPuzzle = getCookie("lastPuzzle");
  if (savedPuzzle) {
    cipherTextArea.value = savedPuzzle;
    updatePuzzle(savedPuzzle, mainArea, (counts, total) =>
      updateSidebarFrequencies(counts, total)
    );
  }

  cipherTextArea.addEventListener("input", function () {
    const cipherText = cipherTextArea.value;
    setCookie("lastPuzzle", cipherText, 7);
    updatePuzzle(cipherText, mainArea, (counts, total) =>
      updateSidebarFrequencies(counts, total)
    );
  });

  initializeSidebar(letterFrequencyList, () =>
    updatePuzzle(cipherTextArea.value, mainArea, (counts, total) =>
      updateSidebarFrequencies(counts, total)
    )
  );
}

export { setupEventListeners };
