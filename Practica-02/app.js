'use strict'

//Variables de sesion
const idioma = navigator.language; //Capturamos idioma
const conexion = navigator.onLine; //Capturamos booleano si esta conectado o no
const fecha = new Date(); //Capturamos fecha
//Formateamos la fecha para que salga detallada
const fechaFormateada = fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
});
const id = crypto.randomUUID(); //Creamos numero random encriptado
const parametros = new URLSearchParams(window.location.search); //Nos permite trabajar con los parametros
//Buscamos los parametros concretos que queremos y los guardamos.
const usuario = parametros.get('usuario') || 'Cliente VIP'; //Usamos operador OR en caso de estar vacio
const rol = parametros.get('rol') || 'cliente';
const correo = parametros.get('correo') || 'cliente@urbanstyle.es';
const membresia = parametros.get('membresia') || 'Básica'

//Sanitacion del correo
const correoLimpio = correo.trim().toLocaleLowerCase();
const partesCorreo = correoLimpio.split('@'); //Metodo para separar desde '@'
const nombreUsuario = partesCorreo[0]; //Usamos la primera parte
const dominio = partesCorreo[1]; //Usamos la segunda

const idCliente = parametros.get('id') || '0'; //Guardamo su id o en su defecto 0
//Formateamos el numero para que tenga 6 digitos de longitud y el caracter a añadir sea 0.
const idClienteFormateado = idCliente.padStart(6,'0');
//Usamos doble ?? para decir si es null usa el valor que hemos establecido 2, para que 0 no sea null.
const regalos = parametros.get('regalos') ?? 2; 

//Catalogo
const precioTexto = "59.90€";
const precio = parseFloat(precioTexto);// Formateamos a numero
const subtotal = precio * cantidad;
const cuponTexto = "10€";
const cupon = parseFloat(cuponTexto);
const baseImponible = subtotal - cupon;
const iva = baseImponible * 21 / 100; //Calculamos el IVA sobre la base ya que ahi estaria restado el cupon
const total = baseImponible + iva;
const totalFormateado = total.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
});
let numeroPedido = 1; //Esta vez sera let para poder modficarse

//Comprobamos si es precio un numero valido
if (!Number.isFinite(precio)) {
    console.log("Precio no valido");
}



