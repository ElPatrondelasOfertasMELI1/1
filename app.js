// =====================================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS
// PARTE 1 DE 4
// FIREBASE + CARGA PRINCIPAL
// =====================================================


// ================================
// FIREBASE
// ================================


import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,

collection,

getDocs,

doc,

updateDoc,

increment,

query,

orderBy

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// ================================
// CONFIGURACIÓN FIREBASE REAL
// ================================


const firebaseConfig = {


apiKey: "AIzaSyBo_wk-k8TrcSl0CMQz0hoUCvAKre94hW0",

authDomain: "patronofertasweb.firebaseapp.com",

projectId: "patronofertasweb",

storageBucket: "patronofertasweb.firebasestorage.app",

messagingSenderId: "292338334268",

appId: "1:292338334268:web:9dbbafe00dd23ebb72e139"


};





// INICIAR FIREBASE


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);







// ================================
// ELEMENTOS HTML
// ================================


const carrusel = 
document.getElementById("carrusel");



const cuponesRelampago =
document.getElementById("cuponesRelampago");



const cuponesBancarios =
document.getElementById("cuponesBancarios");



const cuponesExclusivos =
document.getElementById("cuponesExclusivos");



const toast =
document.getElementById("toast");






// ================================
// MOSTRAR TOAST
// ================================


function mostrarToast(texto){


if(!toast) return;



toast.innerHTML = texto;


toast.classList.add("show");



setTimeout(()=>{


toast.classList.remove("show");


},2000);



}






// ================================
// CARGAR OFERTAS
// ================================


async function cargarOfertas(){


try{


const referencia =
collection(db,"ofertas");



const consulta =
query(

referencia,

orderBy(
"creado",
"desc"
)

);



const resultado =
await getDocs(consulta);



carrusel.innerHTML="";



if(resultado.empty){


carrusel.innerHTML =

`
<div class="loader">
No hay ofertas disponibles
</div>
`;

return;


}




let ofertas=[];



resultado.forEach((documento)=>{


ofertas.push({

id:documento.id,

...documento.data()

});


});



// ORDEN PRIORIDAD
// 1 DESTACADAS
// 2 RELÁMPAGO
// 3 NORMALES


ofertas.sort((a,b)=>{


let prioridadA =
a.destacada ? 1 :
a.tipo==="relampago" ? 2 : 3;



let prioridadB =
b.destacada ? 1 :
b.tipo==="relampago" ? 2 : 3;



return prioridadA-prioridadB;


});



ofertas.forEach((oferta)=>{


crearOferta(oferta);


});



}

catch(error){


console.error(
"Error cargando ofertas",
error
);



carrusel.innerHTML=

`
<div class="loader">
Error cargando ofertas
</div>
`;

}


}

// =====================================================
// APP.JS
// PARTE 2 DE 4
// TARJETAS DE OFERTAS
// =====================================================




// ================================
// CREAR TARJETA OFERTA
// ================================


function crearOferta(oferta){



const tarjeta =
document.createElement("div");



tarjeta.className =
"oferta";





let etiqueta="";



if(oferta.destacada){


etiqueta =

`
<span class="badge destacada">
⭐ DESTACADA
</span>
`;

}

else if(oferta.tipo==="relampago"){


etiqueta =

`
<span class="badge relampago">
⚡ RELÁMPAGO
</span>
`;

}





tarjeta.innerHTML =



`

${etiqueta}


<img src="${oferta.imagen || 'logo.png'}">



<div class="info">



<h3>

${oferta.titulo || "Oferta"}

</h3>





${
oferta.precioAntes ?

`

<p class="precioAntes">

$${oferta.precioAntes}

</p>

`

:

""

}





<div class="precioFinal">

$${oferta.precioFinal || ""}

</div>






<a

class="btnComprar"

href="${oferta.link}"

target="_blank"

>

🛒 COMPRAR

</a>



</div>


`;






const boton =
tarjeta.querySelector(".btnComprar");





boton.addEventListener(
"click",
()=>{


registrarClicOferta(oferta.id);


}

);





carrusel.appendChild(tarjeta);



}







// ================================
// REGISTRAR CLIC OFERTA
// ================================


async function registrarClicOferta(id){


try{


const referencia =

doc(

db,

"ofertas",

id

);



await updateDoc(

referencia,

{


clics:
increment(1)


}

);



}

catch(error){


console.error(

"Error sumando clic",

error

);


}



}

// =====================================================
// APP.JS
// PARTE 3 DE 4
// CUPONES
// =====================================================




