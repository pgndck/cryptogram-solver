// Helper functions for cookies
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return "";
}

// Load the last puzzle if available
window.addEventListener("load", function () {
  const savedPuzzle = getCookie("lastPuzzle");
  if (savedPuzzle) {
    document.getElementById("cipher-text").value = savedPuzzle;
  }
});

document.getElementById("start-solving").addEventListener("click", function () {
  const cipherText = document.getElementById("cipher-text").value;

  // Save the puzzle in a cookie
  setCookie("lastPuzzle", cipherText, 7); // Save for 7 days

  const mainArea = document.getElementById("main-area");
  const letterFrequencyList = document.getElementById("letter-frequency-list");
  mainArea.innerHTML = ""; // Clear previous content
  letterFrequencyList.innerHTML = ""; // Clear previous frequencies

  // Split the text into words
  const words = cipherText.split(" ");

  // Create an object to map cipher letters to input fields
  const cipherLetterMap = {};

  // Count letter frequencies
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
        input.maxLength = "1";
        input.className = "input-letter";
        letterBlock.appendChild(input);

        const cipherLetter = document.createElement("div");
        cipherLetter.className = "cipher-letter";
        cipherLetter.textContent = upperC;
        letterBlock.appendChild(cipherLetter);

        wordDiv.appendChild(letterBlock);

        // Initialize the array for this cipher letter if it doesn't exist
        if (!cipherLetterMap[upperC]) {
          cipherLetterMap[upperC] = [];
        }
        cipherLetterMap[upperC].push(input);

        // Count letter frequency
        letterCounts[upperC] = (letterCounts[upperC] || 0) + 1;

        // Event listener to update all matching inputs
        input.addEventListener("input", function () {
          const value = input.value.toUpperCase();
          cipherLetterMap[upperC].forEach(function (inp) {
            if (inp !== input) {
              inp.value = value;
            }
          });
        });
      } else {
        // For spaces and punctuation within words
        const span = document.createElement("span");
        span.textContent = c;
        letterBlock.appendChild(span);
        wordDiv.appendChild(letterBlock);
      }
    }

    // Add the word div to the main area
    mainArea.appendChild(wordDiv);
  });

  // Sort letters by frequency and populate the sidebar
  const sortedLetters = Object.keys(letterCounts).sort(
    (a, b) => letterCounts[b] - letterCounts[a]
  );
  sortedLetters.forEach((letter) => {
    const frequency = ((letterCounts[letter] / totalLetters) * 100).toFixed(2);
    const listItem = document.createElement("li");
    listItem.className =
      "list-group-item d-flex justify-content-between align-items-center";
    listItem.textContent = `${letter}`;
    const badge = document.createElement("span");
    badge.className = "badge bg-primary rounded-pill";
    badge.textContent = `${frequency}%`;
    listItem.appendChild(badge);
    letterFrequencyList.appendChild(listItem);
  });
});
