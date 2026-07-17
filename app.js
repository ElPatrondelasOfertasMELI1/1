// =====================================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS FINAL
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








// ================================
// OFERTAS
// ================================


async function cargarOfertas(){



const snapshot =

await getDocs(

collection(db,"ofertas")

);



let ofertas=[];



snapshot.forEach(d=>{


ofertas.push({

id:d.id,

...d.data()

});


});





ofertas.sort((a,b)=>{


let prioridadA =

a.destacada ? 1 :

a.tipo==="relampago" ? 2 : 3;



let prioridadB =

b.destacada ? 1 :

b.tipo==="relampago" ? 2 : 3;



return prioridadA-prioridadB;


});







carrusel.innerHTML="";






ofertas.forEach(oferta=>{


const card =

document.createElement("div");



card.className="oferta";



card.innerHTML=`

${oferta.destacada ? 
"<div class='badge destacada'>⭐ DESTACADA</div>" : ""}


<img src="${oferta.imagen}">


<div class="ofertaTexto">


<h3>

${oferta.titulo}

</h3>


<p class="precioAntes">

${oferta.precioAntes || ""}

</p>


<h2>

$${oferta.precioFinal}

</h2>



<a class="comprar"
href="${oferta.link}"
target="_blank">

🛒 VER OFERTA

</a>


</div>

`;




card.querySelector(".comprar")
.onclick=()=>{


sumarClic(oferta.id);


};



carrusel.appendChild(card);



});



iniciarAutoCarrusel();



}









// ================================
// CONTADOR CLICS
// ================================


async function sumarClic(id){


await updateDoc(

doc(
db,
"ofertas",
id
),

{


clics:
increment(1)


}


);



}









// ================================
// AUTO CARRUSEL
// ================================


function iniciarAutoCarrusel(){



let posicion=0;



setInterval(()=>{



if(!carrusel)return;



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









// ================================
// CUPONES
// ================================


async function cargarCupones(){



const snapshot =

await getDocs(

collection(db,"cupones")

);




let cupones=[];



snapshot.forEach(d=>{


cupones.push({

id:d.id,

...d.data()

});


});





cupones.sort((a,b)=>{


let A=

parseInt(
(a.minimo||"0")
.replace(/\D/g,"")
);


let B=

parseInt(
(b.minimo||"0")
.replace(/\D/g,"")
);


return A-B;


});







cupones.forEach(cupon=>{



const tarjeta=

crearCupon(cupon);



if(cupon.tipo==="relampago")

relampago.appendChild(tarjeta);



else if(cupon.tipo==="bancario")

bancarios.appendChild(tarjeta);



else

exclusivos.appendChild(tarjeta);



});




}









function crearCupon(cupon){



const div=

document.createElement("div");



div.className="cuponCard";



div.innerHTML=`

<h3>

🎟️ CUPÓN

</h3>


<strong>

${cupon.codigo || "DISPONIBLE"}

</strong>



<p>

💰 Descuento:
$${cupon.descuento}

</p>


<p>

🛒 Mínimo:
${cupon.minimo}

</p>



<button>

📋 COPIAR CUPÓN

</button>


`;





div.querySelector("button")
.onclick=()=>{


copiarCupon(cupon.codigo);


};




return div;



}







async function copiarCupon(codigo){



await navigator.clipboard.writeText(codigo);



mostrarToast(

"✅ CUPÓN COPIADO"

);





setTimeout(()=>{


window.location.href=

"https://meli.la/1mj3itE";


},800);



}









// ================================
// BOTÓN ARRIBA
// ================================


const btnArriba=

document.getElementById("btnArriba");




window.addEventListener(

"scroll",

()=>{


if(window.scrollY>500){


btnArriba.style.display="block";


}else{


btnArriba.style.display="none";


}


}

);






if(btnArriba){


btnArriba.onclick=()=>{


window.scrollTo({

top:0,

behavior:"smooth"

});


};


}









// ================================
// INICIO
// ================================


cargarOfertas();


cargarCupones();