// =====================================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS
// PARTE 1/3
// COMPATIBLE CON admin.html ACTUAL
// =====================================================


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





// ================================
// FIREBASE
// ================================


const firebaseConfig = {


apiKey: "AIzaSyBo_wk-k8TrcSl0CMQz0hoUCvAKre94hW0",

authDomain: "patronofertasweb.firebaseapp.com",

projectId: "patronofertasweb",

storageBucket: "patronofertasweb.firebasestorage.app",

messagingSenderId: "292338334268",

appId: "1:292338334268:web:9dbbafe00dd23ebb72e139"


};



const app =
initializeApp(firebaseConfig);



const db =
getFirestore(app);







// ================================
// VARIABLES
// ================================


let imagenBase64 = "";








// ================================
// TOAST
// ================================


function mostrarMensaje(texto){



let toast =

document.getElementById("toastAdmin");



if(!toast){


toast =
document.createElement("div");


toast.id =
"toastAdmin";


document.body.appendChild(toast);


}




toast.innerHTML =
texto;


toast.classList.add("show");




setTimeout(()=>{


toast.classList.remove("show");


},2500);



}









// ================================
// CARGAR IMAGEN
// ================================


const inputImagen =

document.getElementById("imagen");



const preview =

document.getElementById("preview");





if(inputImagen){


inputImagen.addEventListener(

"change",

()=>{


const archivo =
inputImagen.files[0];



if(!archivo)return;



const lector =
new FileReader();





lector.onload = (e)=>{


imagenBase64 =
e.target.result;



preview.src =
imagenBase64;



preview.style.display =
"block";



};





lector.readAsDataURL(archivo);



}

);


}
// =====================================================
// ADMIN.JS
// PARTE 2/3
// PUBLICAR OFERTAS Y GUARDAR CUPONES
// =====================================================



// ================================
// PUBLICAR OFERTA
// ================================


const botonPublicar =

document.getElementById("publicar");





if(botonPublicar){


botonPublicar.addEventListener(

"click",

async()=>{


try{



const titulo =

document.getElementById("titulo").value.trim();



const precioAntes =

document.getElementById("precioAntes").value;



const precioFinal =

document.getElementById("precioFinal").value;



const link =

document.getElementById("link").value.trim();



const tipoOferta =

document.getElementById("tipoOferta").value;





if(
!titulo ||
!precioFinal ||
!link ||
!imagenBase64

){


mostrarMensaje(

"⚠️ Completa título, precio, link e imagen"

);


return;


}







await addDoc(

collection(db,"ofertas"),

{


titulo,


precioAntes,


precioFinal,


link,


imagen:imagenBase64,


clics:0,


tipo:

tipoOferta,



destacada:

tipoOferta==="destacada",



creado:

serverTimestamp()



}

);






mostrarMensaje(

"🔥 Oferta publicada"

);







// limpiar imagen


imagenBase64="";



document.getElementById("titulo").value="";

document.getElementById("precioAntes").value="";

document.getElementById("precioFinal").value="";

document.getElementById("link").value="";

document.getElementById("imagen").value="";



preview.style.display="none";




cargarOfertasAdmin();



}



catch(error){


console.error(error);


mostrarMensaje(

"❌ Error al publicar oferta"

);


}



}


);



}









// ================================
// GUARDAR CUPÓN
// ================================


const botonCupon =

document.getElementById("crearCupon");






if(botonCupon){


botonCupon.addEventListener(

"click",

async()=>{


try{



const codigo =

document.getElementById("codigoCupon").value.trim();




const nombre =

document.getElementById("nombreCupon").value.trim();




const descuento =

document.getElementById("descuentoCupon").value;



const minimo =

document.getElementById("minimoCupon").value;



const tipo =

document.getElementById("tipoCupon").value;







if(!codigo){


mostrarMensaje(

"⚠️ Falta código del cupón"

);


return;


}







await addDoc(

collection(db,"cupones"),

{


codigo,


nombre,


descuento,


minimo,


tipo,


estado:"activo",


copias:0



}

);






mostrarMensaje(

"🎟️ Cupón guardado"

);






document.getElementById("codigoCupon").value="";

document.getElementById("nombreCupon").value="";

document.getElementById("descuentoCupon").value="";

document.getElementById("minimoCupon").value="";



cargarCuponesAdmin();



}




catch(error){


console.error(error);


mostrarMensaje(

"❌ Error al guardar cupón"

);


}



}



);


}

// =====================================================
// ADMIN.JS
// PARTE 3/3
// LISTAS + BORRAR
// =====================================================



// ================================
// CONTENEDORES
// ================================


const listaOfertas =

document.getElementById("listaOfertas");



const listaCupones =

document.getElementById("listaCupones");







// ================================
// MOSTRAR OFERTAS
// ================================


async function cargarOfertasAdmin(){



if(!listaOfertas)return;



listaOfertas.innerHTML="";



const datos =

await getDocs(

collection(db,"ofertas")

);





datos.forEach((documento)=>{



const oferta =

documento.data();





const card =

document.createElement("div");



card.className="ofertaAdmin";





card.innerHTML = `


<img src="${oferta.imagen}">


<h3>

${oferta.titulo}

</h3>


<p>

💰 $${oferta.precioFinal}

</p>


<p>

${oferta.destacada ? "⭐ Destacada" : ""}

${oferta.tipo==="relampago" ? "⚡ Relámpago" : ""}

</p>



<button>

🗑️ ELIMINAR

</button>


`;





card.querySelector("button")

.onclick = async()=>{



await deleteDoc(

doc(

db,

"ofertas",

documento.id

)

);



mostrarMensaje(

"🗑️ Oferta eliminada"

);



cargarOfertasAdmin();



};





listaOfertas.appendChild(card);



});



}









// ================================
// MOSTRAR CUPONES
// ================================


async function cargarCuponesAdmin(){



if(!listaCupones)return;



listaCupones.innerHTML="";



const datos =

await getDocs(

collection(db,"cupones")

);





datos.forEach((documento)=>{



const cupon =

documento.data();





const card =

document.createElement("div");



card.className="ofertaAdmin";





card.innerHTML = `


<h3>

🎟️ ${cupon.codigo}

</h3>


<p>

💰 Descuento:
$${cupon.descuento}

</p>


<p>

🛒 Mínimo:
${cupon.minimo}

</p>


<p>

Tipo:
${cupon.tipo}

</p>



<button>

🗑️ ELIMINAR

</button>


`;







card.querySelector("button")

.onclick = async()=>{



await deleteDoc(

doc(

db,

"cupones",

documento.id

)

);



mostrarMensaje(

"🗑️ Cupón eliminado"

);



cargarCuponesAdmin();



};





listaCupones.appendChild(card);



});



}









// ================================
// CONTADORES
// ================================


async function actualizarEstadisticas(){



const ofertas =

await getDocs(

collection(db,"ofertas")

);



const cupones =

await getDocs(

collection(db,"cupones")

);




const totalOfertas =

document.getElementById("totalOfertas");



const totalCupones =

document.getElementById("totalCupones");





if(totalOfertas)

totalOfertas.innerHTML=

ofertas.size;



if(totalCupones)

totalCupones.innerHTML=

cupones.size;



}









// ================================
// INICIO
// ================================


cargarOfertasAdmin();


cargarCuponesAdmin();


actualizarEstadisticas();
