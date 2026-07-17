// =======================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS PRO
// =======================================


import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
addDoc,
setDoc,
doc,
deleteDoc,
onSnapshot,
serverTimestamp

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// FIREBASE


const firebaseConfig = {


apiKey:"AIzaSyBo_wk-k8TrcSl0CMQz0hoUCvAKre94hW0",

authDomain:"patronofertasweb.firebaseapp.com",

projectId:"patronofertasweb",

storageBucket:"patronofertasweb.firebasestorage.app",

messagingSenderId:"292338334268",

appId:"1:292338334268:web:9dbbafe00dd23ebb72e139"


};



const app = initializeApp(firebaseConfig);


const db = getFirestore(app);








// ===============================
// ELEMENTOS
// ===============================


const imagenInput =
document.getElementById("imagen");


const preview =
document.getElementById("preview");



let imagenBase64="";









// ===============================
// PREVIEW IMAGEN
// ===============================


imagenInput.addEventListener(

"change",

()=>{


const archivo =
imagenInput.files[0];



if(!archivo) return;



const lector =
new FileReader();



lector.onload = e=>{


imagenBase64 =
e.target.result;


preview.src =
imagenBase64;


preview.style.display="block";


};



lector.readAsDataURL(archivo);



}

);









// ===============================
// PUBLICAR OFERTA
// ===============================


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





if(!titulo){

alert("Agrega nombre del producto");

return;

}




await addDoc(

collection(db,"ofertas"),

{


titulo,

precioAntes,

precioFinal,

link,

imagen:imagenBase64,


clics:0,


creado:

serverTimestamp()


}



);





document.getElementById("mensaje").innerHTML=

"✅ Oferta publicada";




limpiarOferta();



};









function limpiarOferta(){


document.getElementById("titulo").value="";

document.getElementById("precioAntes").value="";

document.getElementById("precioFinal").value="";

document.getElementById("link").value="";


imagenInput.value="";


preview.style.display="none";


imagenBase64="";


}









// ===============================
// LISTA OFERTAS
// ===============================


const listaOfertas =

document.getElementById("listaOfertas");





onSnapshot(

collection(db,"ofertas"),

(snapshot)=>{


listaOfertas.innerHTML="";



snapshot.forEach(item=>{


const o=item.data();



listaOfertas.innerHTML += `


<div class="item">


<h3>

${o.titulo}

</h3>


<p>

$${o.precioFinal}

</p>



<button

onclick="borrarOferta('${item.id}')">

🗑️ Borrar

</button>



</div>


`;



});



}


);









window.borrarOferta = async(id)=>{


if(confirm("¿Eliminar oferta?")){


await deleteDoc(

doc(db,"ofertas",id)

);


}



};









// ===============================
// CREAR CUPON
// ===============================


document
.getElementById("guardarCupon")
.onclick = async()=>{



const codigo =

document.getElementById("codigoCupon").value
.trim()
.toUpperCase();




const descuento =

document.getElementById("descuento").value;



const minimo =

document.getElementById("minimo").value;



const estado =

document.getElementById("estado").value;





if(!codigo){

alert("Escribe código");

return;

}




await setDoc(

doc(db,"cupones",codigo),

{


descuento,

minimo,

estado,


tipo:"relampago",


copias:0


}



);




alert("✅ Cupón guardado");



limpiarCupon();



};









function limpiarCupon(){


document.getElementById("codigoCupon").value="";

document.getElementById("descuento").value="";

document.getElementById("minimo").value="";


}









// ===============================
// LISTA CUPONES
// ===============================


const listaCupones =

document.getElementById("listaCupones");





onSnapshot(

collection(db,"cupones"),

(snapshot)=>{


listaCupones.innerHTML="";



snapshot.forEach(item=>{


const c=item.data();



listaCupones.innerHTML += `


<div class="item">


<h3>

${item.id}

</h3>



<p>

${c.descuento}

</p>



<p>

${c.minimo}

</p>



<button

onclick="borrarCupon('${item.id}')">

🗑️ Borrar

</button>



</div>



`;



});



}



);









window.borrarCupon = async(id)=>{


if(confirm("¿Eliminar cupón?")){


await deleteDoc(

doc(db,"cupones",id)

);


}


};