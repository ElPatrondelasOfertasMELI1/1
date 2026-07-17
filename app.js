// =====================================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS PRO ESTADISTICAS + TIEMPO REAL
// PARTE 1/3
// =====================================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
doc,
updateDoc,
increment,
onSnapshot,
setDoc

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const firebaseConfig={

apiKey:"AIzaSyBo_wk-k88TrcSl0CMQz0hoUCvAKre94hW0",

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





// =====================================================
// FECHA Y HORA CDMX
// =====================================================


function fechaCDMX(){


return new Intl.DateTimeFormat(

"en-CA",

{

timeZone:"America/Mexico_City"

}

).format(new Date());


}





function horaCDMX(){


return new Intl.DateTimeFormat(

"es-MX",

{

timeZone:"America/Mexico_City",

hour:"2-digit",

hour12:false

}

).format(new Date());


}








// =====================================================
// ESTADISTICAS
// =====================================================


async function registrarEstadistica(tipo){


const fecha =
fechaCDMX();


const hora =
horaCDMX();




// Estadística diaria


await setDoc(

doc(

db,

"estadisticas_diarias",

fecha

),

{


[tipo]:

increment(1),


[`hora_${hora}`]:

increment(1)


},

{

merge:true

}

);






// Estadística mensual


const mes =
fecha.substring(0,7);



await setDoc(

doc(

db,

"estadisticas_mensuales",

mes

),

{


[tipo]:

increment(1)


},

{

merge:true

}

);



}







// =====================================================
// VISITAS
// =====================================================


async function registrarVisita(){



const hoy =
fechaCDMX();




await setDoc(

doc(

db,

"estadisticas",

"visitas"

),

{


total:

increment(1),


[hoy]:

increment(1)


},

{

merge:true

}

);



// nuevo sistema

registrarEstadistica("visitas");



}




registrarVisita();








// =====================================================
// ELEMENTOS
// =====================================================


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





let carruselActivo=true;


let intervaloCarrusel=null;





function mostrarToast(texto){


if(!toast)return;



toast.innerHTML=texto;



toast.classList.add("show");



setTimeout(()=>{


toast.classList.remove("show");


},2000);



}
// =====================================================
// OFERTAS TIEMPO REAL
// =====================================================


function cargarOfertas(){


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



<a

href="${o.link}"

target="_blank"

class="btnOferta">

🛒 VER OFERTA

</a>

`;





// CLIC EN OFERTA

card
.querySelector(".btnOferta")
.addEventListener(

"click",

()=>{


registrarEstadistica("clics");


}

);





carrusel.appendChild(card);



});



});



}









// =====================================================
// AUTO CARRUSEL ESTABLE
// =====================================================


function iniciarCarrusel(){



if(!carrusel)return;



if(intervaloCarrusel)

clearInterval(intervaloCarrusel);




let posicion=0;




intervaloCarrusel=setInterval(()=>{



if(!carruselActivo)return;



if(

carrusel.scrollWidth <= carrusel.clientWidth

)

return;





posicion+=280;





if(

posicion >=

carrusel.scrollWidth-carrusel.clientWidth

)

{

posicion=0;

}




carrusel.scrollTo({

left:posicion,

behavior:"smooth"

});




},3500);



}







// PAUSAR AL TOCAR


if(carrusel){



carrusel.addEventListener(

"touchstart",

()=>{


carruselActivo=false;


}

);




carrusel.addEventListener(

"touchend",

()=>{


setTimeout(()=>{


carruselActivo=true;



},1500);


}

);




carrusel.addEventListener(

"mousedown",

()=>{


carruselActivo=false;


}

);




carrusel.addEventListener(

"mouseup",

()=>{


setTimeout(()=>{


carruselActivo=true;



},1500);


}

);



}









// =====================================================
// CUPONES TIEMPO REAL
// =====================================================


function cargarCupones(){



onSnapshot(

collection(db,"cupones"),

(datos)=>{



const cuponesOrdenados=[...datos.docs]

.sort((a,b)=>{


return Number(

a.data().descuento || 0

)

-

Number(

b.data().descuento || 0

);


});






[relampago,bancarios,exclusivos]

.forEach(x=>{


if(x)

x.innerHTML="";


});







cuponesOrdenados.forEach(item=>{



const c=item.data();




const tarjeta=document.createElement("div");



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



});



}
// =====================================================
// COPIAR CUPÓN + ESTADISTICAS
// =====================================================


async function copiarCupon(id,codigo){


try{


await navigator.clipboard.writeText(codigo);



mostrarToast(
"✅ CUPÓN COPIADO"
);




// CONTADOR COPIAS

registrarEstadistica("copias");




// ACTUALIZAR FIRESTORE

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





// REDIRECCION RAPIDA MERCADO LIBRE


setTimeout(()=>{


window.location.href=

"https://meli.la/1mj3itE";



},100);




}

catch(error){


console.log(error);


}


}









// =====================================================
// BOTON SUBIR
// =====================================================


const btnArriba =

document.getElementById("btnArriba");




if(btnArriba){



window.addEventListener(

"scroll",

()=>{


btnArriba.style.display=


window.scrollY>400

?

"block"

:

"none";



}

);





btnArriba.onclick=()=>{


window.scrollTo({

top:0,

behavior:"smooth"

});


};



}








// =====================================================
// INICIO
// =====================================================


cargarOfertas();


cargarCupones();


iniciarCarrusel();



// =====================================================
// FIN APP.JS PRO
// =====================================================