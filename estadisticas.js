// =====================================================
// EL PATRÓN DE LAS OFERTAS
// ESTADISTICAS.JS
// SISTEMA DE VISITAS + CLICS + COPIAS
// USA COLECCIONES EXISTENTES
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
getDocs

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// ==============================
// FIREBASE
// ==============================


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





function mesCDMX(){


return fechaCDMX().substring(0,7);


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
// REGISTRAR VISITA
// ==============================


async function registrarVisita(){


const dia =
fechaCDMX();


const mes =
mesCDMX();


const hora =
horaCDMX();




// TOTAL GENERAL


await setDoc(

doc(

db,

"visitas",

"contador"

),

{

total:

increment(1)

},

{

merge:true

}

);




// ESTADISTICA DIARIA


await setDoc(

doc(

db,

"estadisticas_diarias",

dia

),

{


fecha:dia,


visitas:

increment(1),


[`hora_${hora}`]:

increment(1)


},

{

merge:true

}

);





// ESTADISTICA MENSUAL


await setDoc(

doc(

db,

"estadisticas_mensuales",

mes

),

{


mes:mes,


visitas:

increment(1)


},

{

merge:true

}

);



}




// EJECUTAR AL ENTRAR


registrarVisita();
// =====================================================
// REGISTRAR CLICS DE OFERTAS
// =====================================================


async function registrarClic(){


const dia =
fechaCDMX();


const mes =
mesCDMX();




await setDoc(

doc(

db,

"estadisticas_diarias",

dia

),

{


clics:

increment(1)

},

{

merge:true

}

);





await setDoc(

doc(

db,

"estadisticas_mensuales",

mes

),

{


clics:

increment(1)

},

{

merge:true

}

);



}









// =====================================================
// REGISTRAR COPIAS DE CUPONES
// =====================================================


async function registrarCopia(){


const dia =
fechaCDMX();


const mes =
mesCDMX();




await setDoc(

doc(

db,

"estadisticas_diarias",

dia

),

{


copias:

increment(1)

},

{

merge:true

}

);






await setDoc(

doc(

db,

"estadisticas_mensuales",

mes

),

{


copias:

increment(1)

},

{

merge:true

}

);



}









// =====================================================
// DIA MAS FUERTE
// =====================================================


async function analizarDias(){



const datos =
await getDocs(

collection(

db,

"estadisticas_diarias"

)

);




let mayor=0;

let dia="";





datos.forEach(item=>{


const d=item.data();




if(

(d.visitas || 0)>mayor

){


mayor=d.visitas;


dia=item.id;


}


});





await setDoc(

doc(

db,

"estadisticas",

"resumen"

),

{


diaMayor:dia,


visitasMayor:mayor


},

{

merge:true

}

);



}









// =====================================================
// HORA PICO
// =====================================================


async function analizarHoras(){



const datos =
await getDocs(

collection(

db,

"estadisticas_diarias"

)

);



let horaGanadora="";

let mayor=0;




datos.forEach(item=>{


const d=item.data();



Object.keys(d)

.forEach(x=>{



if(

x.includes("hora_")

){



if(d[x]>mayor){



mayor=d[x];


horaGanadora=x;


}



}



});



});






await setDoc(

doc(

db,

"estadisticas",

"resumen"

),

{


horaPico:horaGanadora,


visitasHora:mayor


},

{

merge:true

}

);



}
// =====================================================
// REINICIO DIARIO CDMX
// =====================================================


async function verificarDiaNuevo(){


const ahora =
fechaCDMX();



const ref =
doc(

db,

"configuracion",

"estadisticas"

);



const snap =
await getDoc(ref);



if(!snap.exists()){


await setDoc(

ref,

{

ultimoDia:ahora

}

);


return;


}






const ultimo =
snap.data().ultimoDia;





if(ultimo!==ahora){



await setDoc(

ref,

{

ultimoDia:ahora

}

);



}



}









// =====================================================
// RESUMEN PARA ADMIN
// =====================================================


async function cargarResumen(){



const snap =
await getDoc(

doc(

db,

"estadisticas",

"resumen"

)

);





if(!snap.exists())

return;





const datos=snap.data();





const dia =
document.getElementById(
"diaMayor"
);



const hora =
document.getElementById(
"horaPico"
);





if(dia)

dia.innerHTML=

datos.diaMayor || "-";





if(hora)

hora.innerHTML=

datos.horaPico || "-";





}









// =====================================================
// INICIO
// =====================================================


verificarDiaNuevo();


analizarDias();


analizarHoras();


cargarResumen();





// Actualizar cada hora

setInterval(()=>{


verificarDiaNuevo();


analizarDias();


analizarHoras();


cargarResumen();



},3600000);





// =====================================================
// EXPORTAR FUNCIONES
// PARA USAR DESDE APP.JS
// =====================================================


window.registrarClic =
registrarClic;



window.registrarCopia =
registrarCopia;
