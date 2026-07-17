// =======================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS PRO COMPLETO
// =======================================


import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
onSnapshot,
doc,
updateDoc,
setDoc,
increment,
getDoc

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// FIREBASE


const firebaseConfig = {

apiKey:"AIzaSyBo_wk-k8TrcSl0CMQz0hoUCvAKre94hW0",

authDomain:"patronofertasweb.firebaseapp.com",

projectId:"patronofertasweb",

storageBucket:"patronofertasweb.firebasestorage.app",

messagingSenderId:"292338334268",

appId:"1:292338334268:web:9dbbafe00dd23ebb72e139"

};



const app = initializeApp(firebaseConfig);

const db = getFirestore(app);





const LINK_MELI = 
"https://meli.la/1mj3itE";







// =======================================
// CARGAR OFERTAS
// =======================================


const carrusel =
document.getElementById("carrusel");



onSnapshot(

collection(db,"ofertas"),

(snapshot)=>{


carrusel.innerHTML="";



snapshot.forEach((item)=>{


const o=item.data();



carrusel.innerHTML += `


<div class="oferta">


<img src="${o.imagen || 'logo.png'}">



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

onclick="clicOferta('${item.id}')">

🛒 COMPRAR

</a>



</div>


`;



});


}

);









// =======================================
// CLICS OFERTAS
// =======================================


window.clicOferta = async(id)=>{


const ref =
doc(db,"ofertas",id);


await updateDoc(ref,{

clics:increment(1)

}).catch(()=>{});


};









// =======================================
// CUPONES
// =======================================


const zonaCupones =
document.getElementById("cupones");




onSnapshot(

collection(db,"cupones"),

(snapshot)=>{


zonaCupones.innerHTML="";



snapshot.forEach((item)=>{


const c=item.data();



let estado="🟢 ACTIVO";


if(c.estado==="agotando")

estado="🟠 POR AGOTARSE";


if(c.estado==="agotado")

estado="🔴 AGOTADO";





zonaCupones.innerHTML += `



<div class="cupon">


<h3>

${c.descuento}

</h3>



<p>

Compra mínima:
<b>

${c.minimo}

</b>

</p>



<p>

${estado}

</p>



<button onclick="copiarCupon('${item.id}')">

📋 COPIAR CUPÓN

</button>



</div>


`;



});


}

);









// =======================================
// COPIAR CUPÓN
// =======================================


window.copiarCupon = async(codigo)=>{


try{


await navigator.clipboard.writeText(codigo);


alert(
"✅ CUPÓN COPIADO: "+codigo
);



}catch{


prompt(
"Copia tu cupón:",
codigo
);


}





guardarCopia(codigo);



setTimeout(()=>{


window.location.href=LINK_MELI;


},500);



};









// =======================================
// CONTADORES
// =======================================


async function guardarCopia(codigo){



const contador =
doc(db,"contadores","global");



await updateDoc(

contador,

{

total:increment(1)

}

).catch(async()=>{


await setDoc(

contador,

{

total:1

}

);


});





const usuario =

localStorage.getItem("usuario")

||

crypto.randomUUID();




localStorage.setItem(
"usuario",
usuario
);




const fecha =

new Date()

.toISOString()

.substring(0,10);





const copia =

doc(

db,

"copias_diarias",

usuario+"_"+fecha

);





const existe =

await getDoc(copia);



if(!existe.exists()){


await setDoc(copia,{

usuario,

fecha,

codigo

});



const ahorro =

doc(

db,

"estadisticas",

"ahorro"

);



await updateDoc(

ahorro,

{

total:increment(100)

}

).catch(()=>{});



}



}
