// =====================================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS FINAL
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









// ===============================
// OFERTAS
// ===============================


async function cargarOfertas(){



const datos =
await getDocs(
collection(db,"ofertas")
);



carrusel.innerHTML="";



datos.forEach(item=>{



const o=item.data();



const div=document.createElement("div");



div.className="oferta";



div.innerHTML=`

<img src="${o.imagen}">



<h3>

${o.titulo}

</h3>



<p>

$${o.precioFinal}

</p>



<a

href="${o.link}"

target="_blank"

class="comprar">

🛒 VER OFERTA

</a>

`;





div.querySelector(".comprar")

.onclick=()=>{


updateDoc(

doc(
db,
"ofertas",
item.id
),

{

clics:
increment(1)

}

);


};





carrusel.appendChild(div);



});



activarCarrusel();



}









// ===============================
// CARRUSEL
// ===============================


function activarCarrusel(){



let posicion=0;



setInterval(()=>{



if(!carrusel)return;



posicion += 280;





if(
posicion >= carrusel.scrollWidth
)

posicion=0;





carrusel.scrollTo({

left:posicion,

behavior:"smooth"

});





},2200);



}









// ===============================
// CUPONES
// ===============================


async function cargarCupones(){



const datos=
await getDocs(
collection(db,"cupones")
);



relampago.innerHTML="";

bancarios.innerHTML="";

exclusivos.innerHTML="";






datos.forEach(item=>{



const c=item.data();



const tarjeta=
document.createElement("div");



tarjeta.className="cuponCard";



tarjeta.innerHTML=`

<span class="estado">

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

</span>



<h3>

🎟️ ${c.nombre}

</h3>



<strong>

${c.codigo}

</strong>



<p>

💰 Descuento:

$${c.descuento}

</p>



<p>

🛒 Compra mínima:

$${c.minimo}

</p>



<button>

📋 COPIAR CUPÓN

</button>

`;







tarjeta.querySelector("button")

.onclick=()=>{


copiarCupon(

item.id,

c.codigo

);


};






if(c.tipo==="relampago")

relampago.appendChild(tarjeta);



else if(c.tipo==="bancario")

bancarios.appendChild(tarjeta);



else

exclusivos.appendChild(tarjeta);



});



}









// ===============================
// COPIAR CUPÓN
// ===============================


async function copiarCupon(id,codigo){



await navigator.clipboard.writeText(codigo);





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





window.open(

"https://meli.la/1mj3itE",

"_blank"

);



}









// ===============================
// INICIAR
// ===============================


cargarOfertas();


cargarCupones();