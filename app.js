// =====================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS PRO
// FIREBASE + OFERTAS + CUPONES
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





// ===============================
// FIREBASE
// ===============================


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








// ===============================
// OFERTAS
// ===============================


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


ofertas.push(doc.data());


});






// ORDEN PRIORIDAD


ofertas.sort((a,b)=>{


let prioridadA =
a.destacada ? 1 :

a.tipo==="relampago" ? 2 : 3;



let prioridadB =
b.destacada ? 1 :

b.tipo==="relampago" ? 2 : 3;



return prioridadA-prioridadB;


});







carrusel.innerHTML="";






ofertas.forEach(oferta=>{


crearOferta(oferta);


});




}

catch(error){


console.error(
"Error ofertas",
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




let etiqueta="";



if(oferta.destacada){


etiqueta=

`
<div class="badge destacada">
⭐ DESTACADA
</div>
`;


}

else if(oferta.tipo==="relampago"){


etiqueta=

`
<div class="badge relampago">
⚡ RELÁMPAGO
</div>
`;

}




card.innerHTML=



`

${etiqueta}



<img src="${oferta.imagenBase64}">



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

onclick="registrarClick()"

>

🛒 COMPRAR

</a>




</div>

`;



carrusel.appendChild(card);



}









// ===============================
// CUPONES
// ===============================



async function cargarCupones(){



const tipos=[

{

id:"cuponesRelampago",

tipo:"relampago"

},

{

id:"cuponesBancarios",

tipo:"bancario"

},

{

id:"cuponesExclusivos",

tipo:"exclusivo"

}

];






const snap =

await getDocs(

collection(db,"cupones")

);





let cupones=[];



snap.forEach(doc=>{


cupones.push(doc.data());


});









tipos.forEach(seccion=>{



const contenedor=

document.getElementById(seccion.id);



if(!contenedor)return;





let lista =

cupones.filter(c=>

c.tipo===seccion.tipo

);







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

🎟 ${c.nombre || "CUPÓN"}

</h3>



<div class="codigo">

••••••

</div>



<p>

${c.descuento}

</p>



<p>

Compra mínima:
$${c.minimo}

</p>



<button

onclick="copiarCupon('${c.codigo}')"

>

📋 COPIAR CUPÓN

</button>



</div>


`;




});



});




}









// ===============================
// COPIAR CUPON
// ===============================


window.copiarCupon=function(codigo){



navigator.clipboard.writeText(codigo);




const toast=

document.getElementById("toast");



toast.classList.add("show");




setTimeout(()=>{


toast.classList.remove("show");



},1200);






// contador local


let copias=

Number(localStorage.getItem("copias") || 0);



copias++;



localStorage.setItem(

"copias",

copias

);








// ahorro comunidad diario


let dia=

new Date().toDateString();



let guardado=

localStorage.getItem("ahorroDia");



if(guardado!==dia){



localStorage.setItem(

"ahorroDia",

dia

);



}








setTimeout(()=>{


window.location.href=

"https://meli.la/1mj3itE";



},1400);



};










// ===============================
// CLICS OFERTAS
// ===============================


window.registrarClick=function(){


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