// ================================
// CARGAR CUPONES
// ================================


async function cargarCupones(){


try{


const referencia =

collection(

db,

"cupones"

);



const resultado =

await getDocs(referencia);




cuponesRelampago.innerHTML="";

cuponesBancarios.innerHTML="";

cuponesExclusivos.innerHTML="";




let relampago=[];

let bancarios=[];

let exclusivos=[];





resultado.forEach((documento)=>{


const cupon={


id:documento.id,


...documento.data()


};




if(cupon.tipo==="relampago"){


relampago.push(cupon);


}


else if(cupon.tipo==="bancario"){


bancarios.push(cupon);


}


else if(cupon.tipo==="exclusivo"){


exclusivos.push(cupon);


}


});






// ORDENAR POR MINIMO


const ordenar = (a,b)=>{


let minimoA =
parseInt(
String(a.minimo)
.replace(/\D/g,"")
)
||0;



let minimoB =
parseInt(
String(b.minimo)
.replace(/\D/g,"")
)
||0;



return minimoA-minimoB;


};




relampago.sort(ordenar);

bancarios.sort(ordenar);

exclusivos.sort(ordenar);






relampago.forEach(crearCuponRelampago);


bancarios.forEach(crearCuponBancario);


exclusivos.forEach(crearCuponExclusivo);





}

catch(error){


console.error(

"Error cargando cupones",

error

);



}



}







// ================================
// CREAR CUPÓN
// ================================


function tarjetaCupon(cupon,tipoTexto){



const div =

document.createElement("div");



div.className="cupon";





div.innerHTML =



`

<h3>

🎟️ CUPÓN DISPONIBLE

</h3>



<p>

💰 Descuento:

<strong>

$${cupon.descuento || ""}

</strong>

</p>




<p>

🛒 Compra mínima:

<strong>

${cupon.minimo || ""}

</strong>

</p>




<p>

${tipoTexto}

</p>




<span class="estado ${cupon.estado || ''}">

${cupon.estado || "activo"}

</span>




<button class="btnCupon">

📋 COPIAR CUPÓN

</button>



`;





const boton =

div.querySelector(".btnCupon");





boton.onclick=()=>{


copiarCupon(cupon.id);




};



return div;



}







function crearCuponRelampago(cupon){


cuponesRelampago.appendChild(

tarjetaCupon(

cupon,

"⚡ Relámpago"

)

);


}





function crearCuponBancario(cupon){


cuponesBancarios.appendChild(

tarjetaCupon(

cupon,

"💳 Bancario"

)

);


}





function crearCuponExclusivo(cupon){


cuponesExclusivos.appendChild(

tarjetaCupon(

cupon,

"⭐ Exclusivo"

)

);


}







// ================================
// COPIAR CUPÓN
// ================================


async function copiarCupon(codigo){



try{



await navigator.clipboard.writeText(

codigo

);





mostrarToast(

"✅ CUPÓN COPIADO"

);





const referencia =

doc(

db,

"cupones",

codigo

);





await updateDoc(

referencia,

{


copias:

increment(1)


}

);





setTimeout(()=>{


window.location.href =

"https://meli.la/1mj3itE";



},800);






}

catch(error){


console.error(

"Error copiando cupón",

error

);



}



}

// =====================================================
// APP.JS
// PARTE 4 DE 4
// FUNCIONES FINALES
// =====================================================





// ================================
// MENÚ LATERAL
// ================================


const botonMenu =

document.getElementById(
"abrirMenu"
);



const menuPanel =

document.getElementById(
"menuPanel"
);



const overlay =

document.getElementById(
"overlay"
);





function abrirCerrarMenu(){


if(!menuPanel || !overlay)
return;



menuPanel.classList.toggle(
"active"
);



overlay.classList.toggle(
"active"
);



}







if(botonMenu){


botonMenu.addEventListener(

"click",

abrirCerrarMenu

);


}



if(overlay){


overlay.addEventListener(

"click",

abrirCerrarMenu

);


}







// ================================
// AHORRO COMUNIDAD
// UNA VEZ AL DÍA
// ================================


function ahorroComunidad(){



const hoy =

new Date()

.toISOString()

.split("T")[0];





const guardado =

localStorage.getItem(
"ahorroDia"
);





if(guardado !== hoy){



localStorage.setItem(

"ahorroDia",

hoy

);





console.log(

"Ahorro comunidad registrado"

);



}



}








// ================================
// INICIAR PÁGINA
// ================================



cargarOfertas();


cargarCupones();


ahorroComunidad();
