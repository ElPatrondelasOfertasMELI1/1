// ======================================
// EL PATRÓN DE LAS OFERTAS
// APP JS PRO
// FIREBASE PUBLICO
// ======================================


import {initializeApp}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
onSnapshot,
doc,
updateDoc,
increment,
setDoc

}

from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





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






// ===============================
// OFERTAS
// ===============================


const carrusel=
document.getElementById("ofertasPublicas");



let ofertas=[];

let posicion=0;

let timer;






onSnapshot(

collection(db,"ofertas"),

(snapshot)=>{


ofertas=[];


snapshot.forEach(doc=>{


ofertas.push({

id:doc.id,

...doc.data()

});


});



mostrarOfertas();


}

);








function mostrarOfertas(){


if(!carrusel)return;



carrusel.innerHTML="";



ofertas.forEach((o,i)=>{


carrusel.innerHTML+=`


<div class="flash-slide"

onclick="abrirOferta('${o.id}','${o.link}')">


<img src="${o.imagen || 'logo.png'}">


<h3>

${o.titulo}

</h3>



<div>

Antes:

<s>
$${o.precioAntes || ""}
</s>

</div>



<div class="flash-price">

$${o.precioFinal}

</div>



<div class="flash-btn">

🛒 COMPRAR

</div>


</div>



`;



});


iniciarCarrusel();


}








window.abrirOferta=async(id,link)=>{


try{


await updateDoc(

doc(db,"ofertas",id),

{

clics:increment(1)

}

);


}

catch(e){



console.log(e);



}



window.open(link,"_blank");


};









// ===============================
// CARRUSEL
// ===============================


function iniciarCarrusel(){


clearInterval(timer);


timer=setInterval(()=>{


mover(1);


},3500);


}



function mover(valor){


const total=ofertas.length;


if(!total)return;


posicion+=valor;


if(posicion>=total)
posicion=0;


if(posicion<0)
posicion=total-1;



carrusel.style.transform=

`translateX(-${posicion*100}%)`;



}







let inicio=0;



carrusel.addEventListener(
"touchstart",
e=>{


inicio=e.touches[0].clientX;


clearInterval(timer);


}

);




carrusel.addEventListener(
"touchend",
e=>{


let final=e.changedTouches[0].clientX;


if(inicio-final>50)
mover(1);


if(final-inicio>50)
mover(-1);



iniciarCarrusel();


}

);









// ===============================
// CUPONES
// ===============================


const zonaCupones=
document.getElementById("cuponesFirebase");




if(zonaCupones){


onSnapshot(

collection(db,"cupones"),

(snapshot)=>{


zonaCupones.innerHTML="";



snapshot.forEach(docu=>{


let c=docu.data();



zonaCupones.innerHTML+=`


<div class="cupon-card">


<div class="badge ${c.estado}">

${c.estado}

</div>



<h3>

${c.tipo==="bancario"
?"🏦 Bancario"
:c.tipo==="exclusivo"
?"💎 Meli+"
:"⚡ Relámpago"}

</h3>



<h2>

$${c.descuento} OFF

</h2>



<p>

Compra mínima:

<b>
${c.minimo}
</b>

</p>




<button class="bank-btn"

onclick="copiarCupon('${docu.id}','${c.tipo}')">


📋 COPIAR CUPÓN


</button>



</div>


`;



});



}

);


}










// ===============================
// COPIAR CUPON
// ===============================


window.copiarCupon=async(codigo,tipo)=>{


await navigator.clipboard.writeText(codigo);



let ref=doc(
db,
"cupones",
codigo
);



await updateDoc(ref,{

copias:increment(1)

}).catch(()=>{});





// contador general


await setDoc(

doc(db,"contadores","global"),

{

total:increment(1),

[tipo]:increment(1)

},

{

merge:true

}

);






// ahorro solo 1 vez por dia


let dia=
new Date()
.toISOString()
.split("T")[0];



let llave=

"ahorro_"+codigo+"_"+dia;



if(!localStorage.getItem(llave)){



await setDoc(

doc(db,"estadisticas","ahorro"),

{

total:increment(

Number(codigo.includes("10")?100:0)

)

},

{

merge:true

}

);



localStorage.setItem(llave,"ok");


}




// redireccion mercado libre


setTimeout(()=>{


window.location.href=

"https://meli.la/1mj3itE";


},300);




};