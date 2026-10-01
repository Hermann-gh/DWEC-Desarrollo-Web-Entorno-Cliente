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
const id = crypto.randomUUID(); //Creamos un identificador unico para la sesion
const parametros = new URLSearchParams(window.location.search); //Nos permite trabajar con los parametros
//Buscamos los parametros concretos que queremos y los guardamos.
const usuario = parametros.get('usuario') || 'Cliente VIP'; //Usamos operador OR en caso de estar vacio
const rol = parametros.get('rol') || 'cliente';
const correo = parametros.get('correo') || 'cliente@urbanstyle.es';
const membresia = parametros.get('membresia') || 'Básica'

//Sanitacion del correo
const correoLimpio = correo.trim().toLowerCase();
const partesCorreo = correoLimpio.split('@'); //Metodo para separar desde '@'
const nombreUsuario = partesCorreo[0]; //Usamos la primera parte
const dominio = partesCorreo[1]; //Usamos la segunda

const idCliente = parametros.get('id') || '0'; //Guardamo su id o en su defecto 0
//Formateamos el numero para que tenga 6 digitos de longitud y el caracter a añadir sea 0.
const idClienteFormateado = idCliente.padStart(6,'0');
//Usamos doble ?? para decir si es null usa el valor que hemos establecido 2, para que 0 no sea null.
const regalos = parametros.get('regalos') ?? 2; 

//==CATALOGO==

const productos = [
    { nombre: 'Camiseta Urban', precio: '19.99€' },
    { nombre: 'Chaqueta Denim', precio: '59.90€' },
    { nombre: 'Zapatos Urban', precio: '69.99€' },
    { nombre: 'Cinturon', precio: '24.99€' },
    { nombre: 'Pantalon roturas', precio: '25.99€' },
    { nombre: 'Pantalon desgastado', precio: '30.99€' }
];

let subtotal = 0;

const contenedorProductos = document.getElementById('productos');//Señalamos el elemento HTML de productos

for (const producto of productos) {
    const precioTexto = producto.precio;
    const precio = parseFloat(precioTexto); // Formateamos a numero
    //Comprobamos si es precio un numero valido
    if (!Number.isFinite(precio)) {
        console.log("Precio no valido");
        continue;
    }
    const elementoProducto = document.createElement('p'); //Creamos elemento por producto con parrafo
    elementoProducto.textContent = `${producto.nombre} - ${producto.precio}`; //Introducimos valores
    contenedorProductos.appendChild(elementoProducto);//Añade los elementos al contenedor
    subtotal += precio;
}

//Funcion para formatear cantidades en euros
function formatearEuro(cantidad) {
    return cantidad.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR'
    });
}

document.getElementById('subtotal').textContent = formatearEuro(subtotal);

//==LOGICA PAGO==
const cuponTexto = "10€";
const cupon = parseFloat(cuponTexto);

document.getElementById('cupon').textContent = formatearEuro(cupon);

const baseImponible = subtotal - cupon;
const iva = baseImponible * 21 / 100; //Calculamos el IVA sobre la base ya que ahi estaria restado el cupon

document.getElementById('iva').textContent = formatearEuro(iva);

const total = baseImponible + iva;

document.getElementById('total').textContent = formatearEuro(total);

let numeroPedido = 1; //Esta vez sera let para poder modficarse
const botonCompra = document.getElementById('btn-compra');
const mensajePedido = document.getElementById('mensaje-pedido');

botonCompra.addEventListener('click', () => {
    mensajePedido.textContent = `Pedido nº ${numeroPedido} realizado correctamente.`;
    numeroPedido++;
});

//Promocion relampago
let temporizador = null;
//Funcion para ejecutar la promocion
function activarOferta(){
    //Si temporizador es distinto a null no creamos otro
    if (temporizador !== null){
        return;
    }
    let segundos = 15;
    temporizador = setInterval(() => {
        segundos--;
        //Enlazamos con contador del HTML y mostramos los segundos.
        document.getElementById('contador').textContent = segundos;
        //Si es cero limpiamos el "repetidor" y ponemos null el temporizador para poder activarlo
        if(segundos === 0){
            clearInterval(temporizador);
            temporizador = null;
            alert('Oferta terminada');
        }
    }, 1000);
}

document.getElementById('btn-oferta').addEventListener('click', activarOferta);

//==FORMULARIO==

//Variable para guardar el formulario
let buzon = []; //Creamos array para guardar las opiniones

//Intetamos recuperar las opiniones 
try {
    const opinionesGuardadas = localStorage.getItem('buzon');
    if (opinionesGuardadas) {
    buzon = JSON.parse(opinionesGuardadas);
}
//Si ocurre un error, evitamos que la aplicacion se detenga
} catch (error) {
    console.log('No se han podido recuperar las opiniones');
}

//Variable para señalar el formulario
const formularioOpinion = document.getElementById('form-opinion');

formularioOpinion.addEventListener('submit', (evento) => {
    //Evitamos que se recargue la pagina al enviarlo
    evento.preventDefault();
    //Optenemos el comentario escrito por el usuario
    const comentario = document.getElementById('comentario').value.trim();
    //Creamos identificar de comentario usando fecha actual
    const idOpinion = Date.now();
    //Creamos objeto que llevara todo lo necesario
    const opinion = {
    id: idOpinion,
    usuario: usuario,
    fecha: new Date().toLocaleString('es-ES'),
    comentario: comentario
    };
    //Añadimos la opinion al buzom
    buzon.push(opinion);
    //Mostramos la opnion aunque sea nueva
    mostrarOpinion(opinion);
    //Limpiamos el campo de comentario despues de enviarlo
    document.getElementById('comentario').value = '';
    //Intentamos guardar las opiniones en el almacenamiento
    try {
    //Guardamos el buzon en localStorage, tendremos que convertirlo primero a String
    localStorage.setItem('buzon', JSON.stringify(buzon));
    } catch (error) {
        console.log('No se han podido guardar las opiniones');
    }
});

//Variable para señalar la lista
const listaOpiniones = document.getElementById('lista-opiniones');

//Funcion para mostrar las opniones en pantalla
function mostrarOpinion(opinion) {
    //Creamos un elemento div para cada opinion
    const elementoOpinion = document.createElement('div');
    //Introducimos los datos de la opinion como texto
    elementoOpinion.textContent = `${opinion.usuario} - ${opinion.fecha}: ${opinion.comentario}`;
    //Añadimos la opnion a la lista
    listaOpiniones.appendChild(elementoOpinion);
}

for( const opinion of buzon) {
    //pasamos la funcion por cada opinion
    mostrarOpinion(opinion);
}

