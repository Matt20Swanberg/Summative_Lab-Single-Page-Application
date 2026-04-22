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
    input.value = "";
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
 * - Up to 8 UNIQUE definitions (to prevent UI overflow)
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

    resetResults();

    const dataItem = data[0];

    wordDisplay.textContent = dataItem.word;

    appendDefinitions(dataItem);
    appendSynonyms(dataItem);
    appendAntonyms(dataItem);
    updatePronunciation(dataItem);
}

/**
 * Clears previously displayed results before rendering new content
 *
 * @returns {void}
 */
function resetResults() {
    wordDisplay.textContent = "";
    definitionDisplay.textContent = "";
    synonymDisplay.textContent = "";
    antonymDisplay.textContent = "";
    pronunciation.src = "";
    pronunciation.classList.add("hidden");
    errorDisplay.textContent = "";
}

/**
 * Appends up to 8 unique definitions to the definition list
 *
 * - Uses a Set to remove duplicate definitions
 * - Limits results to 8 entries to keep UI readable
 * - Displays "N/A" if no definitions are available
 *
 * @param {Object} dataItem - The first word object returned by the API
 * @returns {void}
 */
function appendDefinitions(dataItem) {
    // Store unique definitions to avoid duplicates across meanings
    const definitionSet = new Set();

    dataItem.meanings.forEach(dataMeaning => {
        dataMeaning.definitions.forEach(dataDefinitions => {
            definitionSet.add(dataDefinitions.definition);
        });
    });

    let count = 0;

    definitionSet.forEach(def => {
        if (count < 8) {
            const li = document.createElement("li");
            li.textContent = def;
            definitionDisplay.append(li);
            count++;
        }
    })

    if (definitionDisplay.children.length === 0) {
        const missingDefinition = document.createElement("li");
        missingDefinition.textContent = "N/A";
        missingDefinition.classList.add("na-item")
        definitionDisplay.append(missingDefinition);
    }
}

/**
 * Appends unique synonyms to the synonym list
 *
 * - Uses a Set to remove duplicate synonyms
 * - Displays "N/A" if no synonyms are available
 *
 * @param {Object} dataItem - The first word object returned by the API
 * @returns {void}
 */
function appendSynonyms(dataItem) {
    const synonymSet = new Set();

    dataItem.meanings.forEach(dataMeaning => {
        if (dataMeaning.synonyms) {
            dataMeaning.synonyms.forEach(dataSynonyms => {
                synonymSet.add(dataSynonyms);
            })
        }
    });

    synonymSet.forEach(syn => {
        const li = document.createElement("li");
        li.textContent = syn;
        synonymDisplay.append(li);
    });

    if (synonymDisplay.children.length === 0) {
        const missingSynonym = document.createElement("li");
        missingSynonym.textContent = "N/A";
        missingSynonym.classList.add("na-item")
        synonymDisplay.append(missingSynonym);
    };
}

/**
 * Appends unique antonyms to the antonym list
 *
 * - Uses a Set to remove duplicate antonyms
 * - Displays "N/A" if no antonyms are available
 *
 * @param {Object} dataItem - The first word object returned by the API
 * @returns {void}
 */
function appendAntonyms(dataItem) {
    const antonymSet = new Set();

    dataItem.meanings.forEach(dataMeaning => {
        if (dataMeaning.antonyms) {
            dataMeaning.antonyms.forEach(dataAntonyms => {
                antonymSet.add(dataAntonyms);
            })
        }
    });

    antonymSet.forEach(ant => {
        const li = document.createElement("li");
        li.textContent = ant;
        antonymDisplay.append(li);
    });

    if (antonymDisplay.children.length === 0) {
        const missingAntonym = document.createElement("li");
        missingAntonym.textContent = "N/A";
        missingAntonym.classList.add("na-item")
        antonymDisplay.append(missingAntonym);
    };
}

/**
 * Updates pronunciation audio if available
 *
 * Hides the audio player if no audio source is found.
 *
 * @param {Object} dataItem - The first word object returned by the API
 * @returns {void}
 */
function updatePronunciation(dataItem) {
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
