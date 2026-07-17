// =====================================
// EL PATRÓN DE LAS OFERTAS
// CUPONES PRO
// FIREBASE
// =====================================


import {initializeApp} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getFirestore,
collection,
doc,
onSnapshot,
updateDoc,
increment

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



const app=initializeApp(firebaseConfig);


const db=getFirestore(app);







const bancarios=
document.getElementById("cuponesBancarios");


const meli=
document.getElementById("cuponesMeli");







// CARGAR CUPONES


onSnapshot(

collection(db,"cupones"),

(snapshot)=>{


bancarios.innerHTML="";

meli.innerHTML="";



snapshot.forEach(item=>{


const c=item.data();



let estado="";

let clase="";



if(c.estado==="activo"){


estado="🟢 ACTIVO";

clase="activo";


}

else if(c.estado==="agotando"){


estado="🟠 POR AGOTARSE";

clase="agotando";


}

else{


estado="🔴 AGOTADO";

clase="agotado";


}







let tarjeta=`

<div class="cupon-card ${clase}">


<div class="estado">

${estado}

</div>



<h3>

${c.nombre || "Cupón"}

</h3>



<h2>

$${c.descuento} OFF

</h2>



<p>

🛒 Compra mínima:

<b>

${c.minimo || "$0"}

</b>

</p>



<p>

Copias:

${c.copias || 0}

</p>



<button

onclick="copiarCupon('${item.id}','${c.tipo}')">

📋 COPIAR CUPÓN

</button>


</div>

`;






if(c.tipo==="bancario"){


bancarios.innerHTML+=tarjeta;


}


else{


meli.innerHTML+=tarjeta;


}



});


}

);









// COPIAR CUPÓN


window.copiarCupon=
async(codigo,tipo)=>{



try{


await navigator.clipboard.writeText(codigo);



alert("✅ CUPÓN COPIADO");


}

catch{


prompt(
"Copia tu cupón:",
codigo
);


}





// CONTADOR CUPÓN


const ref=
doc(
db,
"cupones",
codigo
);



updateDoc(ref,{

copias:increment(1)

});







// CONTADOR GENERAL


const contador=
doc(
db,
"contadores",
"global"
);



updateDoc(contador,{

total:increment(1),

[tipo]:
increment(1)

});







// AHORRO UNA VEZ POR DÍA


const hoy=
new Date()
.toISOString()
.split("T")[0];



const clave=
"ahorro_"+codigo+"_"+hoy;



if(!localStorage.getItem(clave)){



const ahorro=
doc(
db,
"estadisticas",
"ahorro"
);



updateDoc(ahorro,{

total:increment(
Number(c.descuento)||0
)

});



localStorage.setItem(
clave,
"ok"
);



}






// REDIRECCIÓN MERCADO LIBRE


setTimeout(()=>{


window.location.href=
"https://meli.la/1mj3itE";

},500);



};