/**
 * Wordly Dictionary App
 * ----------------------
 * This script handles:
 * - Form submission and user input validation
 * - Fetching word data from a dictionary API
 * - Displaying word details (definitions, synonyms, audio)
 * - Handling and displaying error states
 */


/**
 * Cache DOM elements for reuse throughout the app
 */
const form = document.getElementById("search-form");
const searchResults = document.getElementById("search-results");
const resultsContent = document.getElementById("results-content");
const wordDisplay = document.getElementById("word-result");
const definitionDisplay = document.getElementById("definition-result");
const synonymDisplay = document.getElementById("synonym-result");
const pronunciation = document.getElementById('word-audio');
const errorDisplay = document.getElementById("error-message");

/**
 * Event listener for form submission
 * Prevents default behavior and triggers search logic
 */
form.addEventListener("submit", function (event) {
    event.preventDefault();
    searchForWord();
})

/**
 * Handles user input validation and initiates API call
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
    else if (!search) {
        handleErrors('Word not found')
    }
    else {
        fetchWordSearchResults(search)
    }
    input.value = ""; // clear AFTER using it
}

/**
 * Fetches word data from the dictionary API
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

/**
 * Displays word data in the DOM
 *
 * Extracts:
 * - Word text
 * - Definitions (all meanings)
 * - Synonyms (if available)
 * - Audio pronunciation (if available)
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
    pronunciation.src = "";
    pronunciation.classList.add("hidden");
    errorDisplay.textContent = "";

    // Use first result from API response 
    // 'word' result can be assumed the same for all results
    dataItem = data[0];

    // Display word
    wordDisplay.textContent = `Word searched: ${dataItem.word}`;

    /*
     * Loop through meanings and definitions
     * Each definition is appended as a list item
     */
    dataItem.meanings.forEach(dataMeaning => {
        dataMeaning.definitions.forEach(dataDefinitions => {
            const definition = document.createElement("li");
            definition.textContent = dataDefinitions.definition
            definitionDisplay.append(definition);
        })
    });

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
}

/**
 * Handles error states in the UI
 *
 * Displays an error message and hides normal results content
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

    // Display error message
    errorDisplay.textContent = message;
}
