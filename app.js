// =====================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS - PARTE 4
// FIREBASE + OFERTAS
// =====================================


// IMPORTAR FIREBASE

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import { 
getFirestore,
collection,
getDocs,
orderBy,
query
} from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// CONFIGURACIÓN FIREBASE
// CAMBIA ESTOS DATOS POR LOS TUYOS


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


const db = getFirestore(app);






// CONTENEDOR

const carrusel = document.getElementById("carrusel");







// CARGAR OFERTAS


async function cargarOfertas(){


try{


const ofertasRef = collection(db,"ofertas");


const q = query(
ofertasRef,
orderBy("fecha","desc")
);



const snapshot = await getDocs(q);



carrusel.innerHTML="";



if(snapshot.empty){


carrusel.innerHTML=

`
<div class="loader">
No hay ofertas disponibles
</div>
`;

return;

}




snapshot.forEach((doc)=>{


const oferta = doc.data();



crearTarjeta(oferta);



});



}

catch(error){


console.error(
"Error cargando ofertas:",
error
);


carrusel.innerHTML=

`
<div class="loader">
Error de conexión Firebase
</div>
`;


}


}







// CREAR TARJETA


function crearTarjeta(oferta){



const card=document.createElement("div");


card.className="oferta";



card.innerHTML=


`

<img src="${oferta.imagen || 'logo.png'}">



<div class="info">


<span class="descuento">

${oferta.descuento || "OFERTA"}

</span>



<h3>

${oferta.titulo}

</h3>



<p class="precioAntes">

$${oferta.precioAntes || ""}

</p>



<div class="precioFinal">

$${oferta.precioFinal}

</div>



<a 

class="btnComprar"

href="${oferta.link}"

target="_blank"

onclick="registrarClick()"

>

🛒 COMPRAR

</a>



</div>

`;



carrusel.appendChild(card);


}









// CONTADOR DE CLICS


window.registrarClick=function(){


let clicks =
localStorage.getItem("clicks")
||0;


clicks++;


localStorage.setItem(
"clicks",
clicks
);


};







// INICIAR


cargarOfertas();

