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







// FIREBASE


const firebaseConfig = {


apiKey:"TU_API_KEY",

authDomain:"TU_PROYECTO.firebaseapp.com",

projectId:"TU_PROJECT_ID",

storageBucket:"TU_STORAGE_BUCKET",

messagingSenderId:"TU_SENDER_ID",

appId:"TU_APP_ID"


};





const app =
initializeApp(firebaseConfig);



const db =
getFirestore(app);








// =============================
// VARIABLES
// =============================


let imagenBase64="";








// =============================
// IMAGEN GALERIA
// =============================


const imagenInput =

document.getElementById("imagen");



const preview =

document.getElementById("preview");






if(imagenInput){


imagenInput.addEventListener(

"change",

()=>{


const archivo =

imagenInput.files[0];



if(!archivo)return;





const reader =

new FileReader();




reader.onload=function(e){



imagenBase64=e.target.result;



preview.src=

imagenBase64;



preview.style.display="block";



};





reader.readAsDataURL(archivo);



}



);


}









// =============================
// PUBLICAR OFERTA
// =============================



document

.getElementById("publicar")

.onclick=async()=>{



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

imagenBase64,

precioAntes,

precioFinal,

descuento,

link,


destacada:

tipo==="destacada",



tipo:


tipo==="destacada"

?

"normal"

:

tipo,



activo:true,


fecha:

serverTimestamp()


}



);





alert(

"🔥 Oferta publicada"

);





limpiarOferta();



cargarOfertas();




};









function limpiarOferta(){


document
.querySelectorAll("input")
.forEach(i=>{


if(i.type!=="file")

i.value="";


});



imagenBase64="";



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


const o=item.data();




lista.innerHTML +=



`

<div class="ofertaAdmin">


<img src="${o.imagenBase64}">


<h3>

${o.titulo}

</h3>



<p>

$${o.precioFinal}

</p>



<p>

${o.destacada ? "⭐ DESTACADA" : ""}

${o.tipo==="relampago" ? "⚡ RELÁMPAGO":""}

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









// BORRAR


window.borrarOferta=

async(id)=>{


if(confirm("¿Borrar oferta?")){


await deleteDoc(

doc(db,"ofertas",id)

);



cargarOfertas();


}



};









// =============================
// CUPONES
// =============================



document

.getElementById("crearCupon")

.onclick=async()=>{



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

activo:true,


fecha:

serverTimestamp()


}

);







alert(

"🎟️ Cupón creado"

);




cargarCupones();



};









async function cargarCupones(){


const lista =

document.getElementById("listaCupones");



if(!lista)return;




const snap=

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

Mínimo:
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










// SALIR


const salir=

document.getElementById("salir");



if(salir){


salir.onclick=()=>{


location.href="login.html";


};


}









// INICIO


cargarOfertas();


cargarCupones();