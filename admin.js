// =====================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS PRO - PARTE 9
// DASHBOARD + FIRESTORE
// =====================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,

collection,

addDoc,

deleteDoc,

doc,

onSnapshot,

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







// CONFIGURACIÓN FIREBASE


const firebaseConfig = {


apiKey:"TU_API_KEY",

authDomain:"TU_PROYECTO.firebaseapp.com",

projectId:"TU_PROJECT_ID",

storageBucket:"TU_STORAGE_BUCKET",

messagingSenderId:"TU_SENDER_ID",

appId:"TU_APP_ID"

};






const app =
initializeApp(firebaseConfig);



const db =
getFirestore(app);



const auth =
getAuth(app);








// REFERENCIAS


const lista =
document.getElementById("listaOfertas");


const contador =
document.getElementById("totalOfertas");








// MOSTRAR OFERTAS EN VIVO


const ofertasRef =
collection(db,"ofertas");




onSnapshot(

ofertasRef,

(snapshot)=>{


lista.innerHTML="";


contador.innerHTML =
snapshot.size;





snapshot.forEach((item)=>{



const oferta =
item.data();





lista.innerHTML +=



`

<div class="ofertaAdmin">


<h3>

${oferta.titulo}

</h3>



<p>

💰 $${oferta.precioFinal}

</p>



<p>

${oferta.descuento || ""}

</p>




<button 

onclick="eliminarOferta('${item.id}')"

>

🗑️ ELIMINAR

</button>



</div>

`;





});



}

);









// PUBLICAR OFERTA


document
.getElementById("publicar")
.onclick = async()=>{





const datos = {


titulo:
titulo.value,


imagen:
imagen.value,


precioAntes:
precioAntes.value,


precioFinal:
precioFinal.value,


descuento:
descuento.value,


link:
link.value,


fecha:
serverTimestamp(),


activo:true


};





if(
!datos.titulo ||
!datos.precioFinal ||
!datos.link
){


alert(
"Completa los datos necesarios"
);


return;


}





await addDoc(

collection(db,"ofertas"),

datos

);





alert(
"🔥 Oferta publicada"
);






document
.querySelectorAll("input")
.forEach(

i=>i.value=""

);



};









// ELIMINAR OFERTA


window.eliminarOferta =
async(id)=>{



const confirmar =
confirm(
"¿Eliminar esta oferta?"
);



if(!confirmar)
return;





await deleteDoc(

doc(
db,
"ofertas",
id
)

);




};








// CERRAR SESIÓN


const salir =
document.getElementById("salir");



if(salir){


salir.onclick =
()=>{


signOut(auth);



window.location.href=
"login.html";


};


}