const spinnerDivCartelera = document.getElementById('spinnerDivCartelera');
const spinnerDivFavoritos = document.getElementById('spinnerDivFavoritos');

function mostrarSpinner(spinnerDiv) {
    spinnerDiv.style.display = 'flex';
}

function eliminarSpinner(spinnerDiv, contenedor) {
    setTimeout(() => {
        spinnerDiv.style.display = 'none';
        contenedor.style.display = 'grid';
    }, 3000);
}

function traerFavoritosLocal() { //devuelve un array con los IDs de pelis favoritas en localStorage
    let favs = localStorage.getItem('FAVORITOS');
    if (favs) {
        return JSON.parse(favs)
    } else {
        favs = []
        return favs
    }
}

function guardarFavoritosLocal(favs) { //guarda un array con los IDs de pelis favoritas en localStorage
    localStorage.setItem('FAVORITOS', JSON.stringify(favs));
}