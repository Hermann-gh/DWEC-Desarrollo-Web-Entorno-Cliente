'use strict'

//Variables
const idioma = navigator.language; //Capturamos idioma
const conexion = navigator.onLine; //Capturamos booleano si esta conectado o no
const fecha = new Date(); //Capturamos fecha
const id = crypto.randomUUID(); //Creamos numero random encriptado
const parametros = new URLSearchParams(window.location.search); //Nos permite trabajar con los parametros
//Buscamos los parametros concretos que queremos y los guardamos.
const usuario = parametros.get('usuario') || 'invitado'; //Usamos operador OR en caso de estar vacio
const rol = parametros.get('rol') || 'cliente';
const correo = parametros.get('correo') || 'cliente@urbanstyle.es';

//Sanitacion del correo
const correoLimpio = correo.trim().toLocaleLowerCase();
const partesCorreo = correoLimpio.split('@'); //Metodo para separar desde '@'
const nombreUsuario = partesCorreo[0]; //Usamos la primera parte
const dominio = partesCorreo[1]; //Usamos la segunda
