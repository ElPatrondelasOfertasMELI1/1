// =====================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS - PARTE 6
// PUBLICAR EN FIRESTORE
// =====================================


import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,

collection,

addDoc,

serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// CONFIGURACIÓN FIREBASE
// CAMBIA POR LOS DATOS DE TU PROYECTO


const firebaseConfig = {


apiKey:"TU_API_KEY",

authDomain:"TU_PROYECTO.firebaseapp.com",

projectId:"TU_PROJECT_ID",

storageBucket:"TU_STORAGE_BUCKET",

messagingSenderId:"TU_SENDER_ID",

appId:"TU_APP_ID"


};






// INICIAR FIREBASE


const app =
initializeApp(firebaseConfig);



const db =
getFirestore(app);








// BOTÓN PUBLICAR


const boton =
document.getElementById("publicar");





boton.addEventListener(
"click",
async()=>{


const titulo =
document.getElementById("titulo").value;


const imagen =
document.getElementById("imagen").value;


const precioAntes =
document.getElementById("precioAntes").value;


const precioFinal =
document.getElementById("precioFinal").value;


const descuento =
document.getElementById("descuento").value;


const link =
document.getElementById("link").value;






// VALIDACIÓN


if(
!titulo ||
!imagen ||
!precioFinal ||
!link
){


alert(
"Completa los campos obligatorios"
);


return;


}







try{



boton.innerHTML=
"PUBLICANDO...";





await addDoc(

collection(db,"ofertas"),

{


titulo,

imagen,

precioAntes,

precioFinal,

descuento,

link,


fecha:
serverTimestamp(),


activo:true


}


);





alert(
"🔥 Oferta publicada correctamente"
);






// LIMPIAR FORMULARIO


document.querySelectorAll(
"input"
)

.forEach(
(input)=>input.value=""
);



boton.innerHTML=
"🔥 PUBLICAR OFERTA";





}

catch(error){



console.error(error);



alert(
"Error al publicar oferta"
);



boton.innerHTML=
"🔥 PUBLICAR OFERTA";


}




});