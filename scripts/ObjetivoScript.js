// Get the objetivoSala dropdown element and preview div
const dropdownObjetiveRoom = document.getElementById('salaObjetivoDropdown');
const imageObjetivoContainer = document.getElementById('imageObjetivoContainer');
const objetivoImagePreview = document.getElementById('objetivoImagePreview');
const dropdownNumCorredor = document.getElementById('numCartasCorredor');
const dropdownSpecialRoom = document.getElementById('numCartasEspecial');
const dropdownNumUnderground= document.getElementById('numCartasSubterraneo');

// Inicializar numCartas* dropdown
function initializeNumCartasDropdown() {
    // Inicializar select de número de cartas
    

    // Initialize corridor dropdown
    for (let i = 1; i <= 12; i++) {
        option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        dropdownNumCorredor.appendChild(option);
    }

    // Initialize Especial dropdown
    /*for (let i = 1; i <= 12; i++) {
        option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        dropdownSpecialRoom.appendChild(option);
    }*/

    // Initialize Underground dropdown
    for (let i = 1; i <= 12; i++) {
        option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        dropdownNumUnderground.appendChild(option);
    }
}

// Function to populate the dropdown
function populateObjetiveSalaDropdown() {
    // Add each image from the imageData to the dropdown
    objetiveRoomData.room.forEach(room => {
        const option = document.createElement('option');
        option.value = room.path;
        option.textContent = room.name;
        dropdownObjetiveRoom.appendChild(option);
    });

    console.log('Loaded images:', objetiveRoomData.room.map(room => room.name));
}

// Function to populate the dropdown
function populateSpecialSalaDropdown() {
    // Add each image from the imageData to the dropdown
    specialRoomData.room.forEach(room => {
        const option = document.createElement('option');
        option.value = room.path;
        option.textContent = room.name;
        dropdownSpecialRoom.appendChild(option);
    });

    console.log('Loaded images:', specialRoomData.room.map(room => room.name));
}

// Function to handle selection change
function handleObjetivoSalasSelect(event) {
    const selectedImagePath = event.target.value;

    // Clear existing preview
    objetivoImagePreview.innerHTML = '';

    if (selectedImagePath) {
        // Create and show new image
        const img = document.createElement('img');
        objetivoImagePreview.src = "imagenes/Mazmorra/OBJETIVO/".concat(selectedImagePath);
        objetivoImagePreview.alt = selectedImagePath.split('/').pop(); // Get filename from path
        objetivoImagePreview.className = 'visible';
        console.log('image source:', img.src);
        //objetivoImagePreview..appendChild(img);
        //imageContainer.classList.remove('hidden');


        console.log('Selected image:', selectedImagePath);
    }
}

// Add event listener for selection change
dropdownObjetiveRoom.addEventListener('change', handleObjetivoSalasSelect);



// DungeonBuilder to show the dungeon
class DungeonBuilder {
    // Contrusctor that will be remove or change to load the cards generated
    constructor() {
        this.decks = [{
            cards: [
                { type: 'corridor', id: 1 },
                { type: 'corridor', id: 2 },
                { type: 'corridor', id: 3 },
                { type: 'room', id: 4 },
                { type: 'corridor', id: 5 },
                { type: 'room', id: 6 }
            ],
            pathId: 'main'
        }];

        this.placedCards = [];
        this.availableSpots = [{x: 0, y: 2, pathId: 'main' }];
        this.gridSize = {width: 8, height: 12 };

        this.initializeUI();
        this.render();
    }

    // Starting the interfaz
    initializeUI() {
        this.gridElement = document.getElementById('grid');
        this.deckInfoElement = document.getElementById('deckInfo');
        this.gridElement.style.gridTemplateColumns = `repeat(${this.gridSize.width}, 1fr)`;
    }


