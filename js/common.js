const spinnerDiv = document.getElementById('spinnerDiv');

function mostrarSpinner() {
    contenedorPeliculas.innerHTML = ''; //vacío el contenedor de peliculas por si ya había pelis de otra página
    spinnerDiv.style.display = 'flex';
}

function eliminarSpinner() {
    setTimeout(() => {
        spinnerDiv.style.display = 'none';
        contenedorPeliculas.style.display = 'grid';
    }, 3000);
}