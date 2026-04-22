/**
 * Wordly Dictionary App
 * ----------------------
 * This script handles:
 * - Form submission and user input validation
 * - Fetching word data from a dictionary API
 * - Displaying word details (definitions, synonyms, antonyms, and audio)
 * - Handling and displaying error states
 *
 * The app dynamically updates the DOM based on user input and API responses.
 */


/* =========================
   Cached DOM Elements
   ========================= */
const form = document.getElementById("search-form");
const searchResults = document.getElementById("search-results");
const resultsContent = document.getElementById("results-content");
const wordDisplay = document.getElementById("word-result");
const definitionDisplay = document.getElementById("definition-result");
const synonymDisplay = document.getElementById("synonym-result");
const antonymDisplay = document.getElementById("antonym-result");
const pronunciation = document.getElementById('word-audio');
const errorDisplay = document.getElementById("error-message");

/* =========================
   Event Listeners
   ========================= */
form.addEventListener("submit", function (event) {
    event.preventDefault();
    searchForWord();
})

/* =========================
   Search / Validation Logic
   ========================= */
/**
 * Validates user input and initiates a word search
 *
 * - Ensures input is not empty
 * - Ensures input contains only alphabetic characters
 * - Calls the API fetch function if valid
 * - Displays appropriate error messages if invalid
 *
 * @returns {void}
 */
function searchForWord() {
    const input = document.getElementById("search-input");
    const search = input.value;

    console.log("Searching for: ", search);

    if (search.length == 0) {
        handleErrors("Please enter a word");
    } else if (!/^[a-zA-Z]+$/.test(search)) {
        handleErrors("Please enter a word containing ONLY letters")
    }
    else {
        fetchWordSearchResults(search)
    }
    input.value = ""; // clear AFTER using it
}
/* =========================
   API Fetch Logic
   ========================= */
/**
 * Fetches word data from the dictionary API
 *
 * - Sends a request using the provided word
 * - Handles API response and errors
 * - Passes valid data to displayWord()
 * - Sends error messages to handleErrors()
 *
 * @param {string} word - The word to search for
 * @returns {void}
 */
function fetchWordSearchResults(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(function (response) {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Word not found or recognized");
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayWord(data);
        })
        .catch(function (error) {
            handleErrors(error.message);
        })
}

/* =========================
   Display / DOM Update Logic
   ========================= */
/**
 * Displays word data in the DOM
 *
 * Extracts and displays:
 * - The searched word
 * - Up to 8 definitions (to prevent UI overflow)
 * - Synonyms and antonyms, if available
 * - Audio pronunciation, if available
 *
 * Fallback behavior:
 * - Displays "N/A" when definitions, synonyms, or antonyms are missing
 * - Hides audio player if no pronunciation is available
 *
 * @param {Array} data - API response array containing word data
 * @returns {void}
 */
function displayWord(data) {
    // Show results and hide error
    searchResults.classList.remove("hidden");
    resultsContent.classList.remove("hidden");
    errorDisplay.classList.add("hidden");

    // Clear previous results
    wordDisplay.textContent = "";
    definitionDisplay.textContent = "";
    synonymDisplay.textContent = "";
    antonymDisplay.textContent = "";
    pronunciation.src = "";
    pronunciation.classList.add("hidden");
    errorDisplay.textContent = "";

    // Use first result from API response 
    // 'word' result can be assumed the same for all results
    const dataItem = data[0];

    // Display word
    wordDisplay.textContent = dataItem.word;

    // Counter to limit number of displayed definitions
    let count = 0;

    /*
     * Loop through meanings and definitions
     * Limit to 8 total definitions to keep UI readable
     */
    dataItem.meanings.forEach(dataMeaning => {
        dataMeaning.definitions.forEach(dataDefinitions => {
            if (count < 8) {
                const definition = document.createElement("li");
                definition.textContent = dataDefinitions.definition;
                definitionDisplay.append(definition);
                count++;
            }
        });
    });

    // If no definitions were added, display fallback
    if (definitionDisplay.children.length === 0) {
        const missingDefinition = document.createElement("li");
        missingDefinition.textContent = "N/A";
        missingDefinition.classList.add("na-item")
        definitionDisplay.append(missingDefinition);
    }

    /*
     * Loop through meanings and display synonyms if available
     */
    dataItem.meanings.forEach(dataMeaning => {
        if (dataMeaning.synonyms) {
            dataMeaning.synonyms.forEach(dataSynonyms => {
                const synonym = document.createElement("li");
                synonym.textContent = dataSynonyms
                synonymDisplay.append(synonym);
            })
        }
    });

    // If no synonym were added, display fallback
    if (synonymDisplay.children.length === 0) {
        const missingSynonym = document.createElement("li");
        missingSynonym.textContent = "N/A";
        missingSynonym.classList.add("na-item")
        synonymDisplay.append(missingSynonym);
    }

    /*
     * Loop through meanings and display antonyms if available
     */
    dataItem.meanings.forEach(dataMeaning => {
        if (dataMeaning.antonyms) {
            dataMeaning.antonyms.forEach(dataAntonyms => {
                const antonym = document.createElement("li");
                antonym.textContent = dataAntonyms
                antonymDisplay.append(antonym);
            })
        }
    });

    // If no antonym were added, display fallback
    if (antonymDisplay.children.length === 0) {
        const missingAntonym = document.createElement("li");
        missingAntonym.textContent = "N/A";
        missingAntonym.classList.add("na-item")
        antonymDisplay.append(missingAntonym);
    }

    /*
     * Find first available pronunciation audio
     */
    const audioResult = dataItem.phonetics.find(phonetics => phonetics.audio);
    if (audioResult) {
        pronunciation.src = audioResult.audio;
        pronunciation.classList.remove("hidden");
    } else {
        pronunciation.src = "";
        pronunciation.classList.add("hidden");
    }
}

/* =========================
   Error Handling
   ========================= */
/**
 * Handles error states in the UI
 *
 * - Clears any existing results
 * - Hides the normal results display
 * - Displays an error message to the user
 *
 * @param {string} message - The error message to display
 * @returns {void}
 */
function handleErrors(message) {
    // Show error state
    searchResults.classList.remove("hidden");
    resultsContent.classList.add("hidden");
    errorDisplay.classList.remove("hidden");

    // Clear previous results
    wordDisplay.textContent = "";
    definitionDisplay.textContent = "";
    synonymDisplay.textContent = "";
    pronunciation.src = "";
    pronunciation.classList.add("hidden");

    // Display error message
    errorDisplay.textContent = message;
}
