// =====================================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS CORREGIDO CARRUSEL ESTABLE
// =====================================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
getDocs,
doc,
updateDoc,
increment,
onSnapshot,
setDoc

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


// ==============================
// CONTADOR DE VISITAS
// ==============================

async function registrarVisita(){

const hoy = new Date()
.toISOString()
.split("T")[0];


await setDoc(
doc(db,"estadisticas","visitas"),
{
total: increment(1),
[hoy]: increment(1)
},
{
merge:true
}
);

}


registrarVisita();


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



let carruselActivo = true;

let intervaloCarrusel;









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


onSnapshot(
collection(db,"ofertas"),
(datos)=>{

carrusel.innerHTML="";

datos.forEach(item=>{

const o=item.data();

const card=document.createElement("div");

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

<a href="${o.link}" target="_blank" class="btnOferta">
🛒 VER OFERTA
</a>

`;

carrusel.appendChild(card);

});

});



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
// AUTO CARRUSEL ESTABLE
// ==============================


function iniciarCarrusel(){


if(!carrusel)return;



let posicion=0;



intervaloCarrusel=setInterval(()=>{


if(!carruselActivo)return;



if(carrusel.scrollWidth <= carrusel.clientWidth)

return;



posicion += 280;



if(posicion >= carrusel.scrollWidth - carrusel.clientWidth)

posicion=0;



carrusel.scrollTo({

left:posicion,

behavior:"smooth"

});



},3500);



}





// PAUSAR CUANDO EL USUARIO TOCA


if(carrusel){


["touchstart","mousedown"]

.forEach(evento=>{


carrusel.addEventListener(evento,()=>{


carruselActivo=false;


});


});





["touchend","mouseup"]

.forEach(evento=>{


carrusel.addEventListener(evento,()=>{


setTimeout(()=>{


carruselActivo=true;


},1500);


});


});


}









// ==============================
// CUPONES
// ==============================


async function cargarCupones(){


const datos =
await getDocs(
collection(db,"cupones")
);




// ORDEN MENOR DESCUENTO
// A MAYOR DESCUENTO


const cuponesOrdenados = datos.docs.sort((a,b)=>{


return Number(a.data().descuento || 0) -

Number(b.data().descuento || 0);


});






[relampago,bancarios,exclusivos]

.forEach(x=>{


if(x)

x.innerHTML="";


});






cuponesOrdenados.forEach(item=>{


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

🎟️ ${c.tipo==="relampago" ? "CUPON" : c.nombre}

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
// ==============================
// COPIAR CUPÓN ULTRA RÁPIDO
// ==============================

async function copiarCupon(id,codigo){

try{


// COPIAR AL PORTAPAPELES INMEDIATO

await navigator.clipboard.writeText(codigo);



mostrarToast(
"✅ CUPÓN COPIADO"
);



// IR A MERCADO LIBRE RÁPIDO

setTimeout(()=>{

window.location.href =
"https://meli.la/1mj3itE";

},300);



// SUMAR COPIA SIN BLOQUEAR

updateDoc(

doc(

db,

"cupones",

id

),

{

copias:

increment(1)

}

).catch(error=>{


console.log(error);


});



}

catch(error){


console.log(error);


}

}




// ==============================
// SUBIR ARRIBA
// ==============================


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









// ==============================
// INICIO
// ==============================


cargarOfertas();


cargarCupones();
