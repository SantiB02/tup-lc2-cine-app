const spinnerDiv = document.getElementById('spinnerDiv');

function mostrarSpinner() {
    contenedorPeliculas.innerHTML = ''; //vacío el contenedor de peliculas por si ya había pelis de otra página
    spinnerDiv.style.display = 'flex';
}

function eliminarSpinner() {
    spinnerDiv.style.display = 'none';
}