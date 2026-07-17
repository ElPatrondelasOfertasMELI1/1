// =====================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS PRO
// =====================================


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





const LINK_MELI=
"https://meli.la/1mj3itE";








// ===============================
// TOAST
// ===============================


function mostrarToast(texto){


const t=
document.getElementById("toast");


t.innerHTML=texto;


t.classList.add("show");



setTimeout(()=>{


t.classList.remove("show");


},1500);



}









// ===============================
// OFERTAS
// ===============================


const carrusel=
document.getElementById("carrusel");



onSnapshot(

collection(db,"ofertas"),

(snapshot)=>{


let ofertas=[];



snapshot.forEach(d=>{


ofertas.push({

id:d.id,

...d.data()

});


});




ofertas.sort((a,b)=>{


return (b.destacada===true)-(a.destacada===true);


});





carrusel.innerHTML="";



ofertas.forEach(o=>{


carrusel.innerHTML+=`



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

onclick="clicOferta('${o.id}')">


🛒 COMPRAR


</a>



</div>


`;



});



}



);









// ===============================
// CLIC OFERTA
// ===============================


window.clicOferta=async(id)=>{


updateDoc(

doc(db,"ofertas",id),

{

clics:increment(1)

}

).catch(()=>{});



};









// ===============================
// CUPONES
// ===============================


function ordenarCupones(lista){


return lista.sort((a,b)=>{


let A=parseInt(
(a.minimo||"0")
.replace(/\D/g,"")
);


let B=parseInt(
(b.minimo||"0")
.replace(/\D/g,"")
);


return A-B;


});


}








function pintarCupones(id,tipoClase){



const zona=
document.getElementById(id);



onSnapshot(

collection(db,"cupones"),

(snapshot)=>{


let datos=[];



snapshot.forEach(d=>{


let c=d.data();



if(c.tipo===tipoClase){

datos.push({

id:d.id,

...c

});


}


});





datos=ordenarCupones(datos);



zona.innerHTML="";



datos.forEach(c=>{


zona.innerHTML+=`


<div class="cupon ${tipoClase}">


<h3>

${c.descuento}

</h3>



<p>

Compra mínima

<br>

<b>

${c.minimo}

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







pintarCupones(
"cupones",
"relampago"
);


pintarCupones(
"bancarios",
"bancario"
);


pintarCupones(
"meliPlus",
"meli"
);









// ===============================
// COPIAR CUPON
// ===============================


window.copiarCupon=async(codigo)=>{


try{


await navigator.clipboard.writeText(codigo);



}catch(e){



const input=document.createElement("textarea");


input.value=codigo;


document.body.appendChild(input);


input.select();


document.execCommand("copy");


input.remove();


}



mostrarToast(
"✅ CUPÓN COPIADO"
);



registrarCopia(codigo);



setTimeout(()=>{


window.location.href=LINK_MELI;


},700);



};









// ===============================
// ESTADISTICAS
// ===============================


async function registrarCopia(codigo){



const contador=

doc(db,"contadores","global");



updateDoc(contador,{

total:increment(1)

}).catch(()=>{});





const usuario=

localStorage.getItem("usuario")

||

crypto.randomUUID();




localStorage.setItem(
"usuario",
usuario
);





const fecha=

new Date()
.toISOString()
.slice(0,10);





const copia=

doc(

db,

"copias_diarias",

usuario+"_"+fecha

);





const existe=

await getDoc(copia);





if(!existe.exists()){


await setDoc(copia,{

usuario,

fecha,

codigo

});



const ahorro=

doc(

db,

"estadisticas",

"ahorro"

);



updateDoc(ahorro,{

total:increment(100)

}).catch(()=>{});



}



}









// ===============================
// MOSTRAR ESTADISTICAS
// ===============================


onSnapshot(

doc(db,"contadores","global"),

(s)=>{


document.getElementById("copias").innerHTML=

s.data()?.total || 0;


}

);





onSnapshot(

doc(db,"estadisticas","ahorro"),

(s)=>{


document.getElementById("ahorro").innerHTML=

"$"+

(s.data()?.total || 0);


}

);