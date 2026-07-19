// =====================================================
// EL PATRÓN DE LAS OFERTAS
// ESTADISTICAS.JS LIMPIO PRO
// SOLO LECTURA + DASHBOARD + GRAFICAS
// =====================================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
doc,
getDoc,
collection,
getDocs

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







// ==============================
// FECHA CDMX
// ==============================


function fechaCDMX(){


return new Date()

.toLocaleString(
"sv-SE",
{
timeZone:"America/Mexico_City"
}

)

.split(" ")[0];


}








// ==============================
// CARGAR ESTADISTICAS
// ==============================


async function cargarEstadisticas(){


const hoy =
fechaCDMX();



const mes =
hoy.substring(0,7);




// ==============================
// VISITAS HOY
// ==============================


const hoyDoc =

await getDoc(

doc(
db,
"estadisticas_diarias",
hoy
)

);




const visitasHoy =

document.getElementById(
"visitasHoy"
);



if(visitasHoy){


visitasHoy.innerHTML =

hoyDoc.exists()

?

hoyDoc.data().visitas || 0

:

0;


}







// ==============================
// VISITAS MES
// ==============================


const mesDoc =

await getDoc(

doc(
db,
"estadisticas_mensuales",
mes
)

);




const visitasMes =

document.getElementById(
"visitasMes"
);



if(visitasMes){


visitasMes.innerHTML =

mesDoc.exists()

?

mesDoc.data().visitas || 0

:

0;


}

// ==============================
// MEJOR DIA
// ==============================


const dias =

await getDocs(

collection(
db,
"estadisticas_diarias"
)

);



let mayor = 0;

let dia = "-";





dias.forEach(d=>{


const datos = d.data();



const visitas =

datos.visitas || 0;




if(visitas > mayor){


mayor = visitas;


dia = d.id;


}


});







const diaMayor =

document.getElementById(
"diaMayor"
);



if(diaMayor){


diaMayor.innerHTML =

dia + " (" + mayor + ")";


}








// ==============================
// HORA PICO
// ==============================


const historial =

await getDocs(

collection(
db,
"visitas_historial"
)

);





let horas = {};





historial.forEach(v=>{


const hora =

v.data().hora;



if(hora){


horas[hora] =

(horas[hora] || 0) + 1;


}



});







let horaMax = "-";

let cantidad = 0;





Object.keys(horas)

.forEach(h=>{



if(horas[h] > cantidad){



cantidad = horas[h];


horaMax = h;



}


});







const horaPico =

document.getElementById(
"horaPico"
);



if(horaPico){


horaPico.innerHTML =

horaMax + " (" + cantidad + ")";


}



}







// ==============================
// INICIAR DASHBOARD
// ==============================


cargarEstadisticas();

// =====================================================
// GRAFICA VISITAS
// =====================================================


let graficaVisitas = null;





async function crearGraficaVisitas(){



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







let registros = [];





datos.forEach(d=>{



registros.push({


fecha:d.id,


visitas:d.data().visitas || 0



});



});








// ORDENAR POR FECHA


registros.sort((a,b)=>{


return a.fecha.localeCompare(
b.fecha
);


});








const fechas =

registros.map(x=>x.fecha);



const visitas =

registros.map(x=>x.visitas);








if(graficaVisitas){


graficaVisitas.destroy();


}







graficaVisitas = new Chart(

canvas,

{


type:"line",



data:{


labels:fechas,


datasets:[{


label:"Visitas",


data:visitas,


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





crearGraficaVisitas();



// =====================================================
// FIN ESTADISTICAS.JS LIMPIO PRO
// =====================================================