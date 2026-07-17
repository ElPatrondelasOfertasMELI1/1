// =====================================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS
// FIREBASE ADMIN PRO
// =====================================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,

collection,

addDoc,

getDocs,

doc,

deleteDoc,

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




// ================================
// FIREBASE
// ================================


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


const auth =
getAuth(app);





// ================================
// ELEMENTOS
// ================================


const archivo =
document.getElementById("imagenArchivo");


const preview =
document.getElementById("previewImagen");


let imagenBase64 = "";





// ================================
// CONVERTIR IMAGEN A BASE64
// ================================


archivo.addEventListener(
"change",
()=>{


const file =
archivo.files[0];


if(!file)return;



const lector =
new FileReader();



lector.onload =
(e)=>{


imagenBase64 =
e.target.result;


preview.src =
imagenBase64;


preview.style.display =
"block";


};



lector.readAsDataURL(file);



});






// ================================
// PUBLICAR OFERTA
// ================================


document
.getElementById("publicar")
.onclick = async()=>{



const titulo =
document.getElementById("titulo").value;



const precioAntes =
document.getElementById("precioAntes").value;



const precioFinal =
document.getElementById("precioFinal").value;



const link =
document.getElementById("link").value;



const destacada =
document.getElementById("destacada").checked;





if(!titulo || !precioFinal || !link || !imagenBase64){


alert(
"Completa los datos"
);


return;


}





await addDoc(

collection(db,"ofertas"),

{


titulo,

imagen:imagenBase64,

precioAntes,

precioFinal,

link,


clics:0,


destacada,


creado:
serverTimestamp()


}


);





alert(
"🔥 Oferta publicada"
);



limpiarOferta();


cargarOfertasAdmin();


};







function limpiarOferta(){


document
.querySelectorAll(
".panel input"
)
.forEach(
(i)=>{


if(i.type!=="checkbox")
i.value="";


}
);



imagenBase64="";


preview.style.display="none";


}







// ================================
// CREAR CUPÓN
// ================================


document
.getElementById("crearCupon")
.onclick = async()=>{



const codigo =
document.getElementById("codigoCupon").value.trim();



const descuento =
document.getElementById("descuentoCupon").value;



const minimo =
document.getElementById("minimoCupon").value;



const tipo =
document.getElementById("tipoCupon").value;



const estado =
document.getElementById("estadoCupon").value;





if(!codigo){


alert(
"Falta código"
);


return;


}





await addDoc(

collection(db,"cupones"),

{


descuento,

minimo,

tipo,

estado,

copias:0

}


);





alert(
"🎟️ Cupón creado"
);



cargarCuponesAdmin();


};