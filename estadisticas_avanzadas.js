// =====================================================
// EL PATRÓN DE LAS OFERTAS
// ESTADISTICAS AVANZADAS.JS LIMPIO PRO
// SOLO PANEL ADMIN
// =====================================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
getDocs

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// ==============================
// FIREBASE
// ==============================


const firebaseConfig={


apiKey:"AIzaSyBo_wk-k8TrcSl0MQzQ0hoUCvAKre94hW0",

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






// =====================================================
// CARGAR RESUMEN AVANZADO
// =====================================================


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


const datos=item.data();




const visitas =

datos.visitas || 0;




totalMes += visitas;






if(visitas > mayor){


mayor = visitas;


mejorDia = item.id;


}






Object.keys(datos)

.filter(

x=>x.startsWith("hora_")

)

.forEach(h=>{


horas[h] =

(horas[h] || 0) +

datos[h];


});



});









Object.keys(horas)

.forEach(h=>{


if(horas[h] > horaMayor){


horaMayor = horas[h];


}


});









// ==============================
// MOSTRAR EN ADMIN
// ==============================



const visitasMes =

document.getElementById(
"visitasMes"
);



const diaMayor =

document.getElementById(
"diaMayor"
);



const horaPico =

document.getElementById(
"horaPico"
);






if(visitasMes)

visitasMes.innerHTML =

totalMes;





if(diaMayor)

diaMayor.innerHTML =

mejorDia+" ("+mayor+")";






if(horaPico)

horaPico.innerHTML =

horaMayor+" visitas";




}









// ==============================
// INICIO
// ==============================


cargarResumen();



// =====================================================
// FIN ESTADISTICAS AVANZADAS.JS
// =====================================================