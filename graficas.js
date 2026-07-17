// =====================================================
// EL PATRÓN DE LAS OFERTAS
// GRAFICAS.JS
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





let graficaVisitas;
let graficaCopias;
let graficaClics;






// ==============================
// CARGAR ESTADISTICAS
// ==============================


async function cargarGraficas(){


const visitas =
await getDoc(
doc(db,"estadisticas","visitas")
);



const datosVisitas =
visitas.exists()
?
visitas.data()
:
{};





// ==============================
// VISITAS
// ==============================


let fechas=[];

let valores=[];



Object.keys(datosVisitas)

.filter(x=>x!=="total")

.sort()

.forEach(dia=>{


fechas.push(dia);


valores.push(
datosVisitas[dia] || 0
);


});






crearGraficaVisitas(
fechas,
valores
);





// ==============================
// COPIAS CUPONES
// ==============================


const cupones =
await getDocs(
collection(db,"cupones")
);



let nombresCupon=[];

let copias=[];



cupones.forEach(item=>{


const c=item.data();


nombresCupon.push(
c.nombre || "Cupón"
);


copias.push(
Number(c.copias || 0)
);


});





crearGraficaCopias(
nombresCupon,
copias
);








// ==============================
// CLICS OFERTAS
// ==============================


const ofertas =
await getDocs(
collection(db,"ofertas")
);



let productos=[];

let clicks=[];



ofertas.forEach(item=>{


const o=item.data();


productos.push(
o.titulo.substring(0,15)
);



clicks.push(
Number(o.clics || 0)
);



});





crearGraficaClics(
productos,
clicks
);




}




// =====================================================
// GRAFICA VISITAS
// =====================================================


function crearGraficaVisitas(labels,data){


const canvas =
document.getElementById("graficaVisitas");


if(!canvas)return;



if(graficaVisitas)
graficaVisitas.destroy();



graficaVisitas =
new Chart(canvas,{


type:"line",


data:{


labels,


datasets:[{


label:"Visitas",

data,

tension:.3

}]

},


options:{


responsive:true


}


});


}







// =====================================================
// GRAFICA COPIAS
// =====================================================


function crearGraficaCopias(labels,data){


const canvas =
document.getElementById("graficaCopias");


if(!canvas)return;



if(graficaCopias)
graficaCopias.destroy();



graficaCopias =
new Chart(canvas,{


type:"bar",


data:{


labels,


datasets:[{


label:"Copias",

data

}]


},


options:{


responsive:true


}


});



}








// =====================================================
// GRAFICA CLICS
// =====================================================


function crearGraficaClics(labels,data){


const canvas =
document.getElementById("graficaClics");


if(!canvas)return;



if(graficaClics)
graficaClics.destroy();



graficaClics =
new Chart(canvas,{


type:"bar",


data:{


labels,


datasets:[{


label:"Clics",

data

}]


},


options:{


responsive:true


}


});



}







// ==============================
// INICIO
// ==============================


cargarGraficas();