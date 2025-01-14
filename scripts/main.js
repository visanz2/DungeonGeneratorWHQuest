let selectedImages = [];
let currentImageIndex = 0;

function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function generarMazmorra() {
    const raza = document.getElementById("raceSelect").value;
    // Simular la selección de 6 imágenes aleatorias
    selectedImages = [];
    for (let i = 1; i <= 6; i++) {
        // Asumimos que las imágenes están nombradas del 1 al 10 en cada carpeta
        const randomNum = Math.floor(Math.random() * 10) + 1;
        selectedImages.push(`imagenes/${raza}/${randomNum}.jpg`);
    }
    currentImageIndex = 0;
    document.getElementById("sacarCartaBtn").disabled = false;
    document.getElementById("imageDisplay").innerHTML = "";
}

function sacarCarta() {
    if (currentImageIndex < selectedImages.length) {
        const img = document.createElement("img");
        img.src = selectedImages[currentImageIndex];
        img.alt = "Carta de mazmorra";
        document.getElementById("imageDisplay").innerHTML = "";
        document.getElementById("imageDisplay").appendChild(img);
        currentImageIndex++;

        if (currentImageIndex >= selectedImages.length) {
            document.getElementById("sacarCartaBtn").disabled = true;
        }
    }
}
