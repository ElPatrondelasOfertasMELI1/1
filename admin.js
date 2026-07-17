// =======================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS PRO
// FIRESTORE + IMAGENES BASE64
// =======================================


import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
addDoc,
setDoc,
doc,
getDoc,
onSnapshot,
deleteDoc,
updateDoc,
increment

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// CONFIG FIREBASE

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




// REFERENCIAS

const titulo=
document.getElementById("titulo");

const categoria=
document.getElementById("categoria");

const precioAntes=
document.getElementById("precioAntes");

const precioFinal=
document.getElementById("precioFinal");

const descuento=
document.getElementById("descuento");

const link=
document.getElementById("link");

const archivo=
document.getElementById("imagenArchivo");

const preview=
document.getElementById("vistaImagen");

const publicar=
document.getElementById("publicarOferta");

const mensaje=
document.getElementById("mensajeOferta");

const lista=
document.getElementById("listaOfertas");






let imagenBase64="";






// =======================================
// PREVIEW + COMPRESION IMAGEN
// =======================================


archivo.addEventListener("change",()=>{


const imagen=archivo.files[0];


if(!imagen)return;



const lector=new FileReader();



lector.onload=(e)=>{


const img=new Image();


img.onload=()=>{


const canvas=document.createElement("canvas");


let max=800;


let escala=max/img.width;



if(img.width<=max){

escala=1;

}



canvas.width=img.width*escala;

canvas.height=img.height*escala;



const ctx=canvas.getContext("2d");


ctx.drawImage(

img,

0,

0,

canvas.width,

canvas.height

);



imagenBase64=
canvas.toDataURL(
"image/jpeg",
0.75
);



preview.src=imagenBase64;



};



img.src=e.target.result;


};



lector.readAsDataURL(imagen);


});







// =======================================
// PUBLICAR OFERTA
// =======================================


publicar.onclick=async()=>{


try{


if(!titulo.value ||
!precioFinal.value ||
!link.value){

alert("Completa título, precio y link");

return;

}



publicar.disabled=true;

publicar.innerHTML="⏳ Publicando...";





let imagenID="";



// guardar imagen

if(imagenBase64){


const imagenDoc=
doc(collection(db,"imagenes"));



imagenID=
imagenDoc.id;



await setDoc(

imagenDoc,

{

imagen:imagenBase64

}

);


}





// crear oferta


await addDoc(

collection(db,"ofertas"),

{


titulo:titulo.value,

categoria:categoria.value,

precioAntes:precioAntes.value,

precioFinal:precioFinal.value,

descuento:descuento.value,

link:link.value,


imagenID,


activo:true,


destacada:false,


clics:0


}


);





mensaje.innerHTML=
"✅ Oferta publicada";



limpiar();



}

catch(error){

console.error(error);

mensaje.innerHTML=
"❌ Error publicando";

}



finally{


publicar.disabled=false;

publicar.innerHTML=
"🚀 PUBLICAR OFERTA";


}



};









function limpiar(){


document.querySelectorAll("input")
.forEach(i=>{

i.value="";

});


preview.src="";

imagenBase64="";


}







// =======================================
// MOSTRAR OFERTAS ADMIN
// =======================================


onSnapshot(

collection(db,"ofertas"),

async(snapshot)=>{


lista.innerHTML="";



for(const item of snapshot.docs){



const o=item.data();



let imagen="logo.png";



if(o.imagenID){


const imgSnap=
await getDoc(

doc(
db,
"imagenes",
o.imagenID

)

);



if(imgSnap.exists()){

imagen=
imgSnap.data().imagen;

}

}





lista.innerHTML+=`


<div class="itemAdmin">


<img src="${imagen}">


<h3>
${o.titulo}
</h3>


<p>
💰 $${o.precioFinal}
</p>


<p>
👆 ${o.clics||0} clics
</p>



<button onclick="borrarOferta('${item.id}')">

🗑️ Eliminar

</button>


</div>


`;



}


}


);








// =======================================
// ELIMINAR OFERTA
// =======================================


window.borrarOferta=async(id)=>{


if(confirm("¿Eliminar oferta?")){


await deleteDoc(

doc(
db,
"ofertas",
id

)

);


}



};