// =======================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS PRO LIMPIO
// FIREBASE + OFERTAS
// =======================================


import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
addDoc,
deleteDoc,
doc,
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
onAuthStateChanged,
signOut

}

from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




// CONFIG FIREBASE


const firebaseConfig = {


apiKey: "AIzaSyBo_wk-k8TrcSl0CMQz0hoUCvAKre94hW0",

authDomain: "patronofertasweb.firebaseapp.com",

projectId: "patronofertasweb",

storageBucket: "patronofertasweb.firebasestorage.app",

messagingSenderId: "292338334268",

appId: "1:292338334268:web:9dbbafe00dd23ebb72e139"


};





const app = initializeApp(firebaseConfig);


const db = getFirestore(app);


const storage = getStorage(app);


const auth = getAuth(app);





// PROTEGER PANEL


onAuthStateChanged(auth,(user)=>{


if(!user){

window.location.href="login.html";

}


});







// REFERENCIAS


const lista =
document.getElementById("listaOfertas");


const totalOfertas =
document.getElementById("totalOfertas");


const totalClicks =
document.getElementById("totalClicks");


const topOferta =
document.getElementById("topOferta");



const botonPublicar =
document.getElementById("publicar");



const archivoImagen =
document.getElementById("archivoImagen");



const vistaImagen =
document.getElementById("vistaImagen");



const barraCarga =
document.getElementById("barraCarga");



const progresoCarga =
document.getElementById("progresoCarga");



const estadoSubida =
document.getElementById("estadoSubida");





const ofertasRef =
collection(db,"ofertas");





let ofertas=[];


let textoBusqueda="";


let categoriaSeleccionada="todas";


let ordenSeleccionado="reciente";







// PREVIEW IMAGEN


archivoImagen.addEventListener("change",(e)=>{


const archivo=e.target.files[0];


if(!archivo)return;



const lector=new FileReader();



lector.onload=()=>{


vistaImagen.src=lector.result;


};



lector.readAsDataURL(archivo);



});









// SUBIR IMAGEN


async function subirImagen(){


const archivo =
archivoImagen.files[0];


if(!archivo)return "";



const nombre =
Date.now()+"_"+archivo.name;



const imagenRef =
ref(
storage,
"ofertas/"+nombre
);



await uploadBytes(
imagenRef,
archivo
);



return await getDownloadURL(imagenRef);


}









// PUBLICAR OFERTA

const botonPublicar =
document.getElementById("publicar");

botonPublicar.onclick=async()=>{


try{


botonPublicar.disabled=true;


botonPublicar.innerHTML="⏳ Publicando...";



barraCarga.style.display="block";


progresoCarga.style.width="30%";


estadoSubida.innerHTML="Subiendo imagen...";





const imagen =
await subirImagen();





const datos={


titulo:
document.getElementById("titulo").value,


categoria:
document.getElementById("categoria").value,


precioAntes:
document.getElementById("precioAntes").value,


precioFinal:
document.getElementById("precioFinal").value,


descuento:
document.getElementById("descuento").value,


link:
document.getElementById("link").value,


imagen,


activo:
document.getElementById("estado").value==="true",


destacada:
document.getElementById("destacada").value==="true",


clics:0,


fecha:serverTimestamp()


};




if(!datos.titulo || !datos.precioFinal || !datos.link){


alert("Completa título, precio y link");


return;


}




progresoCarga.style.width="70%";


estadoSubida.innerHTML="Guardando oferta...";




await addDoc(
ofertasRef,
datos
);




progresoCarga.style.width="100%";


estadoSubida.innerHTML="✅ Publicada";



alert("Oferta publicada");



limpiar();



}

catch(error){


console.error(error);


alert("Error publicando");


}



finally{


botonPublicar.disabled=false;


botonPublicar.innerHTML="🚀 Publicar oferta";


}



};







function limpiar(){


document.querySelectorAll("input").forEach(i=>{


if(i.type!="file")
i.value="";


});



archivoImagen.value="";


vistaImagen.src="";



}









// FIRESTORE EN VIVO


onSnapshot(
ofertasRef,
(snapshot)=>{


ofertas=[];


let clicks=0;

let mayor=0;

let ganadora="-";



snapshot.forEach((item)=>{


const oferta={

id:item.id,

...item.data()

};


ofertas.push(oferta);



clicks += oferta.clics || 0;



if((oferta.clics||0)>mayor){


mayor=oferta.clics;


ganadora=oferta.titulo;


}


});



totalOfertas.innerHTML=snapshot.size;


totalClicks.innerHTML=clicks;


topOferta.innerHTML=ganadora;



mostrarOfertas();



}

);









// MOSTRAR


function mostrarOfertas(){


lista.innerHTML="";



let resultado=[...ofertas];




resultado=resultado.filter(o=>{


return o.titulo
.toLowerCase()
.includes(textoBusqueda);


});





if(categoriaSeleccionada!="todas"){


resultado=resultado.filter(o=>{


return o.categoria==categoriaSeleccionada;


});


}





resultado.forEach(o=>{



lista.innerHTML+=`


<div class="ofertaAdmin">


<img src="${o.imagen || 'logo.png'}">


<h3>${o.titulo}</h3>


<p>
💰 $${o.precioFinal}
</p>


<p>
${o.descuento || ""}
</p>


<p>
${o.activo?"🟢 Activa":"🔴 Agotada"}
</p>



<button onclick="eliminarOferta('${o.id}')">

🗑️ Eliminar

</button>



</div>


`;



});



}









// BUSCADOR


document
.getElementById("buscarOferta")
.oninput=(e)=>{


textoBusqueda=
e.target.value.toLowerCase();


mostrarOfertas();


};






document
.getElementById("filtroCategoria")
.onchange=(e)=>{


categoriaSeleccionada=e.target.value;


mostrarOfertas();


};






document
.getElementById("ordenarOferta")
.onchange=(e)=>{


ordenSeleccionado=e.target.value;


mostrarOfertas();


};









// ELIMINAR


window.eliminarOferta=async(id)=>{


if(confirm("¿Eliminar oferta?")){


await deleteDoc(

doc(
db,
"ofertas",
id
)

);


}


};








// SALIR


const salir =
document.getElementById("salir");


if(salir){


salir.onclick=()=>{


signOut(auth);


window.location.href="login.html";


};


}