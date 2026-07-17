// =====================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS FINAL
// FIREBASE + OFERTAS
// =====================================


// FIREBASE

import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,

collection,

getDocs,

orderBy,

query

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";






// CONFIGURACIÓN FIREBASE

const firebaseConfig = {


apiKey:"TU_API_KEY",

authDomain:"TU_PROYECTO.firebaseapp.com",

projectId:"TU_PROJECT_ID",

storageBucket:"TU_STORAGE_BUCKET",

messagingSenderId:"TU_SENDER_ID",

appId:"TU_APP_ID"


};





const app =
initializeApp(firebaseConfig);



const db =
getFirestore(app);









// =============================
// OFERTAS
// =============================


const carrusel =
document.getElementById("carrusel");





async function cargarOfertas(){


try{


const ref =
collection(db,"ofertas");



const q =
query(

ref,

orderBy("fecha","desc")

);



const snapshot =
await getDocs(q);




carrusel.innerHTML="";





if(snapshot.empty){


carrusel.innerHTML=`

<div class="loader">

No hay ofertas disponibles

</div>

`;


return;

}





snapshot.forEach((doc)=>{


const oferta =
doc.data();



crearTarjeta(oferta);



});



}

catch(error){



console.error(

"Error Firebase:",

error

);



carrusel.innerHTML=`

<div class="loader">

Error cargando ofertas

</div>

`;

}



}









function crearTarjeta(oferta){



const card =
document.createElement("div");



card.className="oferta";



card.innerHTML=`

<img src="${oferta.imagen || 'logo.png'}">



<div class="info">



<span class="descuento">

${oferta.descuento || "OFERTA"}

</span>




<h3>

${oferta.titulo || ""}

</h3>



<p class="precioAntes">

$${oferta.precioAntes || ""}

</p>




<div class="precioFinal">

$${oferta.precioFinal || ""}

</div>





<a 

class="btnComprar"

href="${oferta.link}"

target="_blank"

onclick="registrarClick()"


>

🛒 COMPRAR

</a>



</div>


`;




carrusel.appendChild(card);



}









// =============================
// CLICS
// =============================


window.registrarClick=function(){



let clicks =

localStorage.getItem("clicks") || 0;



clicks++;



localStorage.setItem(

"clicks",

clicks

);



};









// =============================
// CUPONES
// =============================


async function cargarCupones(){


const box =
document.getElementById("cupones");



if(!box)return;



try{


const snap =
await getDocs(

collection(db,"cupones")

);



box.innerHTML="";



let lista=[];




snap.forEach((doc)=>{


lista.push({

id:doc.id,

...doc.data()

});


});





// ORDEN POR COMPRA MINIMA


lista.sort((a,b)=>{


let A =
parseInt(a.minimo)||0;


let B =
parseInt(b.minimo)||0;



return A-B;


});





lista.forEach((c)=>{



box.innerHTML += `

<div class="cupon relampago">


<h3>

${c.id}

</h3>



<p>

${c.descuento || ""}

</p>



<p>

Mínimo:

${c.minimo || ""}

</p>



<button onclick="copiarCupon('${c.id}')">

📋 COPIAR CUPÓN

</button>


</div>


`;



});



}

catch(e){

console.log(
"Sin cupones todavía"
);

}


}









// =============================
// COPIAR CUPON
// =============================


window.copiarCupon=function(codigo){



navigator.clipboard.writeText(codigo);



const toast =
document.getElementById("toast");



if(toast){


toast.classList.add("show");



setTimeout(()=>{


toast.classList.remove("show");


},1500);



}




// después redirige

setTimeout(()=>{


window.open(

"https://mercadolibre.com.mx",

"_blank"

);


},1500);



};








// INICIO


cargarOfertas();


cargarCupones();