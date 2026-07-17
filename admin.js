// =====================================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS
// PARTE 1/3
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
// TOAST ADMIN
// ================================


function mostrarMensaje(texto){


let mensaje =
document.getElementById("toastAdmin");



if(!mensaje){


mensaje =
document.createElement("div");


mensaje.id =
"toastAdmin";


document.body.appendChild(mensaje);


}




mensaje.innerHTML = texto;


mensaje.classList.add("show");



setTimeout(()=>{


mensaje.classList.remove("show");


},2500);



}









// ================================
// IMAGEN DESDE GALERÍA
// ================================


const imagenArchivo =

document.getElementById("imagenArchivo");



const previewImagen =

document.getElementById("previewImagen");






if(imagenArchivo){


imagenArchivo.addEventListener(

"change",

()=>{


const archivo =
imagenArchivo.files[0];



if(!archivo)return;



const lector =
new FileReader();





lector.onload = (e)=>{


imagenBase64 =
e.target.result;



if(previewImagen){


previewImagen.src =
imagenBase64;


previewImagen.style.display =
"block";


}



};



lector.readAsDataURL(archivo);



}


);


}
// =====================================================
// ADMIN.JS
// PARTE 2/3
// GUARDAR OFERTAS Y CUPONES
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



const destacada =

document.getElementById("destacada").checked;






if(
!titulo ||
!precioFinal ||
!link ||
!imagenBase64

){


mostrarMensaje(

"⚠️ Completa todos los campos"

);


return;


}







await addDoc(

collection(db,"ofertas"),

{


titulo:titulo,


precioAntes:precioAntes,


precioFinal:precioFinal,


link:link,


imagen:imagenBase64,


clics:0,


destacada:destacada,


creado:serverTimestamp()



}

);






mostrarMensaje(

"🔥 Oferta publicada"

);






}

catch(error){


console.error(error);


mostrarMensaje(

"❌ Error al publicar"

);



}



}


);


}










// ================================
// CREAR CUPÓN
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




const descuento =

document.getElementById("descuentoCupon").value;



const minimo =

document.getElementById("minimoCupon").value;



const tipo =

document.getElementById("tipoCupon").value;



const estado =

document.getElementById("estadoCupon").value;








if(!codigo){


mostrarMensaje(

"⚠️ Escribe el código del cupón"

);


return;


}







await addDoc(

collection(db,"cupones"),

{


codigo:codigo,


descuento:descuento,


minimo:minimo,


tipo:tipo,


estado:estado,


copias:0



}

);







mostrarMensaje(

"🎟️ Cupón creado"

);





}



catch(error){


console.error(error);



mostrarMensaje(

"❌ Error al crear cupón"

);



}




}


);


}
// =====================================================
// ADMIN.JS
// PARTE 3/3
// MOSTRAR Y ELIMINAR
// =====================================================



// ================================
// CONTENEDORES
// ================================


const listaOfertas =

document.getElementById("listaOfertas");



const listaCupones =

document.getElementById("listaCupones");







// ================================
// CARGAR OFERTAS
// ================================


async function cargarOfertasAdmin(){



if(!listaOfertas)return;



listaOfertas.innerHTML =
"";



const datos =

await getDocs(

collection(db,"ofertas")

);





datos.forEach((item)=>{


const oferta =
item.data();



const div =
document.createElement("div");



div.className =
"ofertaAdmin";





div.innerHTML = `

<img src="${oferta.imagen}">


<h3>

${oferta.titulo}

</h3>


<p>

💰 $${oferta.precioFinal}

</p>


<button>

🗑️ BORRAR

</button>


`;





div.querySelector("button")
.onclick = async()=>{



await deleteDoc(

doc(
db,
"ofertas",
item.id

)

);



mostrarMensaje(

"🗑️ Oferta eliminada"

);



cargarOfertasAdmin();



};





listaOfertas.appendChild(div);



});



}









// ================================
// CARGAR CUPONES
// ================================


async function cargarCuponesAdmin(){



if(!listaCupones)return;



listaCupones.innerHTML =
"";



const datos =

await getDocs(

collection(db,"cupones")

);





datos.forEach((item)=>{


const cupon =
item.data();




const div =
document.createElement("div");



div.className =
"ofertaAdmin";




div.innerHTML = `


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



<button>

🗑️ BORRAR

</button>



`;






div.querySelector("button")
.onclick = async()=>{



await deleteDoc(

doc(
db,
"cupones",
item.id

)

);



mostrarMensaje(

"🗑️ Cupón eliminado"

);



cargarCuponesAdmin();



};





listaCupones.appendChild(div);



});



}










// ================================
// INICIO ADMIN
// ================================


cargarOfertasAdmin();


cargarCuponesAdmin();