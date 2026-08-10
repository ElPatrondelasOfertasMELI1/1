import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <div style="
        position:fixed;
        top:0;
        left:0;
        right:0;
        z-index:999999;
        background:red;
        color:white;
        padding:20px;
        text-align:center;
        font-size:20px;
        font-weight:bold;
    ">
        🔥 PRUEBA-AUTH.JS CARGADO
    </div>
    `
);

const firebaseConfig = {

    apiKey: "AIzaSyBo_wk-k8TrcSl0CMQz0hoUCvAKre94hW0",

    authDomain: "patronofertasweb.firebaseapp.com",

    projectId: "patronofertasweb",

    storageBucket: "patronofertasweb.firebasestorage.app",

    messagingSenderId: "292338334268",

    appId: "1:292338334268:web:9dbbafe00dd23ebb72e139"

};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


console.log("🔥 PRUEBA AUTH CARGADA");


const boton =
    document.getElementById("entrarAdmin");

const correo =
    document.getElementById("correoAdmin");

const password =
    document.getElementById("passwordAdmin");

const error =
    document.getElementById("errorLogin");


const login =
    document.getElementById("loginAdmin");

const panel =
    document.getElementById("dashboardAdmin");


boton?.addEventListener("click", async () => {

    console.log("🔥 BOTÓN ENTRAR FUNCIONA");

    const email =
        correo.value.trim();

    const pass =
        password.value;

    if (!email || !pass) {

        error.textContent =
            "⚠️ Escribe correo y contraseña";

        return;

    }

    boton.disabled = true;

    boton.textContent =
        "⏳ ENTRANDO...";

    error.textContent = "";

    try {

        console.log(
            "🔐 Intentando:",
            email
        );

        const resultado =
            await signInWithEmailAndPassword(
                auth,
                email,
                pass
            );

        console.log(
            "✅ LOGIN FIREBASE:",
            resultado.user.uid
        );

        error.textContent =
            "✅ Autenticación correcta";

    }

    catch (e) {

        console.error(
            "❌ ERROR:",
            e
        );

        error.textContent =
            e.code +
            " — " +
            e.message;

        boton.disabled = false;

        boton.textContent =
            "🔐 ENTRAR";

    }

});


onAuthStateChanged(auth, user => {

    console.log(
        "👤 ESTADO:",
        user
    );

});