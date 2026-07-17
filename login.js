// =====================================
// EL PATRÓN DE LAS OFERTAS
// LOGIN ADMIN PRO
// FIREBASE AUTH
// =====================================



import { initializeApp } from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";



import {

getAuth,

signInWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";








// =============================
// CONFIG FIREBASE
// =============================



const firebaseConfig = {


apiKey:"TU_API_KEY",

authDomain:"TU_PROYECTO.firebaseapp.com",

projectId:"TU_PROJECT_ID",

storageBucket:"TU_STORAGE_BUCKET",

messagingSenderId:"TU_SENDER_ID",

appId:"TU_APP_ID"


};









const app = initializeApp(firebaseConfig);



const auth = getAuth(app);









const boton =

document.getElementById("entrar");



const mensaje =

document.getElementById("mensaje");









boton.onclick = async()=>{



const email =

document.getElementById("email").value;



const password =

document.getElementById("password").value;








if(!email || !password){


mensaje.innerHTML=

"Completa todos los campos";


return;


}









try{



boton.innerHTML=

"ENTRANDO...";





await signInWithEmailAndPassword(

auth,

email,

password

);






mensaje.innerHTML=

"✅ Acceso correcto";






setTimeout(()=>{


window.location.href=

"admin.html";



},1000);






}

catch(error){



console.error(error);



mensaje.innerHTML=

"❌ Correo o contraseña incorrectos";



boton.innerHTML=

"🔐 INGRESAR";



}



};