// =====================================================
// EL PATRÓN DE LAS OFERTAS
// APP.JS PRO CORREGIDO
// CUPONES BANCARIOS % + TOPE
// =====================================================


import { 

initializeApp 

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";



import {

getFirestore,
collection,
doc,
updateDoc,
increment,
onSnapshot,
setDoc,
serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





// ==============================
// FIREBASE
// ==============================


const firebaseConfig={


apiKey:"AIzaSyBo_wk-k8TrcSl0MQzQ0hoUCvAKre94hW0",

authDomain:"patronofertasweb.firebaseapp.com",

projectId:"patronofertasweb",

storageBucket:"patronofertasweb.firebasestorage.app",

messagingSenderId:"292338334268",

appId:"1:292338334268:web:9dbbafe00dd23ebb72e139"

};



const app =
initializeApp(firebaseConfig);



const db =
getFirestore(app);






// =====================================================
// REGIONES
// =====================================================


async function registrarRegion(){


try{


const respuesta =

await fetch(

"https://ipapi.co/json/"

);



const datos =

await respuesta.json();




const region =

datos.region || "Desconocido";





await setDoc(

doc(

db,

"regiones",

region

),

{


visitas:

increment(1),


ultimaVisita:

new Date()


},


{

merge:true

}

);



}

catch(error){


console.log(

"Error región:",

error

);


}



}







// ==============================
// FECHA CDMX
// ==============================


function fechaCDMX(){


return new Intl.DateTimeFormat(

"en-CA",

{

timeZone:"America/Mexico_City"

}

).format(new Date());


}







function horaCDMX(){


return new Intl.DateTimeFormat(

"es-MX",

{

timeZone:"America/Mexico_City",

hour:"2-digit",

hour12:false

}

).format(new Date());


}








// ==============================
// USUARIO
// ==============================


function obtenerUsuario(){


let id =

localStorage.getItem(

"usuarioID"

);



if(!id){


id =

"usr_"+

Date.now()+

Math.floor(Math.random()*999);



localStorage.setItem(

"usuarioID",

id

);



}


return id;


}






async function registrarUsuario(){


const usuario =

obtenerUsuario();



await setDoc(

doc(

db,

"usuarios",

usuario

),

{


ultimaConexion:

serverTimestamp(),


dispositivo:

navigator.userAgent,


pais:

"Mexico"


},

{

merge:true

}

);



}






// ==============================
// ESTADISTICAS
// ==============================


async function registrarEstadistica(tipo){


const fecha =

fechaCDMX();



const hora =

horaCDMX();





await setDoc(

doc(

db,

"estadisticas_diarias",

fecha

),

{


[tipo]:

increment(1),


[`hora_${hora}`]:

increment(1),


fecha:fecha


},


{

merge:true

}

);





}




async function registrarVisita(){



await setDoc(

doc(

db,

"estadisticas",

"visitas"

),

{


total:

increment(1)


},


{

merge:true

}

);



registrarEstadistica(

"visitas"

);



registrarUsuario();



}




registrarVisita();


registrarRegion();

// =====================================================
// ELEMENTOS DOM
// =====================================================


const carrusel =

document.getElementById(

"carrusel"

);



const relampago =

document.getElementById(

"cuponesRelampago"

);



const bancarios =

document.getElementById(

"cuponesBancarios"

);



const exclusivos =

document.getElementById(

"cuponesExclusivos"

);



const toast =

document.getElementById(

"toast"

);







let intervaloCarrusel=null;

let carruselActivo=true;


let ofertasClonadas = false;





// ==============================
// TOAST
// ==============================


function mostrarToast(texto){


if(!toast)return;



toast.innerHTML=texto;


toast.classList.add(

"show"

);



setTimeout(()=>{


toast.classList.remove(

"show"

);



},2000);



}









// =====================================================
// OFERTAS TIEMPO REAL
// =====================================================


function cargarOfertas(){

    if(!carrusel) return;

    onSnapshot(collection(db,"ofertas"),(datos)=>{

        carrusel.innerHTML="";
        ofertasClonadas = false;

        datos.forEach(item=>{

            const o=item.data();

            const card=document.createElement("div");

            card.className="oferta";

            card.innerHTML=`
                <img src="${o.imagen || ""}">
                <h3>${o.titulo || "Oferta"}</h3>

                <div class="precioAntes">
                    ❌ Antes: <s>$${o.precioAntes || 0}</s>
                </div>

                <div class="descuento">
                    🔥 ${o.descuento || 0}% OFF
                </div>

                <div class="precio">
                    💥 $${o.precioFinal || 0}
                </div>

                <a href="${o.link || "#"}" target="_blank" class="btnOferta">
                    🛒 VER OFERTA
                </a>
            `;

            card.querySelector(".btnOferta").addEventListener("click",async()=>{

                registrarEstadistica("clics");

                await updateDoc(
                    doc(db,"ofertas",item.id),
                    { clics: increment(1) }
                ).catch(()=>{});

            });

            carrusel.appendChild(card);

        });

        // Clonar tarjetas para efecto infinito
        if(!ofertasClonadas){

            [...carrusel.children].forEach(card=>{

                carrusel.appendChild(card.cloneNode(true));

            });

            ofertasClonadas = true;

        }

    });

}



// =====================================================
// AUTO CARRUSEL
// =====================================================


function iniciarCarrusel(){

    if(!carrusel) return;

    clearInterval(intervaloCarrusel);

    intervaloCarrusel = setInterval(()=>{

        if(!carruselActivo) return;

        carrusel.scrollBy({
            left:295,
            behavior:"smooth"
        });

        if(carrusel.scrollLeft >= carrusel.scrollWidth/2){

            carrusel.scrollLeft = 0;

        }

    },3500);

}






if(carrusel){


carrusel.addEventListener(

"touchstart",

()=>{

carruselActivo=false;

}

);



carrusel.addEventListener(

"touchend",

()=>{


setTimeout(()=>{


carruselActivo=true;


},1500);



}

);



}

// =====================================================
// CUPONES TIEMPO REAL
// =====================================================


function cargarCupones(){



onSnapshot(

collection(db,"cupones"),

(datos)=>{



const relampagos = datos.docs
.filter(doc => doc.data().tipo === "relampago")
.sort((a,b)=>
    parseInt(String(a.data().descuento || "0").replace(/,/g,"")) -
    parseInt(String(b.data().descuento || "0").replace(/,/g,""))
);

const bancariosLista = datos.docs
.filter(doc => doc.data().tipo === "bancario")
.sort((a,b)=>
    parseInt(String(b.data().descuento || "0").replace(/,/g,"")) -
    parseInt(String(a.data().descuento || "0").replace(/,/g,""))
);

const exclusivosLista = datos.docs
.filter(doc => doc.data().tipo !== "relampago" &&
               doc.data().tipo !== "bancario");

const cupones = [
    ...relampagos,
    ...bancariosLista,
    ...exclusivosLista
];







[

relampago,

bancarios,

exclusivos

]

.forEach(seccion=>{


if(seccion)

seccion.innerHTML="";


});









cupones.forEach(item=>{



const c=item.data();






const tarjeta=

document.createElement("div");



tarjeta.className=

"cuponCard";






let descuentoTexto="";






if(c.tipoDescuento==="porcentaje"){



descuentoTexto=

`

💳 ${c.descuento || 0}% OFF

`;



}

else{


descuentoTexto=

`

💰 $${c.descuento || 0} OFF

`;



}






tarjeta.innerHTML=`

<div class="estado">


${
c.estado==="agotado"

?

"🔴 AGOTADO"

:

c.estado==="agotando"

?

"⚡ ÚLTIMAS PIEZAS"

:

"🟢 DISPONIBLE"

}


</div>






<h3>

🎟️ ${c.nombre || "CUPÓN"}

</h3>







<p>

${descuentoTexto}

</p>








<p>

🛒 Compra mínima:

$${c.minimo || 0}

</p>







${
c.tipo==="bancario"

?

`

<p>

🔝 Tope máximo:

$${c.tope || 0}

</p>

`

:

""

}







<button class="copiarCupon">

📋 COPIAR CUPÓN

</button>

`;








tarjeta

.querySelector(

".copiarCupon"

)

.onclick=()=>{



copiarCupon(

item.id,

c.codigo

);



};









if(c.tipo==="relampago"){



relampago?.appendChild(

tarjeta

);



}

else if(c.tipo==="bancario"){



bancarios?.appendChild(

tarjeta

);



}

else{


exclusivos?.appendChild(

tarjeta

);



}



});



});



}




function abrirMercadoLibre(link) {

    const ua = navigator.userAgent.toLowerCase();

    if (ua.includes("android")) {

        const intent = link.replace("https://", "intent://") +
            "#Intent;scheme=https;package=com.mercadolibre;end";

        window.location.href = intent;

        setTimeout(() => {
            window.location.href = link;
        }, 1200);

        return;
    }

    window.location.href = link;
}




// =====================================================
// COPIAR CUPÓN
// =====================================================


async function copiarCupon(id,codigo){



try{



await navigator.clipboard.writeText(

codigo

);





mostrarToast(

"✅ CUPÓN COPIADO"

);





registrarEstadistica(

"copias"

);







await updateDoc(

doc(

db,

"cupones",

id

),

{


copias:

increment(1)


}

);







setTimeout(() => {
    abrirMercadoLibre(""https://mercadolibre.com/sec/1vwHKr6"");
}, 300);





}

catch(error){


console.log(error);


}



}









// =====================================================
// BOTÓN SUBIR
// =====================================================


const btnArriba=

document.getElementById(

"btnArriba"

);




if(btnArriba){



window.addEventListener(

"scroll",

()=>{


btnArriba.style.display=

window.scrollY>400

?

"block"

:

"none";



}

);





btnArriba.onclick=()=>{


window.scrollTo({

top:0,

behavior:"smooth"

});



};



}









// =====================================================
// INICIO
// =====================================================


cargarOfertas();


cargarCupones();


iniciarCarrusel();



// =====================================================
// FIN APP.JS
// =====================================================