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
// ADMIN.JS PRO V2
// PARTE 3
// CARGAR OFERTAS + TARJETAS ADMIN
// =======================================


// ESCUCHAR FIRESTORE EN TIEMPO REAL

onSnapshot(

ofertasRef,

(snapshot)=>{


ofertas=[];


let clicksTotal = 0;

let mayorClicks = 0;

let ganadora = "-";



snapshot.forEach((item)=>{


const oferta = {

id:item.id,

...item.data()

};



ofertas.push(oferta);



const clicks =
oferta.clics || 0;



clicksTotal += clicks;



if(clicks > mayorClicks){


mayorClicks = clicks;


ganadora =
oferta.titulo;


}



});




// ACTUALIZAR DASHBOARD

if(contador){

contador.innerHTML =
snapshot.size;

}


if(totalClicks){

totalClicks.innerHTML =
clicksTotal;

}


if(topOferta){

topOferta.innerHTML =
ganadora;

}



// MOSTRAR LISTA

mostrarOfertas();



});






// =======================================
// MOSTRAR OFERTAS EN ADMIN
// =======================================


function mostrarOfertas(){



if(!lista)
return;



lista.innerHTML = "";




// APLICAR BUSCADOR

let resultado =
[...ofertas];



resultado = resultado.filter((oferta)=>{


return oferta.titulo

.toLowerCase()

.includes(textoBusqueda);


});




// FILTRO CATEGORIA

if(categoriaSeleccionada !== "todas"){


resultado = resultado.filter((oferta)=>{


return oferta.categoria === categoriaSeleccionada;


});


}





// ORDENAR

if(ordenSeleccionado==="clics"){


resultado.sort((a,b)=>{


return (b.clics || 0) -

(a.clics || 0);


});


}



if(ordenSeleccionado==="destacadas"){


resultado.sort((a,b)=>{


return Number(b.destacada) -

Number(a.destacada);


});


}







resultado.forEach((oferta)=>{



lista.innerHTML +=


`

<div class="ofertaAdmin">


<img

class="miniatura"

src="${oferta.imagen || 'logo.png'}"

>



<div class="datosOferta">


<h3>

${oferta.titulo}

</h3>



<p>

📂 ${oferta.categoria || "Sin categoría"}

</p>



<p>

💰 $${oferta.precioFinal}

</p>



<p>

🏷️ ${oferta.descuento || ""}

</p>



<p>

${oferta.activo ? "🟢 Activa":"🔴 Inactiva"}

</p>



<p>

👁️ ${oferta.clics || 0} clics

</p>


</div>




<div class="accionesOferta">


<button onclick="editarOferta('${oferta.id}')">

✏️ Editar

</button>



<button onclick="eliminarOferta('${oferta.id}')">

🗑️ Eliminar

</button>


</div>


</div>


`;



});


}

// =======================================
// ADMIN.JS PRO V2
// PARTE 4
// EDITAR + ELIMINAR OFERTAS
// =======================================



// ===============================
// ELIMINAR OFERTA
// ===============================


window.eliminarOferta = async(id)=>{


const confirmar =
confirm(
"¿Seguro que quieres eliminar esta oferta?"
);



if(!confirmar)
return;



try{


await deleteDoc(

doc(
db,
"ofertas",
id

)

);



alert(
"🗑️ Oferta eliminada"
);



}

catch(error){


console.error(error);


alert(
"❌ Error al eliminar"
);


}



};






// ===============================
// EDITAR OFERTA
// ===============================


window.editarOferta = async(id)=>{


try{


ofertaEditando = id;



const referencia =

doc(
db,
"ofertas",
id
);



const datos =

await getDoc(
referencia
);



const oferta =

datos.data();





// MOSTRAR EDITOR


const editor =

document.getElementById("editor");



if(editor){

editor.style.display="block";

}





document.getElementById("editTitulo").value =
oferta.titulo || "";



document.getElementById("editImagen").value =
oferta.imagen || "";



document.getElementById("editPrecioAntes").value =
oferta.precioAntes || "";



document.getElementById("editPrecioFinal").value =
oferta.precioFinal || "";



document.getElementById("editDescuento").value =
oferta.descuento || "";



document.getElementById("editLink").value =
oferta.link || "";





window.scrollTo({

top:0,

behavior:"smooth"

});



}


catch(error){


console.error(error);


alert(
"Error cargando oferta"
);


}



};







// ===============================
// GUARDAR CAMBIOS
// ===============================



const guardarCambios =

document.getElementById("guardarCambios");




if(guardarCambios){



guardarCambios.onclick = async()=>{



if(!ofertaEditando){

return;

}





try{


await updateDoc(


doc(
db,
"ofertas",
ofertaEditando

),


{


titulo:

document.getElementById("editTitulo").value,



imagen:

document.getElementById("editImagen").value,



precioAntes:

document.getElementById("editPrecioAntes").value,



precioFinal:

document.getElementById("editPrecioFinal").value,



descuento:

document.getElementById("editDescuento").value,



link:

document.getElementById("editLink").value



}


);





alert(
"✅ Oferta actualizada"
);




document.getElementById("editor").style.display="none";



ofertaEditando=null;



}



catch(error){


console.error(error);


alert(
"❌ Error actualizando"
);


}



};



}