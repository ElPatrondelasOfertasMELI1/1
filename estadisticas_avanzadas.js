// =====================================================
// EL PATRÓN DE LAS OFERTAS
// ESTADISTICAS AVANZADAS.JS
// =====================================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
doc,
getDoc,
setDoc,
collection,
getDocs,
increment

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


return new Date()

.toLocaleString(

"en-US",

{

timeZone:"America/Mexico_City"

}

);

}





function diaActual(){


const fecha =
new Date(fechaCDMX());


return fecha

.toISOString()

.split("T")[0];

}





function horaActual(){


const fecha =
new Date(fechaCDMX());


return fecha.getHours();

}








// ==============================
// REGISTRAR VISITA AVANZADA
// ==============================


async function registrarEstadistica(){


const dia =
diaActual();


const hora =
horaActual();




await setDoc(

doc(

db,

"estadisticas_diarias",

dia

),

{


visitas:
increment(1),


[`hora_${hora}`]:
increment(1),


fecha:dia


},


{


merge:true


}

);






// MENSUAL


const mes =
dia.substring(0,7);



await setDoc(

doc(

db,

"estadisticas_mensuales",

mes

),

{


visitas:
increment(1)


},


{


merge:true


}

);



}





registrarEstadistica();








// ==============================
// MOSTRAR DATOS EN ADMIN
// ==============================


async function cargarResumen(){



const dias =
await getDocs(

collection(

db,

"estadisticas_diarias"

)

);



let totalMes=0;

let mejorDia="-";

let mayor=0;

let horaMayor=0;

let horas={};






dias.forEach(item=>{


const d=item.data();



totalMes += d.visitas || 0;



if((d.visitas || 0)>mayor){


mayor=d.visitas;

mejorDia=item.id;


}




Object.keys(d)

.filter(x=>x.includes("hora_"))

.forEach(h=>{


horas[h]=
(horas[h] || 0)+d[h];


});



});






Object.keys(horas)

.forEach(h=>{


if(horas[h]>horaMayor){


horaMayor=horas[h];


}


});






const visitasMes =
document.getElementById("visitasMes");


const diaMayor =
document.getElementById("diaMayor");


const horaPico =
document.getElementById("horaPico");




if(visitasMes)

visitasMes.innerHTML =
totalMes;



if(diaMayor)

diaMayor.innerHTML =
mejorDia;



if(horaPico)

horaPico.innerHTML =
horaMayor+" visitas";



}





// ==============================
// INICIO
// ==============================


cargarResumen();
