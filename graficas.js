// =====================================================
// EL PATRÓN DE LAS OFERTAS
// GRAFICAS.JS LIMPIO PRO
// ESTADISTICAS VISUALES ADMIN
// =====================================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
getDocs,
doc,
getDoc

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







let graficaVisitas=null;

let graficaCopias=null;

let graficaClics=null;








// =====================================================
// CARGAR DATOS
// =====================================================


async function cargarGraficas(){



// ==============================
// VISITAS
// ==============================


const visitasDoc =

await getDoc(

doc(
db,
"estadisticas",
"visitas"

)

);




const visitasData =

visitasDoc.exists()

?

visitasDoc.data()

:

{};






let fechas=[];

let visitas=[];





Object.keys(visitasData)

.filter(d=>d!=="total")

.sort()

.forEach(d=>{


fechas.push(d);


visitas.push(

visitasData[d] || 0

);


});






crearGraficaVisitas(

fechas,

visitas

);









// ==============================
// COPIAS CUPONES
// ==============================


const cupones =

await getDocs(

collection(
db,
"cupones"

)

);



let nombres=[];

let copias=[];





cupones.forEach(item=>{


const c=item.data();



nombres.push(

c.nombre || "Cupón"

);



copias.push(

Number(c.copias || 0)

);



});






crearGraficaCopias(

nombres,

copias

);









// ==============================
// CLICS OFERTAS
// ==============================


const ofertas =

await getDocs(

collection(
db,
"ofertas"

)

);



let productos=[];

let clics=[];





ofertas.forEach(item=>{


const o=item.data();



productos.push(

(o.titulo || "Oferta")

.substring(0,15)

);



clics.push(

Number(o.clics || 0)

);



});






crearGraficaClics(

productos,

clics

);





}










// =====================================================
// GRAFICA VISITAS
// =====================================================


function crearGraficaVisitas(labels,data){



const canvas =

document.getElementById(
"graficaVisitas"
);



if(!canvas)return;




if(graficaVisitas){

graficaVisitas.destroy();

}




graficaVisitas =

new Chart(

canvas,

{


type:"line",


data:{


labels:labels,


datasets:[{


label:"Visitas",


data:data,


borderWidth:3,


tension:.3


}]


},




options:{


responsive:true,


plugins:{


legend:{


display:true


}


},



scales:{


y:{


beginAtZero:true


}


}


}



}

);



}









// =====================================================
// GRAFICA COPIAS
// =====================================================


function crearGraficaCopias(labels,data){



const canvas =

document.getElementById(
"graficaCopias"
);



if(!canvas)return;




if(graficaCopias){

graficaCopias.destroy();

}





graficaCopias =

new Chart(

canvas,

{


type:"bar",


data:{


labels:labels,


datasets:[{


label:"Copias de cupones",


data:data,


borderWidth:2


}]


},



options:{


responsive:true,


scales:{


y:{


beginAtZero:true


}


}



}


}

);



}









// =====================================================
// GRAFICA CLICS
// =====================================================


function crearGraficaClics(labels,data){



const canvas =

document.getElementById(
"graficaClics"
);



if(!canvas)return;




if(graficaClics){

graficaClics.destroy();

}





graficaClics =

new Chart(

canvas,

{


type:"bar",


data:{


labels:labels,


datasets:[{


label:"Clics ofertas",


data:data,


borderWidth:2


}]


},



options:{


responsive:true,


scales:{


y:{


beginAtZero:true


}


}



}


}

);



}









// =====================================================
// INICIO
// =====================================================


cargarGraficas();


// =====================================================
// FIN GRAFICAS.JS PRO
// =====================================================