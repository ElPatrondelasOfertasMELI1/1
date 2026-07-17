// =====================================================
// EL PATRÓN DE LAS OFERTAS
// GRAFICAS.JS
// SISTEMA DE GRAFICAS ADMIN PRO
// =====================================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
getDocs

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";





const firebaseConfig={


apiKey:"AIzaSyBo_wk-k8TrcSl0CMQz0hoUCvAKre94hW0",

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









// =====================================================
// GRAFICA DE VISITAS
// =====================================================


async function graficaVisitasAdmin(){


const canvas =
document.getElementById(
"graficaVisitas"
);



if(!canvas)return;





const datos =
await getDocs(

collection(
db,
"estadisticas_diarias"
)

);





let fechas=[];

let valores=[];




datos.forEach(item=>{


const d=item.data();


fechas.push(item.id);


valores.push(
d.visitas || 0
);


});





// ORDENAR POR FECHA


const ordenado =
fechas.map((fecha,i)=>{


return {

fecha:fecha,

valor:valores[i]

};


})

.sort((a,b)=>

a.fecha.localeCompare(
b.fecha

)

);





fechas =
ordenado.map(x=>x.fecha);



valores =
ordenado.map(x=>x.valor);







if(graficaVisitas){

graficaVisitas.destroy();

}





graficaVisitas =
new Chart(

canvas,

{


type:"line",


data:{


labels:fechas,


datasets:[{

label:"Visitas",

data:valores,

borderWidth:3,

tension:.4

}]


},



options:{


responsive:true,


plugins:{


legend:{


display:true

}


}



}


}

);




}









// =====================================================
// GRAFICA COPIAS CUPONES
// =====================================================


async function graficaCopias(){



const canvas =
document.getElementById(
"graficaCopias"
);



if(!canvas)return;




const datos =
await getDocs(

collection(
db,
"cupones"
)

);





let nombres=[];

let copias=[];





datos.forEach(item=>{


const c=item.data();



nombres.push(
c.nombre || "Cupón"
);



copias.push(
Number(c.copias || 0)
);



});






new Chart(

canvas,

{


type:"bar",


data:{


labels:nombres,


datasets:[{


label:"Copias",

data:copias,


borderWidth:2


}]


},


options:{


responsive:true

}



}

);




}









// =====================================================
// GRAFICA OFERTAS CLICS
// =====================================================


async function graficaClics(){



const canvas =
document.getElementById(
"graficaClics"
);



if(!canvas)return;




const datos =
await getDocs(

collection(
db,
"ofertas"
)

);





let nombres=[];

let clics=[];





datos.forEach(item=>{


const o=item.data();



nombres.push(

o.titulo.substring(0,15)

);



clics.push(

Number(o.clics || 0)

);



});






new Chart(

canvas,

{


type:"bar",


data:{


labels:nombres,


datasets:[{


label:"Clics",

data:clics,


borderWidth:2


}]


},



options:{


responsive:true

}



}

);





}










// =====================================================
// INICIO
// =====================================================


graficaVisitasAdmin();


graficaCopias();


graficaClics();