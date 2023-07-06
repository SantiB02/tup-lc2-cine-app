const divsPelicula = document.getElementsByClassName('pelicula'); //guardo el div de cada pelicula (4)
const inputCodigo = document.getElementById('codigoPeli'); //guardo el input para ingresar codigo pelicula

function requestCartelera() {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNGMzYzVmYTllZDg0NjRlOTg1YjAzZGJiNTM3ZGE1ZCIsInN1YiI6IjY0YTYxOGVmMDdmYWEyMDBjN2ViYjI2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0lBSp1tL3aze0-IU_LRIwpUfqohZKdOzEiPy5xaHU0'
        }
    };

    fetch('https://api.themoviedb.org/3/movie/now_playing?language=es&page=1', options)
        .then(response => response.json())
        .then(response => {
            eliminarSpinner(); //elimino el mensaje de carga porque pude solicitar las pelis (ver common.js)

            for (let i = 0; i < 4; i++) {
                //console.log(response); test para ver el objeto devuelto por la API
                pelicula = response.results[i]
                let poster_path = pelicula.poster_path
                let title = pelicula.title
                let id = pelicula.id
                let original_title = pelicula.original_title
                let original_language = pelicula.original_language
                let release_date = pelicula.release_date

                divsPelicula[i].innerHTML = `
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
            }
        })
        .catch(error => {
            console.error(error);
        });
}

setTimeout(requestCartelera, 3000); //espera 3 segundos hasta hacer request a la API, para que llegue a mostrarse el spinner de carga

function agregarFav_codigo() { //agrega una pelicula a Favoritos ingresando el codigo
    codigo = inputCodigo.value;
}

function agregarFav_boton() { //agrega una pelicula a Favoritos tocando el boton debajo de la peli

}