// Variables globales
let listaCartas = [];
let indiceActual = 0;

// Elementos del DOM
const roomSelect = document.getElementById('roomSelect');
const imageContainer = document.getElementById('imageContainer');
const roomImage = document.getElementById('roomImage');


// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    inicializarSelects();
    cargarEstadoAnterior();
});

// Inicializar selects
function inicializarSelects() {
    // Inicializar select de número de cartas
    const selectNumCartas = document.getElementById('numCartas');
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectNumCartas.appendChild(option);
    }

    // Cargar las salas objetivo disponibles
    try {
        // Cargar el archivo JSON con la lista de salas
        const response = await fetch('salas.json');
        const data = await response.json();
        
        const selectSala = document.getElementById('salaObjetivo');
        // Limpiar opciones existentes
        selectSala.innerHTML = '<option value="">Seleccione una sala</option>';
        
        // Añadir cada sala del JSON
        data.salasObjetivo.forEach(salaArchivo => {
            const option = document.createElement('option');
            // Guardamos el nombre del archivo como valor
            option.value = salaArchivo;
            // Mostramos el nombre más amigable (quitamos extensión y reemplazamos guiones)
            option.textContent = salaArchivo
                .replace('.jpg', '')
                .replace('.png', '')
                .replace(/_/g, ' ')
                .replace(/-/g, ' ');
            selectSala.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando las salas:', error);
        alert('Error cargando las salas objetivo. Por favor, recarga la página.');
    }
}

// Manejo de pestañas
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let content of tabContents) {
        content.classList.remove('active');
    }

    const tabButtons = document.getElementsByClassName('tab-button');
    for (let button of tabButtons) {
        button.classList.remove('active');
    }

    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');

    // Guardar pestaña actual
    localStorage.setItem('tabActiva', tabName);
}

// Manejador de cambio de sala objetivo
roomSelect.addEventListener('change', function() {
    const selectedRoom = this.value;
    
    if (selectedRoom && rooms[selectedRoom]) {
        // Actualizar y mostrar la imagen
        roomImage.src = rooms[selectedRoom].image;
        roomImage.alt = `Imagen de ${rooms[selectedRoom].name}`;
        imageContainer.classList.remove('hidden');
    } else {
        // Ocultar el contenedor de imagen si no hay sala seleccionada
        imageContainer.classList.add('hidden');
    }
});

// Generar mazmorra
function generarMazmorra() {
    const numCartas = parseInt(document.getElementById('numCartas').value);
    const salaObjetivo = document.getElementById('salaObjetivo').value;

    if (!numCartas || !salaObjetivo) {
        alert('Por favor, seleccione todos los campos requeridos');
        return;
    }

    // Generar lista de cartas (simulado)
    listaCartas = [];
    for (let i = 0; i < numCartas; i++) {
        listaCartas.push(`imagenes/mazmorras/carta${i + 1}.jpg`);
    }

    // Insertar sala objetivo en posición aleatoria entre la mitad y el final
    const mitad = Math.floor(listaCartas.length / 2);
    const posicionObjetivo = mitad + Math.floor(Math.random() * (listaCartas.length - mitad));
    listaCartas.splice(posicionObjetivo, 0, `imagenes/mazmorra/objetivo/${salaObjetivo}.jpg`);

    // Resetear índice y habilitar botón
    indiceActual = 0;
    document.getElementById('btnSacarCarta').disabled = false;
    document.getElementById('cartaDisplay').innerHTML = '';

    // Guardar estado
    guardarEstado();
}

// Sacar carta
function sacarCarta() {
    if (indiceActual < listaCartas.length) {
        const img = document.createElement('img');
        img.src = listaCartas[indiceActual];
        img.alt = 'Carta de mazmorra';
        
        document.getElementById('cartaDisplay').innerHTML = '';
        document.getElementById('cartaDisplay').appendChild(img);
        
        indiceActual++;

        if (indiceActual >= listaCartas.length) {
            document.getElementById('btnSacarCarta').disabled = true;
        }

        // Guardar estado
        guardarEstado();
    }
}

// Guardar estado en localStorage
function guardarEstado() {
    const estado = {
        listaCartas: listaCartas,
        indiceActual: indiceActual,
        salaObjetivo: document.getElementById('salaObjetivo').value,
        numCartas: document.getElementById('numCartas').value
    };
    localStorage.setItem('estadoMazmorra', JSON.stringify(estado));
}

// Cargar estado anterior
function cargarEstadoAnterior() {
    // Cargar pestaña activa
    const tabActiva = localStorage.getItem('tabActiva');
    if (tabActiva) {
        document.querySelector(`[onclick="openTab(event, '${tabActiva}')"]`).click();
    }

    // Cargar estado de la mazmorra
    const estadoGuardado = localStorage.getItem('estadoMazmorra');
    if (estadoGuardado) {
        const estado = JSON.parse(estadoGuardado);
        
        // Restaurar valores
        document.getElementById('salaObjetivo').value = estado.salaObjetivo;
        document.getElementById('numCartas').value = estado.numCartas;
        listaCartas = estado.listaCartas;
        indiceActual = estado.indiceActual;

        // Restaurar última carta mostrada
        if (indiceActual > 0 && indiceActual <= listaCartas.length) {
            const img = document.createElement('img');
            img.src = listaCartas[indiceActual - 1];
            img.alt = 'Carta de mazmorra';
            document.getElementById('cartaDisplay').innerHTML = '';
            document.getElementById('cartaDisplay').appendChild(img);
        }

        // Restaurar estado del botón
        document.getElementById('btnSacarCarta').disabled = 
            indiceActual >= listaCartas.length || listaCartas.length === 0;
    }
}
