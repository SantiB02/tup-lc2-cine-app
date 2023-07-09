const spinnerDivCartelera = document.getElementById('spinnerDivCartelera');
const spinnerDivFavoritos = document.getElementById('spinnerDivFavoritos');
const options = { //constante options con los datos necesarios para ejecutar cada fetch
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNGMzYzVmYTllZDg0NjRlOTg1YjAzZGJiNTM3ZGE1ZCIsInN1YiI6IjY0YTYxOGVmMDdmYWEyMDBjN2ViYjI2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0lBSp1tL3aze0-IU_LRIwpUfqohZKdOzEiPy5xaHU0'
    }
};

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