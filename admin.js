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

updateDoc,

getDoc

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {

getStorage,

ref,

uploadBytes,

getDownloadURL

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


import {

getAuth,

signOut

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";







// CONFIGURACIÓN FIREBASE


const firebaseConfig = {

apiKey: "AIzaSyBo_wk-k8TrcSl0CMQz0hoUCvAKre94hW0",

authDomain: "patronofertasweb.firebaseapp.com",

projectId: "patronofertasweb",

storageBucket: "patronofertasweb.firebasestorage.app",

messagingSenderId: "292338334268",

appId: "1:292338334268:web:9dbbafe00dd23ebb72e139"

};



const app =
initializeApp(firebaseConfig);



const db =
getFirestore(app);

const storage =
getStorage(app);

async function subirImagen(){


const archivo =
document.getElementById("archivoImagen").files[0];


if(!archivo){

return "";

}



const nombre =
Date.now()+"_"+archivo.name;



const referencia =
ref(
storage,
"ofertas/"+nombre
);



await uploadBytes(
referencia,
archivo
);



const url =
await getDownloadURL(referencia);



return url;


}

const auth =
getAuth(app);

import {

onAuthStateChanged

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



onAuthStateChanged(auth,(user)=>{


if(!user){


window.location.href="login.html";


}


});


// REFERENCIAS


const lista =
document.getElementById("listaOfertas");


const contador =
document.getElementById("totalOfertas");








// MOSTRAR OFERTAS EN VIVO


const ofertasRef =
collection(db,"ofertas");

// ===============================
// DASHBOARD ESTADÍSTICAS PRO
// ===============================


const totalClicks =
document.getElementById("totalClicks");


const topOferta =
document.getElementById("topOferta");



let grafica;



onSnapshot(

ofertasRef,

(snapshot)=>{


let clicksTotales = 0;

let nombres=[];

let valores=[];


let mayor = 0;

let ganadora="-";




snapshot.forEach((item)=>{


const oferta=item.data();



const clicks =
oferta.clics || 0;



clicksTotales += clicks;



nombres.push(
oferta.titulo
);



valores.push(
clicks
);





if(clicks > mayor){


mayor = clicks;

ganadora =
oferta.titulo;


}



});





totalClicks.innerHTML =
clicksTotales;



topOferta.innerHTML =
ganadora;



crearGrafica(
nombres,
valores
);



});







function crearGrafica(
nombres,
valores
){


const ctx =
document
.getElementById(
"graficaClicks"
);



if(grafica){

grafica.destroy();

}




grafica =
new Chart(

ctx,

{


type:"bar",


data:{


labels:nombres,


datasets:[{


label:
"Clics",


data:valores


}]


},



options:{


responsive:true,


plugins:{


legend:{


display:false


}


}


}



}

);



}


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




<button onclick="editarOferta('${item.id}')">

✏️ EDITAR

</button>


<button onclick="eliminarOferta('${item.id}')">

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

const imagenSubida =
await subirImagen();

const datos = {


titulo:
titulo.value,


imagen:
imagenSubida,


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

let ofertaEditando = null;



window.editarOferta = async(id)=>{


ofertaEditando=id;


const referencia =
doc(db,"ofertas",id);



const datos =
await getDoc(referencia);



const oferta =
datos.data();




editor.style.display="block";



editTitulo.value =
oferta.titulo;


editImagen.value =
oferta.imagen;


editPrecioAntes.value =
oferta.precioAntes;


editPrecioFinal.value =
oferta.precioFinal;


editDescuento.value =
oferta.descuento;


editLink.value =
oferta.link;



window.scrollTo({

top:0,

behavior:"smooth"

});


};







guardarCambios.onclick =
async()=>{


if(!ofertaEditando)
return;




await updateDoc(

doc(
db,
"ofertas",
ofertaEditando
),

{


titulo:
editTitulo.value,


imagen:
editImagen.value,


precioAntes:
editPrecioAntes.value,


precioFinal:
editPrecioFinal.value,


descuento:
editDescuento.value,


link:
editLink.value


}


);



alert(
"✅ Oferta actualizada"
);



editor.style.display="none";

ofertaEditando=null;


};