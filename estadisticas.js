// =====================================================
// EL PATRÓN DE LAS OFERTAS
// ESTADISTICAS.JS
// VISITAS + CLICS + COPIAS + REINICIO DIARIO
// =====================================================


import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
doc,
setDoc,
getDoc,
increment,
collection,
getDocs,
onSnapshot

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




// =====================================================
// FECHA CDMX
// =====================================================


function fechaCDMX(){


return new Intl.DateTimeFormat(
"en-CA",
{
timeZone:"America/Mexico_City"
}

).format(new Date());


}





// =====================================================
// REGISTRAR VISITA
// =====================================================


export async function registrarVisita(){


const hoy =
fechaCDMX();



await setDoc(

doc(
db,
"estadisticas",
"visitas"
),

{


total:
increment(1),



[hoy]:
increment(1)


},


{

merge:true

}

);


}




// EJECUTAR VISITA

registrarVisita();
// =====================================================
// REGISTRO DIARIO + MENSUAL
// =====================================================


function mesCDMX(){


const fecha = new Intl.DateTimeFormat(

"en-CA",

{

timeZone:"America/Mexico_City",

year:"numeric",

month:"2-digit"

}

).format(new Date());



return fecha.substring(0,7);


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
// REGISTRAR ACTIVIDAD
// ==============================


export async function registrarActividad(tipo){



const hoy = fechaCDMX();


const mes = mesCDMX();


const hora = horaCDMX();





const ref = doc(

db,

"estadisticas",

"general"

);






let datos={};





if(tipo==="visita"){


datos={


visitasTotal:increment(1),


[hoy]:increment(1),


[`mes_${mes}`]:increment(1),


[`hora_${hora}`]:increment(1)


};


}







if(tipo==="clic"){


datos={


clicsTotal:increment(1),


[`clic_${hoy}`]:increment(1),


[`clicMes_${mes}`]:increment(1)


};


}







if(tipo==="copia"){


datos={


copiasTotal:increment(1),


[`copia_${hoy}`]:increment(1),


[`copiaMes_${mes}`]:increment(1)


};


}







await setDoc(

ref,

datos,

{

merge:true

}

);



}









// ==============================
// CARGAR DATOS DASHBOARD
// ==============================


export async function cargarDashboard(){



const ref = doc(

db,

"estadisticas",

"general"

);





const snap = await getDoc(ref);





if(!snap.exists())

return;





const datos=snap.data();





if(document.getElementById("totalVisitas")){


totalVisitas.innerHTML =

datos.visitasTotal || 0;


}






if(document.getElementById("totalClics")){


totalClics.innerHTML =

datos.clicsTotal || 0;


}







if(document.getElementById("totalCopias")){


totalCopias.innerHTML =

datos.copiasTotal || 0;


}





}
// =====================================================
// ANALISIS DE DATOS
// DIA MAS FUERTE + HORA PICO
// =====================================================


export async function analizarEstadisticas(){



const ref = doc(

db,

"estadisticas",

"general"

);



const snap = await getDoc(ref);



if(!snap.exists())

return;



const datos = snap.data();





let diaFuerte="";

let visitasDia=0;



Object.keys(datos)

.forEach(key=>{


if(

key.match(/^\d{4}-\d{2}-\d{2}$/)

){



if(datos[key]>visitasDia){



visitasDia=

datos[key];



diaFuerte=

key;



}



}



});








let horaPico="";

let visitasHora=0;



Object.keys(datos)

.forEach(key=>{


if(

key.includes("hora_")

){



if(datos[key]>visitasHora){



visitasHora=

datos[key];



horaPico=

key.replace(

"hora_",

""

);



}



}



});







if(document.getElementById("diaFuerte")){


diaFuerte.innerHTML=

diaFuerte || "Sin datos";


}





if(document.getElementById("horaPico")){


horaPico.innerHTML=

horaPico+" hrs";


}





}









// =====================================================
// REINICIO DIARIO 12 AM CDMX
// =====================================================


async function verificarReinicio(){



const ahora = new Date();



const hora =

Number(

new Intl.DateTimeFormat(

"es-MX",

{

timeZone:"America/Mexico_City",

hour:"numeric",

hour12:false

}

).format(ahora)

);





if(hora===0){



const hoy=

fechaCDMX();




await setDoc(

doc(

db,

"estadisticas",

"diario"

),

{


fecha:hoy,


visitas:0,


clics:0,


copias:0


},


{

merge:true

}

);



}



}









// =====================================================
// INICIO ESTADISTICAS
// =====================================================



registrarActividad("visita");



cargarDashboard();



analizarEstadisticas();





// Revisar cada hora

setInterval(()=>{


verificarReinicio();


cargarDashboard();


analizarEstadisticas();



},3600000);