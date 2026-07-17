// =====================================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS NUEVO
// PARTE 1/3
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




// ================================
// FIREBASE
// ================================


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







// ================================
// ELEMENTOS
// ================================


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








// ================================
// TOAST
// ================================


function mostrarToast(texto){


if(!toast)return;



toast.innerHTML=texto;


toast.classList.add("show");



setTimeout(()=>{


toast.classList.remove("show");


},2000);



}







// ================================
// OFERTAS
// ================================


async function cargarOfertas(){



const datos =

await getDocs(

collection(db,"ofertas")

);





carrusel.innerHTML="";





datos.forEach((item)=>{



const oferta =

item.data();





const card =

document.createElement("div");



card.className="oferta";





card.innerHTML=`


${oferta.destacada ?

"<div class='badge destacada'>⭐ DESTACADA</div>"

:

""}



${oferta.tipo==="relampago" ?

"<div class='badge relampago'>⚡ RELÁMPAGO</div>"

:

""}




<img src="${oferta.imagen}">



<div class="ofertaTexto">


<h3>

${oferta.titulo}

</h3>



<p class="precioAntes">

${oferta.precioAntes || ""}

</p>



<h2>

$${oferta.precioFinal}

</h2>



<a

href="${oferta.link}"

target="_blank"

class="comprar">

🛒 VER OFERTA

</a>



</div>


`;





card.querySelector(".comprar")
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





carrusel.appendChild(card);



});





iniciarCarrusel();



}
// =====================================================
// APP.JS NUEVO
// PARTE 2/3
// CUPONES
// =====================================================





// ================================
// CARGAR CUPONES
// ================================


async function cargarCupones(){



const datos =

await getDocs(

collection(db,"cupones")

);






relampago.innerHTML="";

bancarios.innerHTML="";

exclusivos.innerHTML="";






datos.forEach((item)=>{



const cupon =

item.data();





const tarjeta =

crearTarjetaCupon(

item.id,

cupon

);






if(cupon.tipo==="relampago"){



relampago.appendChild(tarjeta);



}


else if(cupon.tipo==="bancario"){



bancarios.appendChild(tarjeta);



}


else{



exclusivos.appendChild(tarjeta);



}





});





}








// ================================
// CREAR CUPÓN
// ================================


function crearTarjetaCupon(id,cupon){



const div =

document.createElement("div");



div.className="cuponCard";






let estadoTexto="🟢 DISPONIBLE";

let estadoClase="disponible";





if(cupon.estado==="agotando"){


estadoTexto="⚡ ÚLTIMAS PIEZAS";


estadoClase="ultimas";


}





if(cupon.estado==="agotado"){


estadoTexto="🔴 AGOTADO";


estadoClase="agotado";


}







div.innerHTML=`



<span class="estado ${estadoClase}">

${estadoTexto}

</span>





<h3>

🎟️ ${cupon.nombre || "CUPÓN"}

</h3>





<strong>

${cupon.codigo}

</strong>






<p>

💰 Descuento:

$${cupon.descuento}

</p>






<p>

🛒 Compra mínima:

$${cupon.minimo}

</p>






<button>

📋 COPIAR CUPÓN

</button>




`;







div.querySelector("button")

.onclick=()=>{



copiarCupon(

id,

cupon.codigo

);



};






return div;



}









// ================================
// COPIAR CUPÓN
// ================================


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




}
// =====================================================
// APP.JS NUEVO
// PARTE 3/3
// CARRUSEL + BOTÓN ARRIBA + INICIO
// =====================================================





// ================================
// CARRUSEL AUTOMÁTICO
// ================================


function iniciarCarrusel(){



let posicion = 0;



setInterval(()=>{



if(!carrusel)return;




if(
carrusel.scrollWidth <=
carrusel.clientWidth
){

return;

}





posicion +=

carrusel.clientWidth;






if(
posicion >=
carrusel.scrollWidth
){


posicion=0;


}





carrusel.scrollTo({


left:posicion,


behavior:"smooth"


});





},3000);



}









// ================================
// BOTÓN SUBIR
// ================================


const btnArriba =

document.getElementById("btnArriba");






window.addEventListener(

"scroll",

()=>{



if(!btnArriba)return;





if(window.scrollY>500){



btnArriba.style.display="block";



}else{



btnArriba.style.display="none";


}



}

);







if(btnArriba){



btnArriba.onclick=()=>{



window.scrollTo({


top:0,


behavior:"smooth"


});



};



}








// ================================
// INICIO
// ================================


cargarOfertas();


cargarCupones();