// =======================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS PRO V2
// PARTE 1
// FIREBASE + AUTH + REFERENCIAS
// =======================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
addDoc,
deleteDoc,
doc,
getDoc,
updateDoc,
onSnapshot,
serverTimestamp

}

from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {

getStorage,
ref,
uploadBytes,
getDownloadURL

}

from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


import {

getAuth,
signOut,
onAuthStateChanged

}

from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




// ===============================
// CONFIG FIREBASE
// ===============================


const firebaseConfig = {

apiKey: "AIzaSyBo_wk-k8TrcSl0CMQz0hoUCvAKre94hW0",

authDomain: "patronofertasweb.firebaseapp.com",

projectId: "patronofertasweb",

storageBucket: "patronofertasweb.firebasestorage.app",

messagingSenderId: "292338334268",

appId: "1:292338334268:web:9dbbafe00dd23ebb72e139"

};



// INICIAR FIREBASE

const app =
initializeApp(firebaseConfig);


const db =
getFirestore(app);


const storage =
getStorage(app);


const auth =
getAuth(app);




// ===============================
// PROTEGER ADMIN
// ===============================


onAuthStateChanged(auth,(user)=>{


if(!user){

window.location.href="login.html";

}


});




// ===============================
// REFERENCIAS HTML
// ===============================


const lista =
document.getElementById("listaOfertas");


const contador =
document.getElementById("totalOfertas");


const totalClicks =
document.getElementById("totalClicks");


const topOferta =
document.getElementById("topOferta");



const archivoImagen =
document.getElementById("archivoImagen");


const vistaImagen =
document.getElementById("vistaImagen");



const botonPublicar =
document.getElementById("publicar");



const barraCarga =
document.getElementById("barraCarga");


const progresoCarga =
document.getElementById("progresoCarga");


const estadoSubida =
document.getElementById("estadoSubida");




// COLECCIÓN OFERTAS

const ofertasRef =
collection(db,"ofertas");



let ofertas = [];

let ofertaEditando = null;

const buscarOferta =
document.getElementById("buscarOferta");


const filtroCategoria =
document.getElementById("filtroCategoria");


const ordenarOferta =
document.getElementById("ordenarOferta");


let textoBusqueda="";

let categoriaSeleccionada="todas";

let ordenSeleccionado="reciente";

if(buscarOferta){

buscarOferta.oninput=(e)=>{

textoBusqueda =
e.target.value.toLowerCase();

mostrarOfertas();

};

}



if(filtroCategoria){

filtroCategoria.onchange=(e)=>{

categoriaSeleccionada =
e.target.value;

mostrarOfertas();

};

}



if(ordenarOferta){

ordenarOferta.onchange=(e)=>{

ordenSeleccionado =
e.target.value;

mostrarOfertas();

};

}

// =======================================
// PARTE 2
// IMAGEN + PUBLICAR OFERTA
// =======================================


// ===============================
// VISTA PREVIA IMAGEN
// ===============================


if(archivoImagen){


archivoImagen.addEventListener("change",(e)=>{


const archivo =
e.target.files[0];


if(!archivo)
return;



const lector =
new FileReader();



lector.onload=(evento)=>{


vistaImagen.src =
evento.target.result;


};



lector.readAsDataURL(archivo);



});


}




// ===============================
// SUBIR IMAGEN STORAGE
// ===============================


async function subirImagen(){


const archivo =
archivoImagen.files[0];


if(!archivo){

return "";

}



const nombre =

Date.now()+"_"+archivo.name;



const referencia =

ref(
storage,
"ofertas/"+nombre
);



await uploadBytes(

referencia,

archivo

);



const url =

await getDownloadURL(

referencia

);



return url;


}





// ===============================
// PUBLICAR OFERTA
// ===============================


