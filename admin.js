// =====================================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS
// VERSION CORREGIDA
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



import {

getAuth,
signOut

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




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



const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);





// ================================
// VARIABLES
// ================================


let imagenBase64 = "";





// ================================
// IMAGEN GALERÍA
// ================================


const archivoImagen =
document.getElementById("imagenArchivo");



const preview =
document.getElementById("previewImagen");




if(archivoImagen){


archivoImagen.addEventListener(

"change",

()=>{


const archivo =
archivoImagen.files[0];


if(!archivo) return;



const lector =
new FileReader();



lector.onload = e=>{


imagenBase64 =
e.target.result;


if(preview){


preview.src =
imagenBase64;


preview.style.display =
"block";


}


};



lector.readAsDataURL(archivo);



});


}







// ================================
// PUBLICAR OFERTA
// ================================


const botonPublicar =
document.getElementById("publicar");





if(botonPublicar){


botonPublicar.onclick = async()=>{


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
"Completa todos los campos"
);


return;


}






botonPublicar.innerHTML =
"PUBLICANDO...";





await addDoc(

collection(db,"ofertas"),

{


titulo,

precioAntes,

precioFinal,

link,

imagen:imagenBase64,

clics:0,

destacada,

creado:
serverTimestamp()


}

);






mostrarMensaje(
"🔥 Oferta publicada"
);




limpiarFormulario();


cargarOfertas();



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
// CREAR CUPÓN
// ================================


const botonCupon =

document.getElementById("crearCupon");





if(botonCupon){



botonCupon.onclick = async()=>{


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
"Falta código"
);


return;


}





await addDoc(

collection(db,"cupones"),

{


codigo,

descuento,

minimo,

tipo,

estado,

copias:0


}

);






mostrarMensaje(
"🎟️ Cupón creado"
);





cargarCupones();



}

catch(error){


console.error(error);


mostrarMensaje(
"❌ Error al crear cupón"
);


}




};



}









// ================================
// LISTAR OFERTAS
// ================================


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


const oferta =
item.data();



const div =
document.createElement("div");



div.className =
"ofertaAdmin";



div.innerHTML =

`

<h3>${oferta.titulo}</h3>

<p>$${oferta.precioFinal}</p>


<button>
🗑️ BORRAR
</button>

`;



div.querySelector("button")
.onclick=async()=>{


await deleteDoc(

doc(
db,
"ofertas",
item.id

)

);


cargarOfertas();


};



lista.appendChild(div);



});


}








// ================================
// LISTAR CUPONES
// ================================


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


const cupon =
item.data();



const div =
document.createElement("div");



div.className =
"ofertaAdmin";



div.innerHTML =

`

<h3>
${cupon.codigo || "Cupón"}
</h3>

<p>
$${cupon.descuento}
</p>


<button>
🗑️ BORRAR
</button>

`;



div.querySelector("button")
.onclick=async()=>{


await deleteDoc(

doc(
db,
"cupones",
item.id

)

);



cargarCupones();


};



lista.appendChild(div);



});



}








// ================================
// LIMPIAR
// ================================


function limpiarFormulario(){


document.querySelectorAll("input")
.forEach(i=>{


if(i.type!=="checkbox")

i.value="";


});



imagenBase64="";



if(preview)

preview.style.display="none";


}







// ================================
// MENSAJE
// ================================


function mostrarMensaje(texto){


console.log(texto);


alert(texto);


}







// ================================
// SALIR
// ================================


const salir =
document.getElementById("salir");



if(salir){


salir.onclick=async()=>{


await signOut(auth);


location.href="login.html";


};


}






// ================================
// INICIO
// ================================


cargarOfertas();

cargarCupones();

// =====================================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS
// CARRUSEL + CUPONES
// =====================================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
getDocs,
doc,
updateDoc,
increment

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// ================================
// FIREBASE
// ================================


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





// ================================
// ELEMENTOS
// ================================


const carrusel =
document.getElementById("carrusel");


const relampago =
document.getElementById("cuponesRelampago");


const bancarios =
document.getElementById("cuponesBancarios");


