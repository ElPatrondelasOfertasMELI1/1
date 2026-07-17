// =======================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS PRO
// FIRESTORE + IMAGENES BASE64
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




// FIREBASE

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






const carrusel=
document.getElementById("carrusel");


const cupones=
document.getElementById("cupones");







// =======================================
// CARGAR OFERTAS
// =======================================


onSnapshot(

collection(db,"ofertas"),

async(snapshot)=>{


carrusel.innerHTML="";



for(const item of snapshot.docs){



const o=item.data();


let imagen="";



if(o.imagenID){


const img=

await getDoc(

doc(
db,
"imagenes",
o.imagenID

)

);



if(img.exists()){

imagen=img.data().imagen;

}


}




carrusel.innerHTML+=`


<div class="oferta">


<img src="${imagen}">



<h3>

${o.titulo}

</h3>



<p class="precioAntes">

$${o.precioAntes || ""}

</p>



<div class="precioFinal">

$${o.precioFinal}

</div>




<a

class="btnComprar"

href="${o.link}"

target="_blank"

onclick="sumarClic('${item.id}')"

>

🛒 COMPRAR

</a>


</div>



`;



}



});









// =======================================
// CLICS DE OFERTAS
// =======================================


window.sumarClic=async(id)=>{


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

);



};










// =======================================
// CUPONES
// =======================================


onSnapshot(

collection(db,"cupones"),

(snapshot)=>{


cupones.innerHTML="";



snapshot.forEach((item)=>{


const c=item.data();



let estado="🟢 ACTIVO";



if(c.estado==="agotando")

estado="🟠 POR AGOTARSE";



if(c.estado==="agotado")

estado="🔴 AGOTADO";





cupones.innerHTML+=`


<div class="cupon">


<h3>

${c.descuento || ""} OFF

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

📋 COPIAR

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



contadorCupon(codigo);



alert(
"✅ Cupón copiado"
);



setTimeout(()=>{


window.location.href=

"https://meli.la/1mj3itE";


},500);



};









// =======================================
// CONTADORES
// =======================================


async function contadorCupon(codigo){



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







const dia=

new Date()

.toISOString()

.split("T")[0];




const usuario=

localStorage.getItem("usuario")

|| crypto.randomUUID();




localStorage.setItem(

"usuario",

usuario

);





const diario=

doc(

db,

"copias_diarias",

usuario+"_"+dia

);




const existe=

await getDoc(diario);



if(!existe.exists()){


await setDoc(

diario,

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

total:increment(
parseInt(100)
)

}

).catch(()=>{});


}



}