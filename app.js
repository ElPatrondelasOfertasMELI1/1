// =====================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS
// FIREBASE OFERTAS + CUPONES
// =====================================



import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";



import {

getFirestore,
collection,
getDocs

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";







// ============================
// FIREBASE
// ============================


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









// ============================
// OFERTAS
// ============================


const carrusel =

document.getElementById("carrusel");






async function cargarOfertas(){



try{



const snap =

await getDocs(

collection(db,"ofertas")

);





let ofertas=[];






snap.forEach(doc=>{


ofertas.push({

id:doc.id,

...doc.data()

});


});








// PRIORIDAD
// ⭐ Destacada
// ⚡ Relámpago
// Normal


ofertas.sort((a,b)=>{


let A =

a.destacada ? 1 :

a.tipo==="relampago" ? 2 : 3;



let B =

b.destacada ? 1 :

b.tipo==="relampago" ? 2 : 3;



return A-B;


});









carrusel.innerHTML="";






if(ofertas.length===0){


carrusel.innerHTML=

`

<div class="loader">

No hay ofertas

</div>

`;

return;


}







ofertas.forEach(oferta=>{


crearOferta(oferta);


});





}

catch(error){



console.error(
error
);



carrusel.innerHTML=

`

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






let badge="";



if(oferta.destacada){


badge=

`

<div class="badge destacada">

⭐ DESTACADA

</div>

`;


}

else if(oferta.tipo==="relampago"){


badge=

`

<div class="badge relampago">

⚡ RELÁMPAGO

</div>

`;

}





card.innerHTML=



`

${badge}



<img src="${oferta.imagen}">



<div class="info">



<span class="descuento">

${oferta.descuento || "OFERTA"}

</span>



<h3>

${oferta.titulo}

</h3>



<p class="precioAntes">

${oferta.precioAntes ? "$"+oferta.precioAntes : ""}

</p>



<div class="precioFinal">

$${oferta.precioFinal}

</div>



<a

class="btnComprar"

href="${oferta.link}"

target="_blank"

onclick="registrarClick('${oferta.id}')"

>

🛒 COMPRAR

</a>



</div>

`;




carrusel.appendChild(card);



}









// ============================
// CUPONES
// ============================



async function cargarCupones(){



try{



const snap =

await getDocs(

collection(db,"cupones")

);





let cupones=[];





snap.forEach(doc=>{


cupones.push(doc.data());


});









mostrarCupones(

"cuponesRelampago",

cupones.filter(c=>c.tipo==="relampago")

);



mostrarCupones(

"cuponesBancarios",

cupones.filter(c=>c.tipo==="bancario")

);



mostrarCupones(

"cuponesExclusivos",

cupones.filter(c=>c.tipo==="exclusivo")

);





}

catch(error){


console.error(error);


}



}









function mostrarCupones(id,lista){



const contenedor=

document.getElementById(id);



if(!contenedor)return;






lista.sort((a,b)=>{


return Number(a.minimo || 0)

-

Number(b.minimo || 0);


});






contenedor.innerHTML="";






lista.forEach(c=>{





contenedor.innerHTML+=



`

<div class="cupon">


<h3>

🎟️ ${c.nombre || "Cupón"}

</h3>



<div class="codigo">

••••••

</div>



<p>

${c.descuento || ""}

</p>



<p>

Compra mínima:
$${c.minimo || 0}

</p>




<button

onclick="copiarCupon('${c.codigo}')"

>

📋 COPIAR CUPÓN

</button>


</div>


`;





});



}









// ============================
// COPIAR CUPON
// ============================


window.copiarCupon=function(codigo){



navigator.clipboard.writeText(codigo);





const toast=

document.getElementById("toast");



toast.classList.add("show");





setTimeout(()=>{


toast.classList.remove("show");


},1200);







setTimeout(()=>{


window.location.href=

"https://meli.la/1mj3itE";



},1400);



};









// ============================
// CLICS
// ============================


window.registrarClick=function(id){



let clicks=

Number(

localStorage.getItem("clicks") || 0

);



clicks++;



localStorage.setItem(

"clicks",

clicks

);



};









// INICIO


cargarOfertas();


cargarCupones();