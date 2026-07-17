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
getDoc,
updateDoc,
increment

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {

getAuth,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";





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







// ============================
// LOGIN
// ============================


const loginBox=
document.getElementById("loginBox");


const panel=
document.getElementById("panelAdmin");



document.getElementById("login").onclick=async()=>{


const email=
document.getElementById("email").value;


const pass=
document.getElementById("password").value;



try{


await signInWithEmailAndPassword(

auth,
email,
pass

);


}catch(e){

alert("Datos incorrectos");

}



};



onAuthStateChanged(auth,(user)=>{


if(user){


loginBox.style.display="none";

panel.style.display="block";


}else{


loginBox.style.display="block";

panel.style.display="none";


}


});




document.getElementById("logout").onclick=()=>{

signOut(auth);

};









// ============================
// IMAGEN
// ============================


let imagenBase64="";


const imagen=
document.getElementById("imagen");


const preview=
document.getElementById("preview");




imagen.onchange=()=>{


const file=imagen.files[0];


if(!file)return;


const reader=new FileReader();



reader.onload=e=>{


imagenBase64=e.target.result;


preview.src=imagenBase64;


};


reader.readAsDataURL(file);



};









// ============================
// GUARDAR OFERTA
// ============================


document.getElementById("guardarOferta").onclick=async()=>{


const id=
document.getElementById("ofertaId").value;


const datos={


titulo:
titulo.value,


precioAntes:
precioAntes.value,


precioFinal:
precioFinal.value,


link:
link.value,


imagen:
imagenBase64,


destacada:
document.getElementById("destacada").checked,


clics:0


};



if(id){


await updateDoc(

doc(db,"ofertas",id),

datos

);


}else{


await addDoc(

collection(db,"ofertas"),

datos

);


}



alert("Oferta guardada");


limpiarOferta();


};







function limpiarOferta(){


document.getElementById("ofertaId").value="";


titulo.value="";


precioAntes.value="";


precioFinal.value="";


link.value="";


imagen.value="";


preview.src="";


imagenBase64="";


document.getElementById("destacada").checked=false;


}









// ============================
// LISTA OFERTAS
// ============================


onSnapshot(

collection(db,"ofertas"),

snap=>{


const box=
document.getElementById("listaOfertas");


box.innerHTML="";



snap.forEach(d=>{


const o=d.data();



box.innerHTML+=`


<div class="item">


<img src="${o.imagen}">


<h3>${o.titulo}</h3>


<p>$${o.precioFinal}</p>


<p>

${o.destacada?"⭐ DESTACADA":""}

</p>


<button onclick="editarOferta('${d.id}')">

✏️ Editar

</button>


<button class="delete"

onclick="borrarOferta('${d.id}')">

🗑️ Borrar

</button>


</div>


`;



});


}



);









window.editarOferta=async(id)=>{


const snap=
await getDoc(doc(db,"ofertas",id));


const o=snap.data();


document.getElementById("ofertaId").value=id;


titulo.value=o.titulo;


precioAntes.value=o.precioAntes;


precioFinal.value=o.precioFinal;


link.value=o.link;


imagenBase64=o.imagen;


preview.src=o.imagen;


document.getElementById("destacada").checked=o.destacada||false;



};



window.borrarOferta=async(id)=>{


if(confirm("¿Borrar oferta?")){


deleteDoc(doc(db,"ofertas",id));


}


};









// ============================
// CUPONES
// ============================


document.getElementById("guardarCupon").onclick=async()=>{


const codigo=
document.getElementById("cuponId").value
.trim()
.toUpperCase();



await setDoc(

doc(db,"cupones",codigo),

{


descuento:
document.getElementById("cuponDescuento").value,


minimo:
document.getElementById("cuponMinimo").value,


tipo:
document.getElementById("cuponTipo").value,


estado:
document.getElementById("cuponEstado").value,


copias:0


}

);



alert("Cupón guardado");


};









// ============================
// MOSTRAR CUPONES
// ============================


function cargarCupones(tipo,elemento){



onSnapshot(

collection(db,"cupones"),

snap=>{


const box=document.getElementById(elemento);


box.innerHTML="";



snap.forEach(d=>{


const c=d.data();



if(c.tipo!==tipo)return;



box.innerHTML+=`


<div class="item">


<h3>${d.id}</h3>


<p>${c.descuento}</p>


<p>${c.minimo}</p>


<button onclick="editarCupon('${d.id}')">

✏️ Editar

</button>


<button class="delete"

onclick="borrarCupon('${d.id}')">

🗑️ Borrar

</button>


</div>


`;



});


}


);


}



cargarCupones("relampago","listaRelampago");

cargarCupones("bancario","listaBancarios");

cargarCupones("meli","listaMeli");







window.borrarCupon=async(id)=>{


if(confirm("¿Eliminar cupón?")){


deleteDoc(doc(db,"cupones",id));


}


};



window.editarCupon=async(id)=>{


const s=
await getDoc(doc(db,"cupones",id));


const c=s.data();


document.getElementById("cuponId").value=id;


document.getElementById("cuponDescuento").value=c.descuento;


document.getElementById("cuponMinimo").value=c.minimo;


document.getElementById("cuponTipo").value=c.tipo;


document.getElementById("cuponEstado").value=c.estado;



};

