// =====================================================
// EL PATRÓN DE LAS OFERTAS
// ESTADISTICAS.JS
// SISTEMA AVANZADO
// =====================================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
doc,
setDoc,
getDoc,
collection,
getDocs,
increment,
addDoc,
serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



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


return new Date()

.toLocaleString(
"sv-SE",
{
timeZone:"America/Mexico_City"
}

)

.split(" ")[0];


}




function horaCDMX(){


return new Date()

.toLocaleString(
"es-MX",
{
timeZone:"America/Mexico_City",
hour:"2-digit",
minute:"2-digit"
}

);


}




// ==============================
// REGISTRAR VISITA
// ==============================


async function registrarVisita(){


const fecha =
fechaCDMX();



const hora =
horaCDMX();





// TOTAL GENERAL


await setDoc(

doc(
db,
"estadisticas",
"visitas"
),

{

total:
increment(1)

},

{

merge:true

}

);





// DIARIO


await setDoc(

doc(
db,
"estadisticas_diarias",
fecha
),

{

visitas:
increment(1),

fecha:fecha

},

{

merge:true

}

);





// MENSUAL


const mes =
fecha.substring(0,7);



await setDoc(

doc(
db,
"estadisticas_mensuales",
mes
),

{

visitas:
increment(1),

mes:mes

},

{

merge:true

}

);





// HISTORIAL


await addDoc(

collection(
db,
"visitas_historial"
),

{

fecha:fecha,

hora:hora,

creado:
serverTimestamp()

}

);



}



registrarVisita();
// =====================================================
// CARGAR ESTADISTICAS EN ADMIN
// =====================================================


async function cargarEstadisticas(){


const hoy =
fechaCDMX();


const mes =
hoy.substring(0,7);




// ==============================
// VISITAS HOY
// ==============================


const hoyDoc =
await getDoc(

doc(
db,
"estadisticas_diarias",
hoy

)

);



if(
document.getElementById("visitasHoy")
){

visitasHoy.innerHTML =

hoyDoc.exists()

?

hoyDoc.data().visitas || 0

:

0;

}






// ==============================
// VISITAS MES
// ==============================


const mesDoc =
await getDoc(

doc(
db,
"estadisticas_mensuales",
mes

)

);



if(
document.getElementById("visitasMes")
){

visitasMes.innerHTML =

mesDoc.exists()

?

mesDoc.data().visitas || 0

:

0;

}







// ==============================
// MEJOR DIA
// ==============================


const dias =
await getDocs(

collection(
db,
"estadisticas_diarias"

)

);



let mayor=0;

let dia="-";



dias.forEach(d=>{


const datos=d.data();



if(
datos.visitas > mayor
){

mayor =
datos.visitas;


dia =
d.id;


}


});





if(
document.getElementById("diaMayor")
){

diaMayor.innerHTML =

dia+" ("+mayor+")";


}







// ==============================
// HORA PICO
// ==============================


const historial =
await getDocs(

collection(
db,
"visitas_historial"

)

);



let horas={};



historial.forEach(v=>{


const h =
v.data().hora;



if(h){

horas[h] =
(horas[h] || 0)+1;

}


});




let horaMax="-";

let cantidad=0;



Object.keys(horas)

.forEach(h=>{


if(
horas[h]>cantidad
){

cantidad=
horas[h];


horaMax=h;

}


});





if(
document.getElementById("horaPico")
){

horaPico.innerHTML=

horaMax+" ("+cantidad+")";


}



}




cargarEstadisticas();

// =====================================================
// GRAFICA VISITAS
// =====================================================


let graficaVisitas;



async function crearGraficaVisitas(){


const canvas =
document.getElementById("graficaVisitas");



if(!canvas)return;





const datos =
await getDocs(

collection(
db,
"estadisticas_diarias"

)

);





let fechas=[];

let visitas=[];




datos.forEach(d=>{


fechas.push(d.id);


visitas.push(
d.data().visitas || 0
);


});





// ordenar fechas


let ordenado =
fechas
.map((f,i)=>({

fecha:f,

visitas:visitas[i]

}))


.sort((a,b)=>


a.fecha.localeCompare(
b.fecha
)

);





fechas =
ordenado.map(x=>x.fecha);



visitas =
ordenado.map(x=>x.visitas);







if(graficaVisitas){

graficaVisitas.destroy();

}





graficaVisitas = new Chart(

canvas,

{


type:"line",


data:{


labels:fechas,


datasets:[{


label:"Visitas",

data:visitas,


borderWidth:3,


tension:.4


}]


},



options:{


responsive:true,


plugins:{


legend:{


display:true

}


},



scales:{


y:{


beginAtZero:true

}


}



}



}

);




}




crearGraficaVisitas();