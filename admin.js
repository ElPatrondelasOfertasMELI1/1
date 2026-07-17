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


const firebaseConfig = {


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









// =============================
// IMAGEN
// =============================


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


preview.src=imagenBase64;


preview.style.display="block";


};



reader.readAsDataURL(archivo);



}

);









// =============================
// PUBLICAR OFERTA
// =============================


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


link:
link.value,


tipo:
tipoOferta.value,


destacada:

tipoOferta.value==="destacada",



clics:0,


creado:
serverTimestamp()


}

);



mensaje(
"🔥 Oferta publicada"
);



}

);









// =============================
// GUARDAR CUPÓN
// =============================


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



}

);









// =============================
// LISTA CUPONES
// =============================


async function cargarCupones(){



const contenedor =
document.getElementById("listaCupones");



if(!contenedor)return;



contenedor.innerHTML="";



const datos =
await getDocs(
collection(db,"cupones")
);





datos.forEach(item=>{


const c=item.data();



const div=
document.createElement("div");



div.className="ofertaAdmin";



div.innerHTML=`

<h3>

🎟️ ${c.nombre || "Cupón"}

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
Estado: ${c.estado}
</p>



<p>
📋 Copias: ${c.copias || 0}
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




contenedor.appendChild(div);



});



}









// =============================
// INICIO
// =============================


cargarCupones();

