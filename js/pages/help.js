const inputNombre = document.getElementById('nombre');
const inputEmail = document.getElementById('email');
const inputTexto = document.getElementById('texto');
const mensajesForm = document.getElementById('sec-cine-result');
const msjFormEnviado = document.getElementById('msjFormEnviado');
const msjErrorEmail = document.getElementById('msjErrorEmail');
const msjErrorTexto = document.getElementById('msjErrorTexto');

function eliminarMensajeForm(mensaje) {
    mensajesForm.style.display = 'none';
    mensaje.style.display = 'none';
}

function mostrarMensajeForm(mensaje) {
    mensajesForm.style.display = 'flex';
    mensaje.style.display = 'block';
    setTimeout(eliminarMensajeForm, 5000, mensaje);
}

function validoEmail() {
    let expRegularEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar el formato del email

    return expRegularEmail.test(inputEmail.value); //devuelve true si el email cumple con el formato o false si no
}

function validoMensaje() {
    if (inputTexto.value === '') { //si el Mensaje está vacío, devuelve falso, o sino true
        return false
    } else {
        return true
    }
}

(function () {
    // https://dashboard.emailjs.com/admin/account
    emailjs.init('2d4xlBTLv0WCSBe8G');
})();

window.onload = function () { //funcion que envia un email con los datos del form mediante EmailJS
    document.getElementById('contact-form').addEventListener('submit', function (event) {
        event.preventDefault();
        // generate a five digit number for the contact_number variable
        this.contact_number.value = Math.random() * 100000 | 0;
        // these IDs from the previous steps
        if (validoEmail() && validoMensaje()) {
            emailjs.sendForm('contact_service', 'contact_form', this)
                .then(function () {
                    console.log('SUCCESS!');
                    mostrarMensajeForm(msjFormEnviado);
                    window.scrollTo({ top: 800, behavior: 'smooth' }); //baja la vista para que el usuario vea el mensaje
                }, function (error) {
                    console.log('FAILED...', error);
                });
        } else {
            if (!validoEmail()) {
                mostrarMensajeForm(msjErrorEmail);
            } else {
                mostrarMensajeForm(msjErrorTexto);
            }
            window.scrollTo({ top: 800, behavior: 'smooth' }); //baja la vista hacia el bottom para que el usuario vea el mensaje
        }
    });
}