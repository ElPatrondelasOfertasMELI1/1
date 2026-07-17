// =====================================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS FINAL
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






// ================================
// VARIABLES
// ================================


let imagenBase64 = "";







// ================================
// MENSAJE TOAST
// ================================


function mostrarMensaje(texto){



let toast =

document.getElementById("toastAdmin");




if(!toast){


toast =
document.createElement("div");


toast.id="toastAdmin";


document.body.appendChild(toast);


}




toast.innerHTML = texto;


toast.classList.add("show");





setTimeout(()=>{


toast.classList.remove("show");


},2500);



}









// ================================
// IMAGEN BASE64
// ================================


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





const lector =

new FileReader();





lector.onload=(e)=>{


imagenBase64 = e.target.result;




if(preview){



preview.src = imagenBase64;



preview.style.display="block";



}




};






lector.readAsDataURL(archivo);



}

);


}
// =====================================================
// ADMIN.JS FINAL
// PARTE 2/3
// GUARDAR OFERTAS Y CUPONES
// =====================================================



// ================================
// PUBLICAR OFERTA
// ================================


const publicar =

document.getElementById("publicar");





if(publicar){



publicar.onclick = async()=>{



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

"⚠️ Completa los datos"

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


tipo:tipoOferta,


destacada:

tipoOferta==="destacada",



creado:

serverTimestamp()



}


);






mostrarMensaje(

"🔥 Oferta publicada"

);





imagenBase64="";


document.getElementById("titulo").value="";


document.getElementById("precioAntes").value="";


document.getElementById("precioFinal").value="";


document.getElementById("link").value="";


document.getElementById("imagen").value="";



if(preview)

preview.style.display="none";





cargarOfertasAdmin();



}



catch(error){



console.error(error);



mostrarMensaje(

"❌ Error al publicar"

);



}



};



}










// ================================
// GUARDAR CUPÓN
// ================================


const crearCupon =

document.getElementById("crearCupon");






if(crearCupon){



crearCupon.onclick = async()=>{



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






// nuevo estado


const estado =

document.getElementById("estadoCupon")

?

document.getElementById("estadoCupon").value

:

"activo";







if(!codigo){



mostrarMensaje(

"⚠️ Falta código"

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


estado,


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



};



}

// =====================================================
// ADMIN.JS FINAL
// PARTE 3/3
// LISTAS + BORRAR + CONTADORES
// =====================================================



const listaOfertas =

document.getElementById("listaOfertas");



const listaCupones =

document.getElementById("listaCupones");









// ================================
// OFERTAS ADMIN
// ================================


async function cargarOfertasAdmin(){



if(!listaOfertas)return;



listaOfertas.innerHTML="";




const datos =

await getDocs(

collection(db,"ofertas")

);





datos.forEach((item)=>{



const oferta=item.data();



const tarjeta=

document.createElement("div");



tarjeta.className="ofertaAdmin";






tarjeta.innerHTML=`

<img src="${oferta.imagen}">



<h3>

${oferta.titulo}

</h3>



<p>

💰 $${oferta.precioFinal}

</p>



<p>

${oferta.tipo==="relampago"

?"⚡ RELÁMPAGO"

:

oferta.destacada

?"⭐ DESTACADA"

:

"🔥 NORMAL"

}

</p>



<button>

🗑️ ELIMINAR

</button>


`;





tarjeta.querySelector("button")

.onclick=async()=>{



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





listaOfertas.appendChild(tarjeta);



});



}









// ================================
// CUPONES ADMIN
// ================================


async function cargarCuponesAdmin(){



if(!listaCupones)return;



listaCupones.innerHTML="";




const datos =

await getDocs(

collection(db,"cupones")

);






datos.forEach((item)=>{



const cupon=item.data();



const tarjeta=

document.createElement("div");



tarjeta.className="ofertaAdmin";






let estado=

"🟢 DISPONIBLE";



if(cupon.estado==="agotando"){


estado=

"⚡ ÚLTIMAS PIEZAS";


}



if(cupon.estado==="agotado"){


estado=

"🔴 AGOTADO";


}






tarjeta.innerHTML=`

<h3>

🎟️ ${cupon.nombre || "CUPÓN"}

</h3>



<strong>

${cupon.codigo}

</strong>



<p>

${estado}

</p>



<p>

💰 Descuento:
$${cupon.descuento}

</p>



<p>

🛒 Compra mínima:
$${cupon.minimo}

</p>



<p>

📋 Copias:
${cupon.copias || 0}

</p>



<button>

🗑️ ELIMINAR

</button>


`;






tarjeta.querySelector("button")

.onclick=async()=>{



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






listaCupones.appendChild(tarjeta);



});



}









// ================================
// CONTADORES
// ================================


async function actualizarContadores(){



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


actualizarContadores();