// =====================================
// EL PATRÓN DE LAS OFERTAS
// APP PRO
// FIREBASE OFERTAS PUBLICAS
// =====================================


import {initializeApp} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
doc,
getDoc,
onSnapshot,
updateDoc,
increment

}

from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// FIREBASE


const firebaseConfig={


apiKey:"AIzaSyBo_wk-k8TrcSl0CMQz0hoUCvAKre94hW0",

authDomain:"patronofertasweb.firebaseapp.com",

projectId:"patronofertasweb",

storageBucket:"patronofertasweb.firebasestorage.app",

messagingSenderId:"292338334268",

appId:"1:292338334268:web:9dbbafe00dd23ebb72e139"

};



const app=initializeApp(firebaseConfig);


const db=getFirestore(app);







const carrusel=
document.getElementById("ofertasPublicas");



const puntos=
document.getElementById("flashDots");




let posicion=0;

let timer;









// CARGAR OFERTAS


onSnapshot(

collection(db,"ofertas"),

async(snapshot)=>{


carrusel.innerHTML="";

puntos.innerHTML="";



let ofertas=[];



for(const item of snapshot.docs){


const o=item.data();



if(o.activo){


ofertas.push({

id:item.id,

...o

});


}


}




for(let i=0;i<ofertas.length;i++){


const o=ofertas[i];



let imagen="logo.png";




// BUSCAR IMAGEN


if(o.imagenID){


const imgDoc=
await getDoc(
doc(
db,
"imagenes",
o.imagenID
)

);



if(imgDoc.exists()){


imagen=
imgDoc.data().imagen;


}


}





carrusel.innerHTML+=`

<div class="flash-slide"
onclick="abrirOferta('${o.id}','${o.link}')">


<img src="${imagen}">



<h3>

${o.titulo}

</h3>



<div class="flash-old">

Antes:

<s>

$${o.precioAntes}

</s>

</div>



<div class="flash-price">

$${o.precioFinal}

</div>



<div class="flash-btn">

🛒 COMPRAR

</div>



</div>


`;




puntos.innerHTML+=`

<div class="flash-dot ${i==0?'active':''}"
onclick="irOferta(${i})">

</div>

`;



}



iniciarCarrusel();



}

);









// CLICK OFERTA


window.abrirOferta=
async(id,link)=>{


const ref=
doc(
db,
"ofertas",
id
);



await updateDoc(ref,{

clics:increment(1)

});



window.open(
link,
"_blank"
);


};









// CARRUSEL AUTOMÁTICO


function mover(){


const total=
document.querySelectorAll(".flash-slide").length;



if(!total)return;



posicion++;


if(posicion>=total)

posicion=0;



actualizar();



}




function actualizar(){


carrusel.style.transform=

`translateX(-${posicion*100}%)`;



document
.querySelectorAll(".flash-dot")
.forEach((d,i)=>{


d.classList.toggle(
"active",
i===posicion
);


});


}







function iniciarCarrusel(){


clearInterval(timer);



timer=setInterval(()=>{


mover();


},4000);



}





window.irOferta=function(i){


posicion=i;


actualizar();


iniciarCarrusel();


};







// SWIPE MOVIL


let inicio=0;



carrusel.addEventListener(
"touchstart",
e=>{


inicio=e.touches[0].clientX;


},{passive:true}

);




carrusel.addEventListener(
"touchend",
e=>{


let final=
e.changedTouches[0].clientX;



if(inicio-final>50){


posicion++;

}


if(final-inicio>50){


posicion--;

}



const total=
document.querySelectorAll(".flash-slide").length;



if(posicion<0)
posicion=total-1;



if(posicion>=total)
posicion=0;



actualizar();


},{passive:true}

);