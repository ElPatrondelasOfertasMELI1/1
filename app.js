// =====================================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS FINAL CORREGIDO
// =====================================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
getDocs,
doc,
updateDoc,
increment

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// ==============================
// FIREBASE
// ==============================


const firebaseConfig = {


apiKey:"AIzaSyBo_wk-k8TrcSl0CMQz0hoUCvAKre94hW0",

authDomain:"patronofertasweb.firebaseapp.com",

projectId:"patronofertasweb",

storageBucket:"patronofertasweb.firebasestorage.app",

messagingSenderId:"292338334268",

appId:"1:292338334268:web:9dbbafe00dd23ebb72e139"

};



const app = initializeApp(firebaseConfig);


const db = getFirestore(app);









// ==============================
// ELEMENTOS
// ==============================


const carrusel = 
document.getElementById("carrusel");



const relampago =
document.getElementById("cuponesRelampago");



const bancarios =
document.getElementById("cuponesBancarios");



const exclusivos =
document.getElementById("cuponesExclusivos");



const toast =
document.getElementById("toast");









// ==============================
// MENSAJE
// ==============================


function mostrarToast(texto){


if(!toast)return;


toast.innerHTML = texto;


toast.classList.add("show");



setTimeout(()=>{


toast.classList.remove("show");


},2000);


}









// ==============================
// OFERTAS
// ==============================


async function cargarOfertas(){



if(!carrusel)return;



const datos = await getDocs(

collection(db,"ofertas")

);



carrusel.innerHTML="";



datos.forEach(item=>{


const oferta=item.data();



const card=document.createElement("div");


card.className="oferta";



card.innerHTML=`


<img src="${oferta.imagen}">



<h3>

${oferta.titulo}

</h3>



<p class="precio">

$${oferta.precioFinal}

</p>



<a href="${oferta.link}"

target="_blank"

class="btnOferta">

🛒 VER OFERTA

</a>


`;



carrusel.appendChild(card);



});



activarCarrusel();



}









// ==============================
// CARRUSEL
// ==============================


function activarCarrusel(){



let posicion=0;



setInterval(()=>{


if(!carrusel)return;



posicion += 280;



if(posicion >= carrusel.scrollWidth){


posicion=0;


}



carrusel.scrollTo({

left:posicion,

behavior:"smooth"

});



},2200);



}









// ==============================
// CUPONES
// ==============================


async function cargarCupones(){



const datos =
await getDocs(

collection(db,"cupones")

);



if(relampago)

relampago.innerHTML="";



if(bancarios)

bancarios.innerHTML="";



if(exclusivos)

exclusivos.innerHTML="";





datos.forEach(item=>{



const cupon=item.data();



const tarjeta=document.createElement("div");



tarjeta.className="cuponCard";



tarjeta.innerHTML=`


<div class="estado">

${

cupon.estado==="agotado"

?

"🔴 AGOTADO"

:

cupon.estado==="agotando"

?

"⚡ ÚLTIMAS PIEZAS"

:

"🟢 DISPONIBLE"

}

</div>



<h3>

🎟️ ${cupon.nombre}

</h3>



<div class="codigo">

${cupon.codigo}

</div>



<p>

💰 Descuento:

$${cupon.descuento}

</p>



<p>

🛒 Compra mínima:

$${cupon.minimo}

</p>




<button class="copiarCupon">

📋 COPIAR CUPÓN

</button>


`;






tarjeta

.querySelector(".copiarCupon")

.addEventListener(

"click",

()=>{


copiarCupon(

item.id,

cupon.codigo

);


}

);







if(cupon.tipo==="relampago")

relampago?.appendChild(tarjeta);



else if(cupon.tipo==="bancario")

bancarios?.appendChild(tarjeta);



else

exclusivos?.appendChild(tarjeta);



});



}









// ==============================
// COPIAR CUPÓN CORREGIDO
// ==============================


async function copiarCupon(id,codigo){


try{


const texto =
String(codigo);



await navigator.clipboard.writeText(texto);






await updateDoc(

doc(

db,

"cupones",

id

),

{

copias:

increment(1)

}

);





mostrarToast(

"✅ CUPÓN COPIADO"

);






setTimeout(()=>{


window.location.href =

"https://meli.la/1mj3itE";



},500);





}

catch(error){


console.error(error);



mostrarToast(

"❌ Error al copiar"

);



}



}









// ==============================
// INICIO
// ==============================


cargarOfertas();


cargarCupones();