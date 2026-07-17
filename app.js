// =======================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS PRO
// FIREBASE PUBLIC
// =======================================


import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
doc,
getDoc,
onSnapshot,
updateDoc,
setDoc,
increment

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const firebaseConfig={


apiKey:"AIzaSyBo_wk-k8TrcSl0CMQz0hoUCvAKre94hW0",

authDomain:"patronofertasweb.firebaseapp.com",

projectId:"patronofertasweb",

storageBucket:"patronofertasweb.firebasestorage.app",

messagingSenderId:"292338334268",

appId:"1:292338334268:web:9dbbafe00dd23ebb72e139"

};


const app=initializeApp(firebaseConfig);

const db=getFirestore(app);






const carrusel =
document.getElementById("carrusel");


const cupones =
document.getElementById("cupones");







// =======================================
// OFERTAS
// =======================================


onSnapshot(

collection(db,"ofertas"),

async(snapshot)=>{


carrusel.innerHTML="";



for(const item of snapshot.docs){


const oferta=item.data();


let imagen="";



if(oferta.imagenID){


const img=

await getDoc(

doc(
db,
"imagenes",
oferta.imagenID

)

);



if(img.exists()){

imagen=img.data().imagen;

}


}



carrusel.innerHTML += `


<div class="oferta">


<img src="${imagen}">



<h3>

${oferta.titulo}

</h3>



<p class="precioAntes">

$${oferta.precioAntes || ""}

</p>



<div class="precioFinal">

$${oferta.precioFinal}

</div>



<a

class="btnComprar"

href="${oferta.link}"

target="_blank"

onclick="clicOferta('${item.id}')"

>

🛒 COMPRAR

</a>



</div>


`;



}


});








// =======================================
// CLICS OFERTAS
// =======================================


window.clicOferta=async(id)=>{


const ref=

doc(

db,

"ofertas",

id

);



await updateDoc(

ref,

{

clics:increment(1)

}

).catch(()=>{});


};








// =======================================
// CUPONES
// =======================================


onSnapshot(

collection(db,"cupones"),

(snapshot)=>{


cupones.innerHTML="";



snapshot.forEach(item=>{


const c=item.data();



let estado="🟢 ACTIVO";



if(c.estado==="agotando")

estado="🟠 POR AGOTARSE";



if(c.estado==="agotado")

estado="🔴 AGOTADO";






cupones.innerHTML += `



<div class="cupon">


<h3>

$${c.descuento || ""} OFF

</h3>


<p>

${c.minimo || ""}

</p>


<p>

${estado}

</p>



<button

onclick="copiarCupon('${item.id}')"

>

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


window.copiarCupon=async(codigo)=>{


await navigator.clipboard.writeText(codigo);



await contarCupon(codigo);



alert("✅ CUPÓN COPIADO");



setTimeout(()=>{


window.location.href=

"https://meli.la/1mj3itE";


},600);



};









// =======================================
// CONTADORES
// =======================================


async function contarCupon(codigo){



const global=

doc(

db,

"contadores",

"global"

);



await updateDoc(

global,

{

total:increment(1)

}

).catch(async()=>{


await setDoc(

global,

{

total:1

}

);


});







let usuario=

localStorage.getItem("usuario");



if(!usuario){


usuario=crypto.randomUUID();


localStorage.setItem(

"usuario",

usuario

);


}





const dia=

new Date()

.toISOString()

.substring(0,10);






const copia=

doc(

db,

"copias_diarias",

usuario+"_"+dia

);





const existe=

await getDoc(copia);



if(!existe.exists()){


await setDoc(

copia,

{

usuario,

dia,

codigo

}

);




const ahorro=

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