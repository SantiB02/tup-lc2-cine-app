const contenedorPeliculas = document.getElementById('contenedorPeliculas'); //guardo el contenedor de peliculas
const inputCodigo = document.getElementById('codigoPeli'); //guardo el input para ingresar codigo pelicula
const btnAnterior = document.getElementById('btnAnterior');
let pagina = 1; //pagina en la que estoy (para paginacion)

function statusBtnAnterior(pag) {
    if (pag > 1) {
        btnAnterior.disabled = false; //habilito el boton Anterior (paginacion) si estoy en paginas siguientes a la primera
        btnAnterior.classList.remove('btnDisabled');
    } else if (pag == 1) {
        btnAnterior.disabled = true; //si estoy en la primera página, deshabilito el boton Anterior (paginacion)
        btnAnterior.classList.add('btnDisabled');
        console.log('disable');
    }
}

function requestCartelera(pagina = 1) { //por defecto es 1
    statusBtnAnterior(pagina); //habilito o deshabilito el boton anterior

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNGMzYzVmYTllZDg0NjRlOTg1YjAzZGJiNTM3ZGE1ZCIsInN1YiI6IjY0YTYxOGVmMDdmYWEyMDBjN2ViYjI2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0lBSp1tL3aze0-IU_LRIwpUfqohZKdOzEiPy5xaHU0'
        }
    };

    fetch('https://api.themoviedb.org/3/movie/now_playing?language=es&page=' + (pagina.toString()), options)
        .then(response => response.json())
        .then(response => {
            eliminarSpinner(); //elimino el mensaje de carga porque pude solicitar las pelis (ver common.js)
            console.log(response);

            for (let i = 0; i < response.results.length; i++) {
                pelicula = response.results[i]
                let poster_path = pelicula.poster_path
                let title = pelicula.title
                let id = pelicula.id
                let original_title = pelicula.original_title
                let original_language = pelicula.original_language
                let release_date = pelicula.release_date

                const divPelicula = document.createElement('div');
                divPelicula.className = 'pelicula';

                divPelicula.innerHTML = `
                <img class="poster" src="https://image.tmdb.org/t/p/w500/${poster_path}">
                <h3 class="titulo">${title}</h3>
                <div class="desc-pelicula">
                <p><b>Código:</b> ${id}<br>
                <b>Título original:</b> ${original_title}<br>
                <b>Idioma original:</b> ${original_language}<br>
                <b>Año:</b> ${release_date}<br></p>
                </div>
                <button class="button" onclick="agregarFav_boton()">Agregar a Favoritos</button>
                `;
                contenedorPeliculas.appendChild(divPelicula); //le agrego el div con la pelicula al contenedor
            }
        })
        .catch(error => {
            console.error(error);
        });
}

setTimeout(requestCartelera, 3000); //espera 3 segundos hasta hacer request a la API, para que llegue a mostrarse el spinner de carga

function pasarPagina() {
    if (pagina <= 1000) {
        pagina += 1;
        mostrarSpinner();
        setTimeout(requestCartelera, 2000, pagina);
    }
}

function volverPagina() {
    if (pagina > 1) {
        pagina -= 1;
        mostrarSpinner();
        setTimeout(requestCartelera, 2000, pagina);
    }
}

function agregarFav_codigo() { //agrega una pelicula a Favoritos ingresando el codigo
    codigo = inputCodigo.value;
}

function agregarFav_boton() { //agrega una pelicula a Favoritos tocando el boton debajo de la peli

}