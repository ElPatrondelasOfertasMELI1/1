// =====================================================
// EL PATRÓN DE LAS OFERTAS
// ESTADISTICAS.JS
// VISITAS + CLICS + COPIAS + MÉTRICAS
// =====================================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
doc,
setDoc,
getDoc,
increment,
collection,
getDocs

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// ==============================
// FIREBASE
// ==============================


const firebaseConfig={

apiKey:"AIzaSyBo_wk-k8TrcSl0CMQz0hoUCvAKre94hW0",

authDomain:"patronofertasweb.firebaseapp.com",

projectId:"patronofertasweb",

storageBucket:"patronofertasweb.firebasestorage.app",

messagingSenderId:"292338334268",

appId:"1:292338334268:web:9dbbafe00dd23ebb72e139"

};


const app =
initializeApp(firebaseConfig);


const db =
getFirestore(app);




// ==============================
// FECHA CDMX
// ==============================


function fechaCDMX(){


return new Intl.DateTimeFormat(
"en-CA",
{
timeZone:"America/Mexico_City"
}

).format(new Date());


}



function horaCDMX(){


return new Intl.DateTimeFormat(
"es-MX",
{
hour:"2-digit",
hour12:false,
timeZone:"America/Mexico_City"
}

).format(new Date());


}





// ==============================
// REGISTRAR VISITA
// ==============================


async function registrarVisita(){


const fecha =
fechaCDMX();


const hora =
horaCDMX();



await setDoc(

doc(
db,
"estadisticas",
"visitas"
),

{


total:
increment(1),


[fecha]:
increment(1),


[`hora_${hora}`]:
increment(1)


},

{

merge:true

}

);



}





registrarVisita();








// ==============================
// CARGAR ESTADISTICAS ADMIN
// ==============================


async function cargarEstadisticas(){



const visitasRef =
doc(
db,
"estadisticas",
"visitas"
);



const visitas =
await getDoc(visitasRef);




if(!visitas.exists())

return;



const datos =
visitas.data();




// TOTAL VISITAS


if(
document.getElementById("totalVisitas")
){

totalVisitas.innerHTML =
datos.total || 0;

}





// VISITAS HOY


const hoy =
fechaCDMX();



if(
document.getElementById("visitasHoy")
){

visitasHoy.innerHTML =
datos[hoy] || 0;

}






// HORA MÁS FUERTE


let mayorHora=0;

let horaGanadora="";



Object.keys(datos)

.forEach(x=>{


if(
x.includes("hora_")
){

if(datos[x]>mayorHora){

mayorHora=
datos[x];


horaGanadora=
x.replace(
"hora_",
""
);


}

}


});




if(
document.getElementById("horaPico")
){

horaPico.innerHTML =
horaGanadora+
":00";

}





// DÍA MÁS FUERTE


let mayorDia=0;

let diaGanador="";



Object.keys(datos)

.forEach(x=>{


if(
x.match(/^\d{4}-\d{2}-\d{2}$/)
){


if(datos[x]>mayorDia){


mayorDia=
datos[x];


diaGanador=
x;


}


}


});




if(
document.getElementById("diaFuerte")
){

diaFuerte.innerHTML =
diaGanador;

}



}





// ==============================
// COPIAS DE CUPONES
// ==============================


async function cargarCopias(){



const datos =
await getDocs(

collection(
db,
"cupones"
)

);



let total=0;



datos.forEach(c=>{


total +=
c.data().copias || 0;


});



if(
document.getElementById("totalCopias")
){

totalCopias.innerHTML =
total;

}



}





// ==============================
// CLICS OFERTAS
// ==============================


async function cargarClics(){



const datos =
await getDocs(

collection(
db,
"ofertas"
)

);



let total=0;



datos.forEach(o=>{


total +=
o.data().clics || 0;


});



if(
document.getElementById("totalClics")
){

totalClics.innerHTML =
total;

}


}





// ==============================
// INICIO
// ==============================


cargarEstadisticas();

cargarCopias();

cargarClics();



// ACTUALIZA CADA MINUTO


setInterval(()=>{


cargarEstadisticas();

cargarCopias();

cargarClics();



},60000);