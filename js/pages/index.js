const contenedorPeliculas = document.getElementById('contenedorPeliculas'); //guardo el contenedor de peliculas
const inputCodigo = document.getElementById('codigoPeli'); //guardo el input para ingresar codigo pelicula
const btnAnterior = document.getElementById('btnAnterior');
const seccionMensajes = document.getElementById('sec-messages');
const msjExito = document.getElementById('msjExito');
const msjErrorConsulta = document.getElementById('msjErrorConsulta');
const msjErrorNumerico = document.getElementById('msjErrorNumerico');
const msjPeliExistente = document.getElementById('msjPeliExistente');
let pagina = 1; //pagina en la que estoy (para paginacion)

function statusBtnAnterior(pag) {
    if (pag > 1) {
        btnAnterior.disabled = false; //habilito el boton Anterior (paginacion) si estoy en paginas siguientes a la primera
        btnAnterior.classList.remove('btnDisabled');
    } else if (pag === 1) {
        btnAnterior.disabled = true; //si estoy en la primera página, deshabilito el boton Anterior (paginacion)
        btnAnterior.classList.add('btnDisabled');
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

    fetch('https://api.themoviedb.org/3/movie/now_playing?language=es-MX&page=' + pagina.toString(), options)
        .then(response => response.json())
        .then(response => {
            eliminarSpinner(); //elimino el mensaje de carga porque pude solicitar las pelis (ver common.js)
            console.log(response);

            for (let i = 0; i < response.results.length; i++) {
                pelicula = response.results[i];
                let poster_path = pelicula.poster_path;
                let title = pelicula.title;
                let id = pelicula.id;
                let original_title = pelicula.original_title;
                let original_language = pelicula.original_language;
                let release_date = pelicula.release_date;

                const divPelicula = document.createElement('div');
                divPelicula.classList.add('pelicula');
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
            const errorAPI = document.createElement('p');
            errorAPI.classList.add('mensaje-error', 'mensajes');
            errorAPI.id = 'msjErrorApi';
            errorAPI.innerText = 'Error al cargar las películas. Intente nuevamente...';
            seccionMensajes.appendChild(errorAPI);
            seccionMensajes.style.display = 'flex';
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

function eliminarMensaje(mensaje) {
    seccionMensajes.style.display = 'none';
    mensaje.style.display = 'none';
}

function mostrarMensaje(mensaje) {
    seccionMensajes.style.display = 'flex';
    mensaje.style.display = 'block';
    setTimeout(eliminarMensaje, 5000, mensaje);

}

function traerFavoritosLocal() {
    let favs = localStorage.getItem('FAVORITOS');
    if (favs) {
        return JSON.parse(favs)
    } else {
        favs = []
        return favs
    }
}

function guardarFavoritosLocal(favs) {
    localStorage.setItem('FAVORITOS', JSON.stringify(favs));
}

function validar_y_Agregar_Peli(id, favoritos) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNGMzYzVmYTllZDg0NjRlOTg1YjAzZGJiNTM3ZGE1ZCIsInN1YiI6IjY0YTYxOGVmMDdmYWEyMDBjN2ViYjI2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0lBSp1tL3aze0-IU_LRIwpUfqohZKdOzEiPy5xaHU0'
        }
    };

    fetch('https://api.themoviedb.org/3/movie/' + id.toString() + '?language=es-MX&append_to_response=' + id.toString(), options)
        .then(response => {
            if (response.ok) {
                favoritos.push(id);
                guardarFavoritosLocal(favoritos);
                console.log(favoritos);
            } else {
                mostrarMensaje(msjErrorConsulta);
            }
        })
        .catch(error => {
            console.error(error);
            mostrarMensaje(msjErrorConsulta);
        });

}

function validarRepeticionFav(favoritos) {
    if (favoritos !== null) {
        for (let i = 0; i < favoritos.length; i++) {
            if (codigo === favoritos[i]) { //valido que la película ya no haya sido ingresada
                mostrarMensaje(msjPeliExistente);
                return //salgo de la función si hay error
            }
        }
    }
}

function agregarFav_codigo() { //agrega una pelicula a Favoritos ingresando el codigo
    let codigo = inputCodigo.value; //capturo el codigo ingresado por usuario

    if (isNaN(codigo) || codigo === '') { //valido que el valor sea numerico
        mostrarMensaje(msjErrorNumerico);
        return //salgo de la función si hay error
    }
    let favoritos = traerFavoritosLocal();
    validarRepeticionFav(favoritos);
    validar_y_Agregar_Peli(codigo, favoritos);
}

function agregarFav_boton() { //agrega una pelicula a Favoritos tocando el boton debajo de la peli

}