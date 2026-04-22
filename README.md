# Wordly Dictionary App

## Overview

Wordly is a single-page web application that allows users to search for English words and view relevant dictionary data, including:

* Definitions
* Synonyms
* Antonyms
* Pronunciation audio (when available)

The application dynamically fetches data from a public dictionary API and updates the page without reloading.

---

## Features

* Search for any English word
* Display up to 8 unique definitions
* Deduplicated synonyms and antonyms
* Audio pronunciation (if available)
* User-friendly error handling
* Input validation (letters only)
* Graceful fallback ("N/A") when data is missing
* Clean, responsive UI with structured layout

---

## Technologies Used

* HTML5
* CSS3 (Flexbox for layout)
* JavaScript (ES6+)
* Fetch API

---

## API Used

This project uses the free Dictionary API:

https://api.dictionaryapi.dev/

Example endpoint:
https://api.dictionaryapi.dev/api/v2/entries/en/{word}

---

## How It Works

1. User enters a word into the search form
2. Input is validated (non-empty, letters only)
3. A request is sent to the Dictionary API
4. The response is processed:

   * Definitions are collected and limited to 8 unique entries
   * Synonyms and antonyms are deduplicated using Sets
   * Audio pronunciation is selected if available
5. The DOM is updated dynamically with results
6. If no data is available, "N/A" is displayed
7. If an error occurs, an error message is shown

---

## Project Structure

```
/project-root
│
├── index.html     # Main HTML structure
├── styles.css     # Application styling
├── index.js       # Application logic
└── README.md      # Project documentation
```

---

## Key Functions

* `searchForWord()` → handles input validation and triggers search
* `fetchWordSearchResults()` → fetches data from API
* `displayWord()` → orchestrates UI updates
* `appendDefinitions()` → displays unique definitions (max 8)
* `appendSynonyms()` → displays unique synonyms
* `appendAntonyms()` → displays unique antonyms
* `updatePronunciation()` → handles audio playback
* `handleErrors()` → manages error UI state

---

## Design Decisions

* Sets are used to ensure unique synonyms, antonyms, and definitions
* A definition limit (8) prevents UI overflow
* "N/A" fallback ensures consistent UI when data is missing
* Modular functions improve readability and maintainability
* Flexbox layout enables responsive column design

---

## Example Searches

Try searching:

* run
* happy
* d (multiple antonynms)
* hola (no synonym or antonyms)
* xyzabc (to test error handling)
* 123 (to test error handling)
* $$$ (to test error handling)

---

## Future Improvements

* Group definitions by part of speech (noun, verb, etc.)
* Add loading indicator while fetching data
* Improve mobile responsiveness
* Add favorites or search history
* Sort results alphabetically

---

## Author
Matthew Swanberg
 - Created as part of a web development lab project for Course 3 Module 8.
