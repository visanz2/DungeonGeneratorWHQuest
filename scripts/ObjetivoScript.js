// Get the objetivoSala dropdown element and preview div
const salaObjetivoDropdown = document.getElementById('salaObjetivoDropdown');
const imageObjetivoContainer = document.getElementById('imageObjetivoContainer');
const objetivoImagePreview = document.getElementById('objetivoImagePreview');


// Inicializar numCartas dropdown
function initializeNumCartasDropdown() {
    // Inicializar select de número de cartas
    const selectNumCartas = document.getElementById('numCartas');
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectNumCartas.appendChild(option);
    }
}

// Function to populate the dropdown
function populateObjetivoSalaDropdown() {
    // Add each image from the imageData to the dropdown
    imageData.images.forEach(image => {
        const option = document.createElement('option');
        option.value = image.path;
        option.textContent = image.name;
        salaObjetivoDropdown.appendChild(option);
    });

    console.log('Loaded images:', imageData.images.map(img => img.name));
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
salaObjetivoDropdown.addEventListener('change', handleObjetivoSalasSelect);


// Inicialización, populating dropdown when page loads
document.addEventListener('DOMContentLoaded', function () {
    initializeNumCartasDropdown();
    populateObjetivoSalaDropdown();
});
