///////////////////////////////////////////
/*General functions used for all sections*/
///////////////////////////////////////////
class GeneralClass {

    // Constructor of the Class
    constructor() {}

    // Action made by the website to change language after user press button
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'es' : 'en';
        this.updateTranslations();

    }

    // Updating the language of the website
    updateTranslations() {
        const t = translations[this.currentLanguage];
        document.getElementById('customizeTitle').textContent = t.customizeTitle;
        /*document.getElementById('roomLabel').textContent = t.roomLabel;
        document.getElementById('corridorLabel').textContent = t.corridorLabel;
        document.getElementById('updateDeckBtn').textContent = t.updateDeck;
        document.getElementById('saveBtn').textContent = t.save;
        document.getElementById('loadBtn').textContent = t.load;
        document.getElementById('resetBtn').textContent = t.reset;*/
        document.getElementById('languageToggle').textContent = t.toggleLanguage;
    }

    // Function to save the current state of the whole web
    saveState() {
        const gameState = {
            decks: this.decks,
            placedCards: this.placedCards,
            availableSpots: this.availableSpots
        };
        localStorage.setItem('dungeonState', JSON.stringify(gameState));
        alert('Data saved!');
    }

    // Function to load the current state of the whole web
    loadState() {
        const savedState = localStorage.getItem('dungeonState');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            this.decks = gameState.decks;
            this.placedCards = gameState.placedCards;
            this.availableSpots = gameState.availableSpots;
            this.render();
            alert('Data loaded!');
        } else {
            alert('No saved dungeon found!');
        }
    }

    // Resets all website. For specifics resets, check each scripts file section
    resetAll() {
        if (confirm('Are you sure you want to reset the dungeon?')) {
            this.initializeGame();
            this.render();
        }
    }



}