// =====================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS PRO
// PUBLICAR + LISTAR OFERTAS
// =====================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,

collection,

addDoc,

getDocs,

orderBy,

query,

serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";







// CONFIG FIREBASE

const firebaseConfig = {


apiKey:"TU_API_KEY",

authDomain:"TU_PROYECTO.firebaseapp.com",

projectId:"TU_PROJECT_ID",

storageBucket:"TU_STORAGE_BUCKET",

messagingSenderId:"TU_SENDER_ID",

appId:"TU_APP_ID"


};







const app = initializeApp(firebaseConfig);



const db = getFirestore(app);









// ELEMENTOS


const boton =

document.getElementById("publicar");



const lista =

document.getElementById("listaOfertas");



const total =

document.getElementById("totalOfertas");









// PUBLICAR OFERTA


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







document
.querySelectorAll("input")
.forEach(

(input)=>{

input.value="";

}

);






cargarOfertasAdmin();







boton.innerHTML=

"🔥 PUBLICAR OFERTA";






}

catch(error){


console.error(error);



alert(

"Error al publicar"

);



boton.innerHTML=

"🔥 PUBLICAR OFERTA";


}





});









// CARGAR OFERTAS ADMIN


async function cargarOfertasAdmin(){



try{


const q = query(

collection(db,"ofertas"),

orderBy("fecha","desc")

);



const snapshot =

await getDocs(q);





lista.innerHTML="";



let contador=0;





snapshot.forEach((doc)=>{


contador++;



const o =
doc.data();




lista.innerHTML += `



<div class="ofertaAdmin">


<h3>

${o.titulo}

</h3>


<p>

💰 $${o.precioFinal}

</p>


<p>

${o.descuento || ""}

</p>



<a href="${o.link}"

target="_blank">

Ver producto

</a>



</div>



`;



});






if(total){

total.innerHTML=contador;

}



if(contador===0){


lista.innerHTML=

"Sin ofertas publicadas";


}



}



catch(error){


console.error(error);



lista.innerHTML=

"Error cargando ofertas";


}



}









// SALIR

const salir =

document.getElementById("salir");



if(salir){


salir.onclick=()=>{


window.location.href="login.html";


};



}







// INICIAR


cargarOfertasAdmin();