// =====================================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS FINAL
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
updateDoc,
serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// FIREBASE

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




let imagenBase64="";




// ============================
// TOAST
// ============================


function mensaje(texto){


const toast =
document.getElementById("toastAdmin");


if(!toast)return;


toast.innerHTML=texto;


toast.classList.add("show");



setTimeout(()=>{


toast.classList.remove("show");


},2000);



}









// ============================
// IMAGEN
// ============================


const imagen =
document.getElementById("imagen");


const preview =
document.getElementById("preview");




imagen?.addEventListener(
"change",
()=>{


const archivo =
imagen.files[0];


if(!archivo)return;


const reader =
new FileReader();



reader.onload=e=>{


imagenBase64=e.target.result;


preview.src=e.target.result;


preview.style.display="block";


};



reader.readAsDataURL(archivo);


}

);









// ============================
// PUBLICAR OFERTA
// ============================


document
.getElementById("publicar")
?.addEventListener(
"click",
async()=>{



await addDoc(

collection(db,"ofertas"),

{


titulo:
titulo.value,


imagen:
imagenBase64,


precioAntes:
precioAntes.value,


precioFinal:
precioFinal.value,


descuento:
descuento.value,


link:
link.value,


tipo:
tipoOferta.value,


clics:0,


creado:
serverTimestamp()


}

);



mensaje(
"🔥 Oferta publicada"
);



cargarOfertas();

actualizarDashboard();



}

);









// ============================
// CREAR CUPÓN
// ============================


document
.getElementById("crearCupon")
?.addEventListener(
"click",
async()=>{



await addDoc(

collection(db,"cupones"),

{


codigo:
codigoCupon.value,


nombre:
nombreCupon.value,


descuento:
descuentoCupon.value,


minimo:
minimoCupon.value,


tipo:
tipoCupon.value,


estado:
estadoCupon.value,


copias:0


}

);



mensaje(
"🎟️ Cupón guardado"
);



cargarCupones();

actualizarDashboard();



}

);









// ============================
// OFERTAS ADMIN
// ============================


async function cargarOfertas(){


const lista =
document.getElementById("listaOfertas");


if(!lista)return;


lista.innerHTML="";



const datos =
await getDocs(
collection(db,"ofertas")
);




datos.forEach(item=>{


const o=item.data();



const div =
document.createElement("div");


div.className="ofertaAdmin";



div.innerHTML=`

<img src="${o.imagen}">


<h3>
${o.titulo}
</h3>


<p>
💰 $${o.precioFinal}
</p>


<p>
🖱️ Clics: ${o.clics || 0}
</p>


<button class="deleteBtn">
🗑️ ELIMINAR
</button>

`;



div.querySelector(".deleteBtn")
.onclick=async()=>{


await deleteDoc(

doc(
db,
"ofertas",
item.id
)

);



mensaje(
"🗑️ Oferta eliminada"
);



cargarOfertas();

actualizarDashboard();


};




lista.appendChild(div);


});



}









// ============================
// CUPONES ADMIN
// ============================


async function cargarCupones(){


const lista =
document.getElementById("listaCupones");


if(!lista)return;



lista.innerHTML="";



const datos =
await getDocs(
collection(db,"cupones")
);




datos.forEach(item=>{


const c=item.data();



const div =
document.createElement("div");


div.className="ofertaAdmin";



div.innerHTML=`

<h3>
🎟️ ${c.nombre}
</h3>


<strong>
${c.codigo}
</strong>


<p>
💰 Descuento: $${c.descuento}
</p>


<p>
🛒 Compra mínima: $${c.minimo}
</p>


<p>
Estado:
${c.estado}
</p>


<p>
📋 Copias:
${c.copias || 0}
</p>



<button class="estadoBtn">
🔄 CAMBIAR ESTADO
</button>



<button class="deleteBtn">
🗑️ ELIMINAR
</button>

`;





div.querySelector(".estadoBtn")
.onclick=async()=>{


let nuevo;


if(c.estado==="activo")

nuevo="agotando";


else if(c.estado==="agotando")

nuevo="agotado";


else

nuevo="activo";




await updateDoc(

doc(
db,
"cupones",
item.id
),

{

estado:nuevo

}

);



mensaje(
"✅ Estado actualizado"
);



cargarCupones();



};






div.querySelector(".deleteBtn")
.onclick=async()=>{


await deleteDoc(

doc(
db,
"cupones",
item.id
)

);



mensaje(
"🗑️ Cupón eliminado"
);



cargarCupones();


};



lista.appendChild(div);



});



}









// ============================
// DASHBOARD
// ============================


async function actualizarDashboard(){



const ofertas =
await getDocs(
collection(db,"ofertas")
);



const cupones =
await getDocs(
collection(db,"cupones")
);



let clics=0;

let copias=0;




ofertas.forEach(o=>{


clics += o.data().clics || 0;


});




cupones.forEach(c=>{


copias += c.data().copias || 0;


});





totalOfertas.innerHTML =
ofertas.size;



totalCupones.innerHTML =
cupones.size;



totalClics.innerHTML =
clics;



totalCopias.innerHTML =
copias;



}









// ============================
// INICIO
// ============================


cargarOfertas();


cargarCupones();


actualizarDashboard();
