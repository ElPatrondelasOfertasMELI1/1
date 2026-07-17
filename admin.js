// =====================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN JS PRO
// FIREBASE FIRESTORE
// =====================================


import {initializeApp}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
addDoc,
onSnapshot,
deleteDoc,
doc,
setDoc,
updateDoc,
increment

}

from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



import {

getAuth,
onAuthStateChanged,
signOut

}

from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";





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

const auth=getAuth(app);





// SEGURIDAD LOGIN


onAuthStateChanged(auth,(user)=>{


if(!user){

window.location.href="login.html";

}


});








// REFERENCIAS


const ofertasRef =
collection(db,"ofertas");


const cuponesRef =
collection(db,"cupones");






const $=id=>document.getElementById(id);






// ==============================
// PUBLICAR OFERTA
// ==============================


$("publicar").onclick=async()=>{


let datos={


titulo:$("titulo").value,

categoria:$("categoria").value,

precioAntes:$("precioAntes").value,

precioFinal:$("precioFinal").value,

descuento:$("descuento").value,

imagen:$("imagen").value,

link:$("link").value,

activo:$("estado").value==="true",

destacada:$("destacada").value==="true",

clics:0


};



if(!datos.titulo || !datos.precioFinal || !datos.link){


$("mensaje").innerHTML=
"❌ Completa título, precio y link";


return;


}



try{


await addDoc(

ofertasRef,

datos

);



$("mensaje").innerHTML=
"✅ Oferta publicada";


limpiarOferta();



}

catch(e){


console.error(e);

$("mensaje").innerHTML=
"❌ Error publicando";


}


};








function limpiarOferta(){


[
"titulo",
"precioAntes",
"precioFinal",
"descuento",
"imagen",
"link"

].forEach(x=>{

$(x).value="";

});


}









// ==============================
// MOSTRAR OFERTAS
// ==============================


onSnapshot(

ofertasRef,

(snapshot)=>{


$("listaOfertas").innerHTML="";


let total=0;

let clicks=0;


snapshot.forEach(item=>{


let o=item.data();


total++;


clicks+=o.clics||0;




$("listaOfertas").innerHTML+=`


<div class="ofertaAdmin">


<img src="${o.imagen || 'logo.png'}">


<div>


<h3>${o.titulo}</h3>


<p>
💰 $${o.precioFinal}
</p>


<p>
${o.activo?"🟢 Activa":"🔴 Agotada"}
</p>


<button onclick="borrarOferta('${item.id}')">

🗑️ Eliminar

</button>


</div>


</div>



`;



});



$("totalOfertas").innerHTML=total;

$("totalClicks").innerHTML=clicks;


}

);








window.borrarOferta=async(id)=>{


if(confirm("¿Eliminar oferta?")){


await deleteDoc(

doc(db,"ofertas",id)

);


}


};










// ==============================
// CUPONES
// ==============================


$("guardarCupon").onclick=async()=>{


let codigo=$("codigoCupon").value.trim();



if(!codigo){

alert("Escribe código");

return;

}



let datos={


descuento:$("descuentoCupon").value,

minimo:$("minimoCupon").value,

tipo:$("tipoCupon").value,

estado:$("estadoCupon").value,

copias:0


};




await setDoc(

doc(db,"cupones",codigo),

datos

);



alert("✅ Cupón guardado");



limpiarCupon();


};









function limpiarCupon(){


[

"codigoCupon",

"descuentoCupon",

"minimoCupon"


].forEach(x=>{

$(x).value="";

});


}









// MOSTRAR CUPONES


onSnapshot(

cuponesRef,

(snapshot)=>{


$("listaCupones").innerHTML="";



let copias=0;



snapshot.forEach(item=>{


let c=item.data();


copias+=c.copias||0;



$("listaCupones").innerHTML+=`


<div class="cuponAdmin">


<strong>

${item.id}

</strong>


<p>
💰 ${c.descuento} OFF
</p>


<p>
🛒 ${c.minimo}
</p>


<p>
${c.estado}
</p>


<p>
📋 Copias: ${c.copias||0}
</p>


</div>


`;



});



$("copiasTotal").innerHTML=copias;


}

);










// ==============================
// AHORRO COMUNIDAD
// ==============================


onSnapshot(

doc(db,"estadisticas","ahorro"),

(snap)=>{


let total=
snap.data()?.total || 0;


$("ahorroTotal").innerHTML=

"$"+total.toLocaleString("es-MX");


}

);









// SALIR


$("salir").onclick=()=>{


signOut(auth);


window.location.href="login.html";


};