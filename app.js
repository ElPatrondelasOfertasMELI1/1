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









function mostrarToast(texto){


if(!toast)return;


toast.innerHTML=texto;


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


const datos =
await getDocs(
collection(db,"ofertas")
);



carrusel.innerHTML="";




datos.forEach(item=>{


const o=item.data();



const card =
document.createElement("div");



card.className="oferta";



card.innerHTML=`

<img src="${o.imagen}">


<h3>

${o.titulo}

</h3>


<div class="precioAntes">

❌ Antes:

<s>

$${o.precioAntes || ""}

</s>

</div>



<div class="descuento">

🔥 ${o.descuento || ""}% OFF

</div>



<div class="precio">

💥 $${o.precioFinal || ""}

</div>



<a

href="${o.link}"

target="_blank"

class="btnOferta">

🛒 VER OFERTA

</a>


`;



carrusel.appendChild(card);



});



iniciarCarrusel();


}









// ==============================
// AUTO CARRUSEL
// ==============================


function iniciarCarrusel(){


let posicion=0;



setInterval(()=>{


if(!carrusel)return;



if(carrusel.scrollWidth <= carrusel.clientWidth)

return;



posicion += 300;



if(posicion >= carrusel.scrollWidth)

posicion=0;



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



[relampago,bancarios,exclusivos]

.forEach(x=>{

if(x)

x.innerHTML="";

});





datos.forEach(item=>{


const c=item.data();



const tarjeta =
document.createElement("div");



tarjeta.className="cuponCard";



tarjeta.innerHTML=`

<div class="estado">

${
c.estado==="agotado"

?

"🔴 AGOTADO"

:

c.estado==="agotando"

?

"⚡ ÚLTIMAS PIEZAS"

:

"🟢 DISPONIBLE"

}

</div>



<h3>

🎟️ ${c.nombre}

</h3>



<p>

💰 Descuento:

$${c.descuento}

</p>



<p>

🛒 Compra mínima:

$${c.minimo}

</p>




<button class="copiarCupon">

📋 COPIAR CUPÓN

</button>


`;



tarjeta

.querySelector(".copiarCupon")

.onclick=()=>{


copiarCupon(

item.id,

c.codigo

);


};




if(c.tipo==="relampago")

relampago?.appendChild(tarjeta);


else if(c.tipo==="bancario")

bancarios?.appendChild(tarjeta);


else

exclusivos?.appendChild(tarjeta);



});


}









async function copiarCupon(id,codigo){


await navigator.clipboard.writeText(

codigo

);



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


window.location.href=

"https://meli.la/1mj3itE";


},500);


}









// SUBIR ARRIBA


const btnArriba =
document.getElementById("btnArriba");



if(btnArriba){


window.addEventListener("scroll",()=>{


btnArriba.style.display=

window.scrollY>400

?

"block"

:

"none";


});



btnArriba.onclick=()=>{


window.scrollTo({

top:0,

behavior:"smooth"

});


};


}






cargarOfertas();


cargarCupones();