const contenedorPeliculas = document.getElementById('contenedorPeliculas'); //guardo el contenedor de peliculas
const inputCodigo = document.getElementById('codigoPeli'); //guardo el input para ingresar codigo pelicula
const btnAnterior = document.getElementById('btnAnterior');
const seccionMensajes = document.getElementById('sec-messages');
const msjExito = document.getElementById('msjExito');
const msjErrorConsulta = document.getElementById('msjErrorConsulta');
const msjErrorNumerico = document.getElementById('msjErrorNumerico');
const msjPeliExistente = document.getElementById('msjPeliExistente');
let idsCartelera = []
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
    mostrarSpinner(); //muestro mensaje y spinner de carga
    statusBtnAnterior(pagina); //habilito o deshabilito el boton anterior
    idsCartelera = [] //vacio el array de IDs para guardarle los de la cartelera actual

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
            console.log(response);
            contenedorPeliculas.style.display = 'none';

            for (let i = 0; i < response.results.length; i++) {
                pelicula = response.results[i];
                let poster_path = pelicula.poster_path;
                let title = pelicula.title;
                let id = pelicula.id;
                idsCartelera.push(id); //guardo cada ID en un array (para agregarFav_boton(boton))
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
                <button class="button" data-nro-peli="${i}" onclick="agregarFav_boton(this)">Agregar a Favoritos</button>
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
        })
        .finally(() => {
            eliminarSpinner(); //elimino el mensaje de carga porque pude solicitar las pelis (ver common.js)
          });
}

requestCartelera(); //solicita cartelera a la API de TMDB

function pasarPagina() {
    if (pagina <= 1000) {
        pagina += 1;
        requestCartelera(pagina);
    }
}

function volverPagina() {
    if (pagina > 1) {
        pagina -= 1;
        requestCartelera(pagina);
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

function validarRepeticionFav(codigo, favoritos) {
    if (favoritos !== null) {
        for (let i = 0; i < favoritos.length; i++) {
            if (codigo === favoritos[i]) { //valido que la película ya no haya sido ingresada
                mostrarMensaje(msjPeliExistente);
                return 0
            }
        }
    }
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
                mostrarMensaje(msjExito);
            } else {
                mostrarMensaje(msjErrorConsulta);
            }
        })
        .catch(error => {
            console.error(error);
            mostrarMensaje(msjErrorConsulta);
        });

}

function agregarFav_codigo() { //agrega una pelicula a Favoritos ingresando el codigo
    let codigo = inputCodigo.value; //capturo el codigo ingresado por usuario

    if (isNaN(codigo) || codigo === '') { //valido que el valor sea numerico
        mostrarMensaje(msjErrorNumerico);
        return //salgo de la función si hay error
    }
    let favoritos = traerFavoritosLocal();
    if (validarRepeticionFav(codigo, favoritos) !== 0) {
        validar_y_Agregar_Peli(codigo, favoritos);
    }
}

function agregarFav_boton(boton) { //agrega una pelicula a Favoritos tocando el boton debajo de la peli
    let nroPeli = boton.getAttribute('data-nro-peli'); //consigo el numero de peli segun el atributo personalizado del boton Agregar a Fav
    let idPeliClickeada = idsCartelera[nroPeli]; //me paro en el array con todos los IDs en la posicion del boton clickeado
    let favoritos = traerFavoritosLocal();
    if (validarRepeticionFav(idPeliClickeada, favoritos) !== 0) {
        validar_y_Agregar_Peli(idPeliClickeada, favoritos);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' }); //sube la vista hacia el top para que el usuario vea el mensaje
}