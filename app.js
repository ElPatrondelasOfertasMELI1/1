// =====================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS FINAL
// FIREBASE + OFERTAS + CUPONES
// =====================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,

collection,

getDocs,

query,

orderBy

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





const app = initializeApp(firebaseConfig);


const db = getFirestore(app);





// ==========================
// OFERTAS
// ==========================


const carrusel =
document.getElementById("carrusel");





async function cargarOfertas(){


try{


const ref =
collection(db,"ofertas");



const q =
query(

ref,

orderBy(
"fecha",
"desc"
)

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






snapshot.forEach(doc=>{


const oferta =
doc.data();



crearOferta(oferta);



});



}

catch(error){


console.error(error);



carrusel.innerHTML=`

<div class="loader">

Error cargando ofertas

</div>

`;

}


}








function crearOferta(oferta){


const card =
document.createElement("div");



card.className="oferta";



card.innerHTML=`


<img src="${oferta.imagen}">



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

href="${oferta.link}"

target="_blank"

class="btnComprar"

onclick="registrarClick()"

>

🛒 COMPRAR

</a>



</div>


`;



carrusel.appendChild(card);


}









// ==========================
// CONTADOR CLICS
// ==========================


window.registrarClick=function(){


let clicks =
localStorage.getItem("clicks") || 0;


clicks++;


localStorage.setItem(
"clicks",
clicks
);


};









// ==========================
// CUPONES
// ==========================


async function cargarCupones(){


const contenedor =
document.getElementById("cupones");


if(!contenedor)return;



try{


const snap =
await getDocs(

collection(db,"cupones")

);




contenedor.innerHTML="";



let cupones=[];




snap.forEach(doc=>{


cupones.push({

codigo:doc.id,

...doc.data()

});


});





// ordenar por compra mínima


cupones.sort((a,b)=>{


return (

Number(a.minimo || 0)

-

Number(b.minimo || 0)

);


});








cupones.forEach(c=>{



contenedor.innerHTML += `


<div class="cupon">


<h3>

🎟️ ${c.codigo}

</h3>



<p>

${c.descuento || ""}

</p>



<p>

Compra mínima:

$${c.minimo || ""}

</p>




<button onclick="copiarCupon('${c.codigo}')">

📋 COPIAR CUPÓN

</button>



</div>


`;



});




}

catch(error){


console.log(
"No hay cupones"
);


}



}









window.copiarCupon=function(codigo){


navigator.clipboard.writeText(codigo);



const toast =
document.getElementById("toast");



if(toast){


toast.classList.add("show");



setTimeout(()=>{


toast.classList.remove("show");


},1200);


}



// redirige a Mercado Libre


setTimeout(()=>{


window.open(

"https://www.mercadolibre.com.mx",

"_blank"

);


},1300);



};









// INICIO


cargarOfertas();


cargarCupones();