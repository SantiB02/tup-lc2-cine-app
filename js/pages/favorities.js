const contenedorPeliculasFavoritas = document.getElementById('contenedorPeliculasFavoritas');
const mensajesFavoritos = document.getElementById('messages-fav');
const msjEmptyFavs = document.getElementById('msjEmptyFavs');

function eliminarMensajeFavoritos(mensaje) {
    mensajesFavoritos.style.display = 'none';
    mensaje.style.display = 'none';
}

function mostrarMensajeFavoritos(mensaje) {
    mensajesFavoritos.style.display = 'flex';
    mensaje.style.display = 'block';
    setTimeout(eliminarMensajeFavoritos, 5000, mensaje);
}

function mostrarMensajeFavPersistente(mensaje) {
    mensajesFavoritos.style.display = 'flex';
    mensaje.style.display = 'block';
}

function agregarVideosFav() { //agrega un video a cada pelicula de favoritos
    let divsPelisFav = Array.from(contenedorPeliculasFavoritas.children).filter(function (elemento) { //selecciona sólo los div que son hijos directos, no los internos
        return elemento.tagName === 'DIV';
    });

    // Iterar sobre los divs y encontrar el elemento con el valor deseado
    divsPelisFav.forEach(function (div) {
        console.log(div);
        let idFavorita = div.getAttribute('data-id-fav');

        fetch('https://api.themoviedb.org/3/movie/' + idFavorita + '/videos?language=es-MX', options)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                if (response.results.length > 0) {
                    let YouTubeKey = response.results[0].key; //guardo la llave para acceder al video de YouTube
                    let iframe = div.querySelector('iframe');
                    iframe.style.display = 'block';
                    iframe.width = '340';
                    iframe.height = '200';
                    iframe.src = 'https://www.youtube-nocookie.com/embed/' + YouTubeKey; //armo el link con la key del video
                    iframe.title = 'YouTube video player';
                    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                    iframe.allowFullscreen = true;
                }
            })
            .catch(error => console.error(error));
    });
}

async function mostrarFavoritas() {
    mostrarSpinner(spinnerDivFavoritos); //muestro mensaje y spinner de carga
    let favoritos = traerFavoritosLocal();
    if (favoritos.length > 0) {
        for (let i = 0; i < favoritos.length; i++) { //recorro cada peli de FAVORITOS y la traigo con fetch

            try {
                const response = await fetch('https://api.themoviedb.org/3/movie/' + favoritos[i] + '?language=es-MX&append_to_response=' + favoritos[i], options);
                const pelicula = await response.json();
                console.log(pelicula);
                contenedorPeliculasFavoritas.style.display = 'none'; //oculto el contenedor para que se solo se vea el spinner

                let poster_path = pelicula.poster_path;
                let title = pelicula.title;
                let id = pelicula.id;
                let original_title = pelicula.original_title;
                let original_language = pelicula.original_language;
                let overview = pelicula.overview;

                const divPelicula = document.createElement('div');
                divPelicula.classList.add('pelicula');
                divPelicula.setAttribute('data-id-fav', id);
                divPelicula.innerHTML = `
                    <img class="poster" src="https://image.tmdb.org/t/p/w500/${poster_path}">
                    <h3 class="titulo">${title}</h3>
                    <div class="desc-pelicula">
                        <p><b>Código:</b> ${id}<br><br>
                        <b>Título original:</b> ${original_title}<br>
                        <b>Idioma original:</b> ${original_language}<br>
                        <b>Resumen:</b> ${overview}<br></p>
                    </div>
                    <div class="videosFav">
                    <iframe style="display: none;"></iframe>
                    </div>
                    <button class="button" onclick="quitarFav(this)">Quitar de Favoritos</button>
                `;
                contenedorPeliculasFavoritas.appendChild(divPelicula); //le agrego el div con la pelicula favorita al contenedor
            } catch (error) {
                console.error(error);
                mostrarMensajeFavoritos(msjErrorConsulta);
            }
        }
        eliminarSpinner(spinnerDivFavoritos, contenedorPeliculasFavoritas); //elimino el mensaje de carga porque pude solicitar las pelis (ver common.js) y muestro pelis
        agregarVideosFav(); //le agrego un video a cada peli favorita
    } else {
        eliminarSpinner(spinnerDivFavoritos, contenedorPeliculasFavoritas);
        setTimeout(mostrarMensajeFavPersistente, 3000, msjEmptyFavs);
    }
}

mostrarFavoritas(); //muestro las pelis favoritas guardadas en localStorage

function quitarFav(boton) {
    let divBorrar = boton.parentNode;
    let indiceBorrar = Array.from(contenedorPeliculasFavoritas.children).indexOf(divBorrar); //traigo qué número de hijo es el div dentro del contenedor
    let favoritos = traerFavoritosLocal(); //en common.js
    favoritos.splice(indiceBorrar, 1); //borro el id del arreglo de favoritos en la posicion de la peli a borrar
    guardarFavoritosLocal(favoritos);
    divBorrar.remove(); //borro la película a la que corresponde el boton Quitar
    console.log(favoritos); //test
    if (favoritos.length === 0) {
        mostrarMensajeFavPersistente(msjEmptyFavs);
    }
}