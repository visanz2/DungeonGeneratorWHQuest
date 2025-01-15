// Variables globales
let listaCartas = [];
let indiceActual = 0;

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

    // Aquí deberías cargar las salas objetivo disponibles
    // Por ahora usaremos un ejemplo estático
    const salasEjemplo = ['Sala1', 'Sala2', 'Sala3']; // Esto debería ser dinámico
    const selectSala = document.getElementById('salaObjetivo');
    salasEjemplo.forEach(sala => {
        const option = document.createElement('option');
        option.value = sala;
        option.textContent = sala;
        selectSala.appendChild(option);
    });
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
