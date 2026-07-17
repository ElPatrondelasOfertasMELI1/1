// =====================================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS FINAL MEJORADO
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

let ofertaEditando=null;









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
// LIMPIAR OFERTA
// ============================


function limpiarOferta(){


titulo.value="";

precioAntes.value="";

precioFinal.value="";

descuento.value="";

link.value="";

tipoOferta.value="normal";


imagen.value="";


imagenBase64="";


preview.src="";


preview.style.display="none";


ofertaEditando=null;


document.getElementById("publicar").innerHTML=

"🔥 PUBLICAR OFERTA";


}

// ============================
// PUBLICAR / ACTUALIZAR OFERTA
// ============================


document
.getElementById("publicar")
?.addEventListener(
"click",
async()=>{


// SI ESTAMOS EDITANDO

if(ofertaEditando){


await updateDoc(

doc(
db,
"ofertas",
ofertaEditando
),

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
tipoOferta.value


}

);



mensaje(
"✏️ Oferta actualizada"
);



limpiarOferta();


cargarOfertas();


actualizarDashboard();


return;


}






// NUEVA OFERTA


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



limpiarOferta();



cargarOfertas();


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
❌ Antes:
$${o.precioAntes || ""}
</p>


<p>
🔥 ${o.descuento || ""}
</p>



<p>
💥 $${o.precioFinal}
</p>



<p>
🖱️ Clics:
${o.clics || 0}
</p>



<button class="editBtn">

✏️ EDITAR

</button>



<button class="deleteBtn">

🗑️ ELIMINAR

</button>


`;









// EDITAR


div.querySelector(".editBtn")
.onclick=()=>{


ofertaEditando=item.id;



titulo.value=o.titulo;


precioAntes.value=o.precioAntes;


precioFinal.value=o.precioFinal;


descuento.value=o.descuento;


link.value=o.link;


tipoOferta.value=o.tipo;



imagenBase64=o.imagen;



preview.src=o.imagen;


preview.style.display="block";



document.getElementById("publicar").innerHTML=

"✏️ ACTUALIZAR OFERTA";



window.scrollTo({

top:0,

behavior:"smooth"

});



};









// ELIMINAR


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
// CREAR CUPÓN
// ============================


document
.getElementById("crearCupon")
?.addEventListener(
"click",
async()=>{


let nombreFinal;



if(tipoCupon.value==="relampago"){


nombreFinal="Cupon";


}else{


nombreFinal=nombreCupon.value;


}






await addDoc(

collection(db,"cupones"),

{


codigo:

codigoCupon.value,


nombre:

nombreFinal,


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






// LIMPIAR CAMPOS


codigoCupon.value="";


nombreCupon.value="";


descuentoCupon.value="";


minimoCupon.value="";


tipoCupon.value="relampago";


estadoCupon.value="activo";





cargarCupones();


actualizarDashboard();



}

);









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

💰 Descuento:
$${c.descuento}

</p>



<p>

🛒 Compra mínima:
$${c.minimo}

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








// CAMBIAR ESTADO


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









// ELIMINAR


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





if(document.getElementById("totalOfertas"))

totalOfertas.innerHTML=

ofertas.size;



if(document.getElementById("totalCupones"))

totalCupones.innerHTML=

cupones.size;



if(document.getElementById("totalClics"))

totalClics.innerHTML=

clics;



if(document.getElementById("totalCopias"))

totalCopias.innerHTML=

copias;



}









// ============================
// INICIO
// ============================


cargarOfertas();


cargarCupones();


actualizarDashboard();
