// =================================
// LOGIN ADMIN PRO
// EL PATRÓN DE LAS OFERTAS
// =================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getAuth,

signInWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";





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



const auth =
getAuth(app);







document
.getElementById("entrar")
.onclick = async()=>{


const email =
document.getElementById("email").value;


const password =
document.getElementById("password").value;



const mensaje =
document.getElementById("mensaje");




try{


await signInWithEmailAndPassword(

auth,

email,

password

);



mensaje.innerHTML =
"✅ Acceso correcto";



setTimeout(()=>{


window.location.href="admin.html";


},1000);



}


catch(error){

console.error(error);

mensaje.innerHTML = error.code;

}



};