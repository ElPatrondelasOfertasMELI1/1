// =====================================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS PRO CORREGIDO
// PARTE 1/4
// =====================================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
addDoc,
getDocs,
doc,
updateDoc,
deleteDoc,
serverTimestamp,
increment,
setDoc,
getDoc

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// ==============================
// FIREBASE
// ==============================


const firebaseConfig={


apiKey:"AIzaSyBo_wk-k8TrcSl0MQzQ0hoUCvAKre94hW0",

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





// ==============================
// VARIABLES
// ==============================


let imagenBase64="";

let ofertaEditando=null;





// ==============================
// TOAST
// ==============================


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








// ==============================
// IMAGEN
// ==============================


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









// ==============================
// LIMPIAR FORMULARIO
// ==============================


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









// ==============================
// PUBLICAR OFERTA
// ==============================


document

.getElementById("publicar")

?.addEventListener(

"click",

async()=>{



if(!titulo.value || !precioFinal.value){


mensaje("⚠️ Completa los datos");


return;


}





// EDITAR


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


cargarEstadisticas();


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


cargarEstadisticas();



}

);
// =====================================================
// OFERTAS ADMIN
// PARTE 2/4
// =====================================================


async function cargarOfertas(){


const lista =
document.getElementById("listaOfertas");


if(!lista)return;



lista.innerHTML="Cargando...";



const datos =
await getDocs(

collection(db,"ofertas")

);





lista.innerHTML="";





datos.forEach(item=>{



const o=item.data();




const div =
document.createElement("div");



div.className="ofertaAdmin";




div.innerHTML=`

<img src="${o.imagen || ""}">



<h3>

${o.titulo || "Sin título"}

</h3>



<p>

❌ Antes:

$${o.precioAntes || 0}

</p>



<p>

🔥 Descuento:

${o.descuento || 0}%

</p>



<p>

💥 Precio:

$${o.precioFinal || 0}

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









// ==============================
// EDITAR
// ==============================


div

.querySelector(".editBtn")

.onclick=()=>{



ofertaEditando=item.id;



titulo.value=o.titulo || "";


precioAntes.value=o.precioAntes || "";


precioFinal.value=o.precioFinal || "";


descuento.value=o.descuento || "";


link.value=o.link || "";


tipoOferta.value=o.tipo || "normal";




imagenBase64=o.imagen || "";



preview.src=o.imagen || "";


preview.style.display="block";




document.getElementById("publicar").innerHTML=

"✏️ ACTUALIZAR OFERTA";





window.scrollTo({

top:0,

behavior:"smooth"

});



};










// ==============================
// ELIMINAR
// ==============================


div

.querySelector(".deleteBtn")

.onclick=async()=>{



if(!confirm("¿Eliminar oferta?"))

return;




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


cargarEstadisticas();



};





lista.appendChild(div);



});



}
// =====================================================
// CUPONES ADMIN
// PARTE 3/4
// =====================================================


// ==============================
// CREAR CUPON
// ==============================


document

.getElementById("crearCupon")

?.addEventListener(

"click",

async()=>{



if(!codigoCupon.value){


mensaje("⚠️ Escribe un código");


return;


}





await addDoc(

collection(db,"cupones"),

{


codigo:

codigoCupon.value,


nombre:

nombreCupon.value || "CUPON",



descuento:

descuentoCupon.value,


minimo:

minimoCupon.value,


tipo:

tipoCupon.value,


estado:

estadoCupon.value,


copias:0,


creado:

serverTimestamp()



}

);






mensaje(

"🎟️ Cupón guardado"

);







codigoCupon.value="";

nombreCupon.value="";

descuentoCupon.value="";

minimoCupon.value="";



tipoCupon.value="relampago";


estadoCupon.value="activo";





cargarCupones();


cargarEstadisticas();



}

);









// ==============================
// CARGAR CUPONES
// ==============================


async function cargarCupones(){



const lista =

document.getElementById("listaCupones");



if(!lista)return;



lista.innerHTML="Cargando...";





const datos =

await getDocs(

collection(db,"cupones")

);





lista.innerHTML="";







datos.forEach(item=>{



const c=item.data();





const div=

document.createElement("div");



div.className="ofertaAdmin";






div.innerHTML=`

<h3>

🎟️ ${c.nombre || "CUPON"}

</h3>



<strong>

${c.codigo || ""}

</strong>



<p>

💰 Descuento:

$${c.descuento || 0}

</p>




<p>

🛒 Compra mínima:

$${c.minimo || 0}

</p>




<p>

Estado:

${c.estado || "activo"}

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









// ==============================
// CAMBIAR ESTADO
// ==============================


div

.querySelector(".estadoBtn")

.onclick=async()=>{



let nuevoEstado;



if(c.estado==="activo"){


nuevoEstado="agotando";


}

else if(c.estado==="agotando"){


nuevoEstado="agotado";


}

else{


nuevoEstado="activo";


}






await updateDoc(

doc(

db,

"cupones",

item.id

),

{


estado:

nuevoEstado


}

);





mensaje(

"✅ Estado actualizado"

);





cargarCupones();



};









// ==============================
// ELIMINAR CUPON
// ==============================


div

.querySelector(".deleteBtn")

.onclick=async()=>{



if(!confirm("¿Eliminar cupón?"))

return;





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


cargarEstadisticas();



};






lista.appendChild(div);



});



}
// =====================================================
// ESTADISTICAS DASHBOARD
// PARTE 4/4
// =====================================================


// ==============================
// CARGAR ESTADISTICAS
// ==============================


async function cargarEstadisticas(){



const ofertas =

await getDocs(

collection(db,"ofertas")

);





const cupones =

await getDocs(

collection(db,"cupones")

);





let totalClics=0;

let totalCopias=0;







ofertas.forEach(item=>{


const o=item.data();



totalClics +=

Number(o.clics || 0);



});







cupones.forEach(item=>{


const c=item.data();



totalCopias +=

Number(c.copias || 0);



});








// OFERTAS


const totalOfertas =

document.getElementById("totalOfertas");



if(totalOfertas)

totalOfertas.innerHTML=

ofertas.size;








// CUPONES


const totalCupones =

document.getElementById("totalCupones");



if(totalCupones)

totalCupones.innerHTML=

cupones.size;








// CLICS


const totalClicsDOM =

document.getElementById("totalClics");



if(totalClicsDOM)

totalClicsDOM.innerHTML=

totalClics;








// COPIAS


const totalCopiasDOM =

document.getElementById("totalCopias");



if(totalCopiasDOM)

totalCopiasDOM.innerHTML=

totalCopias;








// VISITAS


const visitas =

await getDoc(

doc(

db,

"estadisticas",

"visitas"

)

);





const totalVisitasDOM =

document.getElementById("totalVisitas");





if(

totalVisitasDOM

){



totalVisitasDOM.innerHTML =


visitas.exists()

?

visitas.data().total || 0

:

0;


}





// USUARIOS

const usuarios =

await getDocs(

collection(db,"usuarios")

);



const totalUsuarios =

document.getElementById("totalUsuarios");




if(totalUsuarios)

totalUsuarios.innerHTML=

usuarios.size;



}





// =====================================================
// REGIONES
// =====================================================


async function cargarRegiones(){


const lista =
document.getElementById("listaRegiones");


if(!lista)return;



lista.innerHTML="Cargando...";



const datos =
await getDocs(

collection(
db,
"regiones"
)

);



let regiones=[];



datos.forEach(item=>{


const r=item.data();


regiones.push({

nombre:item.id,

visitas:r.visitas || 0

});


});





regiones.sort((a,b)=>{

return b.visitas-a.visitas;

});





lista.innerHTML="";





regiones.forEach(r=>{


const div =
document.createElement("div");


div.className="ofertaAdmin";


div.innerHTML=`

<h3>

🌎 ${r.nombre}

</h3>


<p>

👥 Visitas:

<strong>

${r.visitas}

</strong>

</p>


`;



lista.appendChild(div);



});



}



// ==============================
// INICIAR PANEL
// ==============================


cargarOfertas();


cargarCupones();


cargarEstadisticas();







// ==============================
// ACTUALIZAR AUTOMATICO
// ==============================


setInterval(()=>{


cargarEstadisticas();


},30000);






// ==============================
// BOTON SALIR
// ==============================


document

.getElementById("salir")

?.addEventListener(

"click",

()=>{


window.location.href="index.html";


}

);



// =====================================================
// FIN ADMIN.JS
// =====================================================