// =====================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS FINAL
// FIREBASE + OFERTAS + CUPONES
// =====================================


import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
onSnapshot,
doc,
updateDoc,
increment

}

from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const firebaseConfig = {

apiKey:"TU_API_KEY",

authDomain:"TU_PROYECTO.firebaseapp.com",

projectId:"TU_PROJECT_ID",

storageBucket:"TU_STORAGE_BUCKET",

messagingSenderId:"TU_SENDER_ID",

appId:"TU_APP_ID"

};





const app = initializeApp(firebaseConfig);


const db = getFirestore(app);





// LINK PRINCIPAL MERCADO LIBRE

const LINK_MELI = "https://meli.la/1mj3itE";






// =============================
// OFERTAS
// =============================


const carrusel =
document.getElementById("carrusel");



onSnapshot(

collection(db,"ofertas"),

(snapshot)=>{


let ofertas=[];



snapshot.forEach((doc)=>{


ofertas.push({

id:doc.id,

...doc.data()

});


});





// DESTACADAS PRIMERO

ofertas.sort((a,b)=>{


return (

(b.destacada === true)

-

(a.destacada === true)

);


});





carrusel.innerHTML="";



if(ofertas.length===0){


carrusel.innerHTML=

`
<div class="loader">
No hay ofertas disponibles
</div>
`;

return;

}






ofertas.forEach(o=>{



const card=document.createElement("div");


card.className="oferta";



card.innerHTML=`

${o.destacada ? 
'<span class="badge">⭐ DESTACADA</span>' 
: ''}


<img src="${o.imagen || 'logo.png'}">



<div class="info">



<span class="descuento">

${o.descuento || "OFERTA"}

</span>




<h3>

${o.titulo || ""}

</h3>



<p class="precioAntes">

$${o.precioAntes || ""}

</p>



<div class="precioFinal">

$${o.precioFinal || ""}

</div>




<a class="btnComprar"

href="${o.link}"

target="_blank"

onclick="registrarClick('${o.id}')">


🛒 COMPRAR


</a>



</div>

`;



carrusel.appendChild(card);



});



}

);









// =============================
// CLIC OFERTAS
// =============================


window.registrarClick = async(id)=>{


try{


await updateDoc(

doc(db,"ofertas",id),

{

clics:increment(1)

}

);


}catch(e){}



};









// =============================
// CUPONES
// =============================



function cargarCupones(tipo,contenedor){



const box=
document.getElementById(contenedor);



if(!box)return;




onSnapshot(

collection(db,"cupones"),

(snapshot)=>{


let cupones=[];




snapshot.forEach((d)=>{


const c=d.data();



if(c.tipo===tipo){


cupones.push({

id:d.id,

...c

});


}



});






// ORDEN MENOR A MAYOR

cupones.sort((a,b)=>{


const A=parseInt(
String(a.minimo)
.replace(/\D/g,"")
)||0;


const B=parseInt(
String(b.minimo)
.replace(/\D/g,"")
)||0;



return A-B;


});





box.innerHTML="";






cupones.forEach(c=>{



box.innerHTML += `


<div class="cupon ${tipo}">


<h3>

${c.descuento || ""}

</h3>



<p>

Compra mínima

<br>

<b>

${c.minimo || ""}

</b>

</p>



<button onclick="copiarCupon('${c.id}')">

📋 COPIAR CUPÓN

</button>



</div>


`;



});




}


);



}







cargarCupones(
"relampago",
"cupones"
);


cargarCupones(
"bancario",
"bancarios"
);



cargarCupones(
"meli",
"meliPlus"
);









// =============================
// COPIAR CUPÓN
// =============================


window.copiarCupon = async(codigo)=>{


try{


await navigator.clipboard.writeText(codigo);



}catch(e){


}



const toast=
document.getElementById("toast");


if(toast){


toast.classList.add("show");



setTimeout(()=>{


toast.classList.remove("show");


},1200);



}





setTimeout(()=>{


window.location.href=LINK_MELI;



},1200);



};







// =============================
// ESTADISTICAS LOCALES
// =============================


let visitas =

localStorage.getItem("visitas") || 0;



visitas++;



localStorage.setItem(

"visitas",

visitas

);



const usuarios=
document.getElementById("usuarios");


if(usuarios){

usuarios.innerHTML=visitas;

}