// =====================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS PRO
// OFERTAS + CUPONES
// BASE64 FIRESTORE
// =====================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc,
serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";







// =============================
// FIREBASE
// =============================


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









let imagenBase64="";









// =============================
// CARGAR IMAGEN
// =============================


const imagen = document.getElementById("imagen");


const preview = document.getElementById("preview");





if(imagen){


imagen.addEventListener(

"change",

()=>{


const archivo = imagen.files[0];


if(!archivo)return;




const reader = new FileReader();



reader.onload = e=>{


imagenBase64 = e.target.result;


preview.src = imagenBase64;


preview.style.display="block";


};



reader.readAsDataURL(archivo);



}

);

}











// =============================
// PUBLICAR OFERTA
// =============================



const publicar =

document.getElementById("publicar");





if(publicar){


publicar.onclick = async()=>{



const titulo =

document.getElementById("titulo").value;



const precioAntes =

document.getElementById("precioAntes").value;



const precioFinal =

document.getElementById("precioFinal").value;



const descuento =

document.getElementById("descuento").value;



const link =

document.getElementById("link").value;



const tipo =

document.getElementById("tipoOferta").value;








if(!titulo || !imagenBase64 || !link){


alert(
"Completa título, imagen y link"
);


return;


}







await addDoc(

collection(db,"ofertas"),

{


titulo,

imagen:imagenBase64,

precioAntes,

precioFinal,

descuento,

link,


clics:0,


creado:
serverTimestamp(),



destacada:

tipo==="destacada",




tipo:

tipo,



activo:true



}

);








alert(

"🔥 Oferta publicada"

);







limpiar();



cargarOfertas();



};



}









function limpiar(){



document

.querySelectorAll("input")

.forEach(input=>{


if(input.type!=="file")

input.value="";


});





imagenBase64="";


if(preview)

preview.style.display="none";



}











// =============================
// MOSTRAR OFERTAS
// =============================


async function cargarOfertas(){



const lista =

document.getElementById("listaOfertas");



if(!lista)return;





const snap =

await getDocs(

collection(db,"ofertas")

);






lista.innerHTML="";



let total=0;







snap.forEach(item=>{



total++;


const oferta=item.data();





lista.innerHTML +=



`

<div class="ofertaAdmin">



<img src="${oferta.imagen}">



<h3>

${oferta.titulo}

</h3>



<p>

$${oferta.precioFinal}

</p>




<button

class="borrar"

onclick="borrarOferta('${item.id}')"

>

🗑️ BORRAR

</button>



</div>


`;



});








const contador=

document.getElementById("totalOfertas");



if(contador)

contador.innerHTML=total;



}









window.borrarOferta=

async(id)=>{



await deleteDoc(

doc(db,"ofertas",id)

);



cargarOfertas();


};











// =============================
// CREAR CUPONES
// =============================



const crearCupon =

document.getElementById("crearCupon");





if(crearCupon){



crearCupon.onclick=async()=>{



const codigo =

document.getElementById("codigoCupon").value;



const nombre =

document.getElementById("nombreCupon").value;



const descuento =

document.getElementById("descuentoCupon").value;



const minimo =

document.getElementById("minimoCupon").value;



const tipo =

document.getElementById("tipoCupon").value;







await addDoc(

collection(db,"cupones"),

{


codigo,

nombre,

descuento,

minimo,

tipo,

creado:

serverTimestamp(),

activo:true



}

);








alert(

"🎟️ Cupón guardado"

);






cargarCupones();



};



}











// =============================
// MOSTRAR CUPONES
// =============================


async function cargarCupones(){



const lista =

document.getElementById("listaCupones");



if(!lista)return;





const snap =

await getDocs(

collection(db,"cupones")

);





lista.innerHTML="";



let total=0;




snap.forEach(item=>{


total++;


const c=item.data();





lista.innerHTML+=



`

<div class="cuponAdmin">


<h3>

🎟️ ${c.nombre}

</h3>



<p>

${c.descuento}

</p>



<p>

Compra mínima:
$${c.minimo}

</p>



</div>


`;



});






const contador=

document.getElementById("totalCupones");



if(contador)

contador.innerHTML=total;



}









// =============================
// SALIR
// =============================


const salir=

document.getElementById("salir");



if(salir){



salir.onclick=()=>{


window.location.href="login.html";


};



}









// INICIO


cargarOfertas();


cargarCupones();