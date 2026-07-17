// =====================================================
// EL PATRÓN DE LAS OFERTAS
// LOGIN.JS
// FIREBASE AUTH
// =====================================================



import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";



import {

getAuth,

signInWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";





// ================================
// CONFIGURACIÓN FIREBASE
// ================================


const firebaseConfig = {


apiKey: "AIzaSyBo_wk-k8TrcSl0CMQz0hoUCvAKre94hW0",

authDomain: "patronofertasweb.firebaseapp.com",

projectId: "patronofertasweb",

storageBucket: "patronofertasweb.firebasestorage.app",

messagingSenderId: "292338334268",

appId: "1:292338334268:web:9dbbafe00dd23ebb72e139"


};






// INICIAR FIREBASE


const app = initializeApp(firebaseConfig);



const auth = getAuth(app);






// ================================
// BOTÓN INGRESAR
// ================================


const boton =

document.getElementById(
"entrar"
);



boton.addEventListener(

"click",

async()=>{



const email =

document.getElementById(
"email"
).value;



const password =

document.getElementById(
"password"
).value;




const mensaje =

document.getElementById(
"mensaje"
);





if(!email || !password){


mensaje.innerHTML =

"⚠️ Completa todos los campos";


return;


}






try{



boton.innerHTML =

"INGRESANDO...";





await signInWithEmailAndPassword(

auth,

email,

password

);





mensaje.innerHTML =

"✅ Acceso correcto";





setTimeout(()=>{


window.location.href =

"admin.html";



},1000);






}

catch(error){



console.error(error);



mensaje.innerHTML =

"❌ Correo o contraseña incorrectos";



boton.innerHTML =

"🔐 INGRESAR";



}



});