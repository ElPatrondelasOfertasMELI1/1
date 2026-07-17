// =====================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN PRO
// FIREBASE SIN STORAGE
// IMAGENES EN FIRESTORE
// =====================================


import {initializeApp} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
addDoc,
setDoc,
doc,
onSnapshot,
deleteDoc,
serverTimestamp,
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




// CONFIG


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


onAuthStateChanged(auth,user=>{


if(!user){

location.href="login.html";

}


});








// ELEMENTOS


const imagenInput=
document.getElementById("imagen");


const preview=
document.getElementById("preview");



let imagenBase64="";








// PREVIEW IMAGEN


imagenInput.onchange=e=>{


const archivo=e.target.files[0];


if(!archivo)return;



const lector=new FileReader();



lector.onload=()=>{


imagenBase64=lector.result;


preview.src=imagenBase64;

preview.style.display="block";


};



lector.readAsDataURL(archivo);


};









// PUBLICAR OFERTA


document
.getElementById("publicar")
.onclick=async()=>{


const mensaje=
document.getElementById("mensaje");



try{


mensaje.innerHTML="⏳ Publicando...";



let imagenID="";



// GUARDAR IMAGEN


if(imagenBase64){


const img=
await addDoc(
collection(db,"imagenes"),
{


imagen:imagenBase64,


fecha:serverTimestamp()


}

);


imagenID=img.id;


}




// CREAR OFERTA


await addDoc(

collection(db,"ofertas"),

{


titulo:
titulo.value,


categoria:
categoria.value,


precioAntes:
precioAntes.value,


precioFinal:
precioFinal.value,


descuento:
descuento.value,


link:
link.value,


imagenID,


activo:
estado.value==="true",


destacada:
destacada.value==="true",


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



};









// LIMPIAR


function limpiar(){


document.querySelectorAll("input")
.forEach(i=>{


if(i.type!="file")
i.value="";


});



imagenInput.value="";


preview.style.display="none";


imagenBase64="";


}









// MOSTRAR OFERTAS


const lista=
document.getElementById("listaOfertas");



const ofertasRef=
collection(db,"ofertas");




onSnapshot(ofertasRef,async snap=>{


lista.innerHTML="";


let total=0;

let clicks=0;



for(const item of snap.docs){



const o=item.data();


total++;


clicks+=o.clics || 0;



let imagen="";



if(o.imagenID){


const imgSnap=
await import(
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
)
.then(()=>null);



}



lista.innerHTML+=`


<div class="ofertaAdmin">


<div>


<h3>
${o.titulo}
</h3>


<p>
💰 $${o.precioFinal}
</p>


<p>
${o.activo?"🟢 Activa":"🔴 Agotada"}
</p>



</div>



<button class="eliminar"
onclick="eliminarOferta('${item.id}')">

🗑️

</button>


</div>



`;



}




document.getElementById("totalOfertas")
.innerHTML=total;



document.getElementById("totalClicks")
.innerHTML=clicks;



});









// ELIMINAR


window.eliminarOferta=
async(id)=>{


if(confirm("¿Eliminar oferta?")){


await deleteDoc(
doc(db,"ofertas",id)
);


}


};









// GUARDAR CUPON


document
.getElementById("guardarCupon")
.onclick=async()=>{


await setDoc(

doc(
db,
"cupones",
codigoCupon.value
),

{


tipo:
tipoCupon.value,


descuento:
descuentoCupon.value,


minimo:
minimoCupon.value,


estado:
estadoCupon.value,


copias:0


}


);



alert("Cupón guardado");


};









// SALIR


document
.getElementById("salir")
.onclick=()=>{


signOut(auth);


location.href="login.html";


};