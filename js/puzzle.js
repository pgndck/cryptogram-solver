// puzzle.js: Logic for the main puzzle area
import { guessedLetters } from "./sidebar.js";

function updatePuzzle(cipherText, mainArea, letterCountsCallback) {
  mainArea.innerHTML = ""; // Clear previous content

  const words = cipherText.split(" ");
  const letterCounts = {};
  const totalLetters = cipherText.replace(/[^A-Za-z]/g, "").length;

  words.forEach((word) => {
    const wordDiv = document.createElement("div");
    wordDiv.className = "word";

    for (let i = 0; i < word.length; i++) {
      const c = word[i];
      const upperC = c.toUpperCase();
      const letterBlock = document.createElement("div");
      letterBlock.className = "letter-block";

      if (/[A-Za-z]/.test(c)) {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "input-letter";
        input.maxLength = "1";
        input.value = guessedLetters[upperC] || ""; // Blank if no guess
        input.addEventListener("input", function () {
          input.value = input.value.toUpperCase(); // Force uppercase
          guessedLetters[upperC] = input.value; // Update guess
          setCookie("guessedLetters", JSON.stringify(guessedLetters), 7); // Save to cookies
        });
        letterBlock.appendChild(input);

        const cipherLetter = document.createElement("div");
        cipherLetter.className = "cipher-letter";
        cipherLetter.textContent = upperC;
        letterBlock.appendChild(cipherLetter);

        wordDiv.appendChild(letterBlock);

        letterCounts[upperC] = (letterCounts[upperC] || 0) + 1;
      } else {
        const span = document.createElement("span");
        span.textContent = c;
        letterBlock.appendChild(span);
        wordDiv.appendChild(letterBlock);
      }
    }

    mainArea.appendChild(wordDiv);
  });

  letterCountsCallback(letterCounts, totalLetters);
}

export { updatePuzzle };