const exclusivos =
document.getElementById("cuponesExclusivos");


const toast =
document.getElementById("toast");







// ================================
// TOAST
// ================================


function mostrarToast(texto){


if(!toast)return;


toast.innerHTML=texto;


toast.classList.add("show");



setTimeout(()=>{


toast.classList.remove("show");


},2000);



}







// =====================================================
// OFERTAS
// =====================================================


async function cargarOfertas(){



const datos =
await getDocs(

collection(db,"ofertas")

);



let ofertas=[];



datos.forEach(d=>{


ofertas.push({

id:d.id,

...d.data()

});


});





// PRIORIDAD


ofertas.sort((a,b)=>{


let A =
a.destacada ? 1 :
a.tipo==="relampago" ? 2 : 3;



let B =
b.destacada ? 1 :
b.tipo==="relampago" ? 2 : 3;



return A-B;


});






carrusel.innerHTML="";





ofertas.forEach(oferta=>{


const card =
document.createElement("div");



card.className=
"ofertaCard";





card.innerHTML=`

<img src="${oferta.imagen}">


<div class="ofertaTexto">


<h3>
${oferta.titulo}
</h3>


<p class="antes">

${oferta.precioAntes || ""}

</p>



<h2>

$${oferta.precioFinal}

</h2>



<a href="${oferta.link}"
target="_blank"
class="comprar">

🛒 Comprar

</a>


</div>

`;





card.querySelector(".comprar")
.onclick=()=>{


sumarClic(oferta.id);


};




carrusel.appendChild(card);


});



activarCarrusel();



}









// ================================
// CLICS
// ================================


async function sumarClic(id){


await updateDoc(

doc(db,"ofertas",id),

{

clics:
increment(1)

}

);



}









// ================================
// CARRUSEL AUTOMÁTICO
// ================================


function activarCarrusel(){



let posicion=0;


let detenido=false;



carrusel.addEventListener(

"touchstart",

()=>{

detenido=true;

}

);



carrusel.addEventListener(

"touchend",

()=>{


setTimeout(()=>{

detenido=false;

},1000);


}

);





setInterval(()=>{



if(detenido)return;



if(
carrusel.scrollWidth <=
carrusel.clientWidth
)
return;



posicion +=
carrusel.clientWidth;



if(
posicion >= carrusel.scrollWidth
)

{

posicion=0;

}





carrusel.scrollTo({

left:posicion,

behavior:"smooth"

});



},3000);



}









// =====================================================
// CUPONES
// =====================================================


async function cargarCupones(){



const datos =

await getDocs(

collection(db,"cupones")

);



let lista=[];



datos.forEach(d=>{


lista.push({

id:d.id,

...d.data()

});


});






lista.sort((a,b)=>{


return (

parseInt(a.minimo.replace(/\D/g,""))

-

parseInt(b.minimo.replace(/\D/g,""))

);


});






lista.forEach(c=>{


let tarjeta =

crearCupon(c);



if(c.tipo==="relampago")

relampago.appendChild(tarjeta);



if(c.tipo==="bancario")

bancarios.appendChild(tarjeta);



if(c.tipo==="exclusivo")

exclusivos.appendChild(tarjeta);



});



}









function crearCupon(cupon){



const div =
document.createElement("div");



div.className=
"cuponCard";





div.innerHTML=`

<h3>
🎟️ CUPÓN
</h3>


<strong>

${cupon.codigo || "DISPONIBLE"}

</strong>


<p>

💰 $${cupon.descuento}

</p>


<p>

🛒 ${cupon.minimo}

</p>


<button>

📋 COPIAR CUPÓN

</button>


`;






div.querySelector("button")
.onclick=()=>{


copiar(

cupon.codigo

);



};



return div;



}







async function copiar(codigo){



await navigator.clipboard.writeText(
codigo
);



mostrarToast(

"✅ CUPÓN COPIADO"

);





setTimeout(()=>{


location.href=
"https://meli.la/1mj3itE";


},800);



}









// ================================
// INICIO
// ================================


cargarOfertas();


cargarCupones();

