// =======================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS LIMPIO
// FIREBASE + OFERTAS PUBLICAS
// =======================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
query,
orderBy,
onSnapshot

}

from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// CONFIG FIREBASE


const firebaseConfig = {


apiKey: "AIzaSyBo_wk-k8TrcSl0CMQz0hoUCvAKre94hW0",

authDomain: "patronofertasweb.firebaseapp.com",

projectId: "patronofertasweb",

storageBucket: "patronofertasweb.firebasestorage.app",

messagingSenderId: "292338334268",

appId: "1:292338334268:web:9dbbafe00dd23ebb72e139"


};





const app =
initializeApp(firebaseConfig);



const db =
getFirestore(app);







const carrusel =
document.getElementById("carrusel");








// CARGAR OFERTAS EN TIEMPO REAL


function cargarOfertas(){



const referencia =
collection(db,"ofertas");



const consulta =
query(

referencia,

orderBy(
"fecha",
"desc"

)

);





onSnapshot(

consulta,

(snapshot)=>{


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



},

(error)=>{


console.error(error);



carrusel.innerHTML=`

<div class="loader">

Error conectando Firebase

</div>

`;


}



);



}









// CREAR TARJETA


function crearTarjeta(oferta){



const tarjeta =
document.createElement("div");



tarjeta.className="oferta";



tarjeta.innerHTML=`


<img

src="${oferta.imagen || 'logo.png'}"

>




<div class="info">



<span class="descuento">

${oferta.descuento || "OFERTA"}

</span>





<h3>

${oferta.titulo}

</h3>





<p class="precioAntes">

$${oferta.precioAntes || ""}

</p>





<div class="precioFinal">

$${oferta.precioFinal}

</div>





<a

class="btnComprar"

href="${oferta.link}"

target="_blank"

>

🛒 COMPRAR

</a>





</div>


`;





carrusel.appendChild(tarjeta);



}









// INICIAR


cargarOfertas();