botonPublicar.onclick =
async()=>{


try{


botonPublicar.disabled=true;


botonPublicar.innerHTML=
"⏳ Publicando...";



if(barraCarga){

barraCarga.style.display=
"block";

progresoCarga.style.width=
"20%";

estadoSubida.innerHTML=
"Subiendo imagen...";

}




const imagen =
await subirImagen();



if(progresoCarga){

progresoCarga.style.width=
"70%";

estadoSubida.innerHTML=
"Guardando oferta...";

}




const datos = {


titulo:
titulo.value.trim(),



categoria:
categoria.value,



precioAntes:
precioAntes.value,



precioFinal:
precioFinal.value,



descuento:
descuento.value,



link:
link.value,



imagen:



imagen,



activo:
estado.value==="true",



destacada:
destacada.value==="true",



clics:
0,



fecha:
serverTimestamp()



};





if(

!datos.titulo ||

!datos.precioFinal ||

!datos.link

){


alert(
"Completa título, precio y link"
);


botonPublicar.disabled=false;


botonPublicar.innerHTML=
"🚀 Publicar oferta";


return;


}




await addDoc(

ofertasRef,

datos

);





if(progresoCarga){


progresoCarga.style.width=
"100%";


estadoSubida.innerHTML=
"✅ Oferta publicada";


}




alert(
"🔥 Oferta publicada correctamente"
);





// LIMPIAR FORMULARIO


document
.querySelectorAll("input")
.forEach((i)=>{


if(i.type!=="file"){

i.value="";

}


});



archivoImagen.value="";


vistaImagen.src="";





setTimeout(()=>{


if(barraCarga){


barraCarga.style.display=
"none";


progresoCarga.style.width=
"0%";


estadoSubida.innerHTML="";


}



botonPublicar.disabled=false;


botonPublicar.innerHTML=
"🚀 Publicar oferta";



},1500);



}



catch(error){


console.error(error);


alert(
"❌ Error al publicar"
);



botonPublicar.disabled=false;


botonPublicar.innerHTML=
"🚀 Publicar oferta";



}



};

// =======================================
// PARTE 2
// IMAGEN + PUBLICAR OFERTA
// =======================================


// ===============================
// VISTA PREVIA IMAGEN
// ===============================


if(archivoImagen){


archivoImagen.addEventListener("change",(e)=>{


const archivo =
e.target.files[0];


if(!archivo)
return;



const lector =
new FileReader();



lector.onload=(evento)=>{


vistaImagen.src =
evento.target.result;


};



lector.readAsDataURL(archivo);



});


}




// ===============================
// SUBIR IMAGEN STORAGE
// ===============================


async function subirImagen(){


const archivo =
archivoImagen.files[0];


if(!archivo){

return "";

}



const nombre =

Date.now()+"_"+archivo.name;



const referencia =

ref(
storage,
"ofertas/"+nombre
);



await uploadBytes(

referencia,

archivo

);



const url =

await getDownloadURL(

referencia

);



return url;


}





// ===============================
// PUBLICAR OFERTA
// ===============================


botonPublicar.onclick =
async()=>{


try{


botonPublicar.disabled=true;


botonPublicar.innerHTML=
"⏳ Publicando...";



if(barraCarga){

barraCarga.style.display=
"block";

progresoCarga.style.width=
"20%";

estadoSubida.innerHTML=
"Subiendo imagen...";

}




const imagen =
await subirImagen();



if(progresoCarga){

progresoCarga.style.width=
"70%";

estadoSubida.innerHTML=
"Guardando oferta...";

}




const datos = {


titulo:
titulo.value.trim(),



categoria:
categoria.value,



precioAntes:
precioAntes.value,



precioFinal:
precioFinal.value,



descuento:
descuento.value,



link:
link.value,



imagen:



imagen,



activo:
estado.value==="true",



destacada:
destacada.value==="true",



clics:
0,



fecha:
serverTimestamp()



};





if(

!datos.titulo ||

!datos.precioFinal ||

!datos.link

){


alert(
"Completa título, precio y link"
);


botonPublicar.disabled=false;


botonPublicar.innerHTML=
"🚀 Publicar oferta";


return;


}




await addDoc(

ofertasRef,

datos

);





if(progresoCarga){


progresoCarga.style.width=
"100%";


estadoSubida.innerHTML=
"✅ Oferta publicada";


}




alert(
"🔥 Oferta publicada correctamente"
);





// LIMPIAR FORMULARIO


document
.querySelectorAll("input")
.forEach((i)=>{


if(i.type!=="file"){

i.value="";

}


});



archivoImagen.value="";


vistaImagen.src="";





setTimeout(()=>{


if(barraCarga){


barraCarga.style.display=
"none";


progresoCarga.style.width=
"0%";


estadoSubida.innerHTML="";


}



botonPublicar.disabled=false;


botonPublicar.innerHTML=
"🚀 Publicar oferta";



},1500);



}



catch(error){


console.error(error);


alert(
"❌ Error al publicar"
);



botonPublicar.disabled=false;


botonPublicar.innerHTML=
"🚀 Publicar oferta";



}



};