    // Function to draw a card in specific position
    drawCard(pathId, position) {

        // Drawing a random card
        const deckIndex = this.decks.findIndex(d => d.pathId === pathId);

        if (deckIndex === -1 || this.decks[deckIndex].cards.length === 0) return;

        const deck = this.decks[deckIndex];
        const randomIndex = Math.floor(Math.random() * deck.cards.length);
        const drawnCard = deck.cards[randomIndex];

        // Remove drawn card from deck
        const newDecks = [...this.decks];
        newDecks[deckIndex] = {
            ...deck,
            cards: deck.cards.filter((_, index) => index !== randomIndex)
        };

        // Handle corridor splits
        if (drawnCard.type === 'corridor') {
            const remainingCards = [...newDecks[deckIndex].cards];

            const halfLength = Math.ceil(remainingCards.length / 2);
            const topDeck = remainingCards.slice(0, halfLength);
            const bottomDeck = remainingCards.slice(halfLength);

            const topPathId = `${pathId}-top`;
            const bottomPathId = `${pathId}-bottom`;

            newDecks.splice(deckIndex, 1);
            newDecks.push(
                {cards: topDeck, pathId: topPathId },
                {cards: bottomDeck, pathId: bottomPathId }
            );

            // Update available spots
            this.availableSpots = [
                ...this.availableSpots.filter(spot =>
                    !(spot.x === position.x && spot.y === position.y)
                ),
                {x: position.x + 1, y: position.y - 1, pathId: topPathId },
                {x: position.x + 1, y: position.y + 1, pathId: bottomPathId }
            ];
        } else {
            // Handle room connections
            this.availableSpots = [
                ...this.availableSpots.filter(spot =>
                    !(spot.x === position.x && spot.y === position.y)
                ),
                { x: position.x + 1, y: position.y, pathId: pathId }
            ];
        }

        // Updating decks
        this.decks = newDecks;
        this.placedCards.push({
            ...drawnCard,
            x: position.x,
            y: position.y,
            pathId
        });

        this.render();
    }

    // Creating element card to put in the grid
    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.type}`;

        const content = document.createElement('div');
        content.className = 'card-content';
        content.textContent = card.type === 'room' ? 'Room' : 'Hall2';

        const arrowsContainer = document.createElement('div');
        arrowsContainer.className = 'arrows';

        if (card.type === 'room') {
            const rightArrow = document.createElement('div');
            rightArrow.className = 'arrow arrow-right';
            arrowsContainer.appendChild(rightArrow);
        } else {
            const rightArrow = document.createElement('div');
            rightArrow.className = 'arrow arrow-right';
            const downArrow = document.createElement('div');
            downArrow.className = 'arrow';
            arrowsContainer.appendChild(rightArrow);
            arrowsContainer.appendChild(downArrow);
        }

        cardDiv.appendChild(content);
        cardDiv.appendChild(arrowsContainer);

        return cardDiv;
    }

    // Function to create the buttons to add room in the grid
    createAddButtons(spot) {
        const container = document.createElement('div');
        container.className = 'add-buttons-container';

        const normalRoomButton = document.createElement('button');
        normalRoomButton.className = 'add-room-button normal';
        normalRoomButton.textContent = 'Normal Room';
        normalRoomButton.addEventListener('click', () => this.drawCard(spot.pathId, { x: spot.x, y: spot.y }));

        const specialRoomButton = document.createElement('button');
        specialRoomButton.className = 'add-room-button special';
        specialRoomButton.textContent = 'Special Room';
        specialRoomButton.addEventListener('click', () => {

            const specialRoom = dropdownSpecialRoom.value;

            if (!specialRoom) {
                alert('NO SPECIAL ROOM SELECTED');
                return;
            }

            this.drawCard(spot.pathId,
                { x: spot.x, y: spot.y },
                { type: 'special', subtype: specialRoom }
            );
        });

        container.appendChild(normalRoomButton);
        container.appendChild(specialRoomButton);

        return container;
    }

    // Rendering deck
    render() {
        // Update deck info
        this.deckInfoElement.innerHTML = this.decks.map(deck =>
            `<div class="deck-status">Path ${deck.pathId}: ${deck.cards.length} cards remaining</div>`
        ).join('');

        // Update grid
        this.gridElement.innerHTML = '';
        for (let y = 0; y < this.gridSize.height; y++) {
            for (let x = 0; x < this.gridSize.width; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';

                const card = this.placedCards.find(c => c.x === x && c.y === y);
                const spot = this.availableSpots.find(s => s.x === x && s.y === y);

                if (card) {
                    cell.appendChild(this.createCardElement(card));
                } else if (spot) {
                    cell.appendChild(this.createAddButtons(spot));
                }

                this.gridElement.appendChild(cell);
            }
        }
    }
}



// Inicialización, populating dropdown when page loads
document.addEventListener('DOMContentLoaded', function () {
    initializeNumCartasDropdown();
    populateObjetiveSalaDropdown();
    populateSpecialSalaDropdown();
    new DungeonBuilder();
});
    // Initialize the game when the page loads
 /*   window.onload = () => {
    new DungeonBuilder();
    };*/

