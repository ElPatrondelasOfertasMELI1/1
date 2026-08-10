// =====================================================
// EL PATRÓN DE LAS OFERTAS
// ADMIN.JS PRO + FIREBASE AUTH
// ADMIN UID:
// 3tnEuAFy3KOviI2lZEGFBUMGPkX2
// =====================================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// =====================================================
// FIREBASE
// =====================================================

const firebaseConfig = {

    apiKey: "AIzaSyBo_wk-k8TrcSl0MQzQ0hoUCvAKre94hW0",

    authDomain: "patronofertasweb.firebaseapp.com",

    projectId: "patronofertasweb",

    storageBucket: "patronofertasweb.firebasestorage.app",

    messagingSenderId: "292338334268",

    appId: "1:292338334268:web:9dbbafe00dd23ebb72e139"

};


const app =
    initializeApp(firebaseConfig);
alert("🔥 ADMIN.JS SÍ ESTÁ CARGANDO");

const db =
    getFirestore(app);

const auth =
    getAuth(app);


// =====================================================
// UID DEL ADMINISTRADOR
// =====================================================

const ADMIN_UID =
    "3tnEuAFy3KOviI2lZEGFBUMGPkX2";


// =====================================================
// ELEMENTOS LOGIN
// =====================================================

const loginAdmin =
    document.getElementById("loginAdmin");

const dashboardAdmin =
    document.getElementById("dashboardAdmin");

const entrarAdmin =
    document.getElementById("entrarAdmin");

const correoAdmin =
    document.getElementById("correoAdmin");

const passwordAdmin =
    document.getElementById("passwordAdmin");

const errorLogin =
    document.getElementById("errorLogin");


// =====================================================
// VARIABLES
// =====================================================

let imagenBase64 = "";

let ofertaEditando = null;

let cuponEditando = null;


// =====================================================
// TOAST
// =====================================================

function mensaje(texto) {

    const toast =
        document.getElementById("toastAdmin");

    if (!toast) return;

    toast.innerHTML = texto;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);

}


// =====================================================
// LOGIN
// =====================================================

if (entrarAdmin) {

    entrarAdmin.addEventListener("click", async function () {

        console.log("🔥 CLICK EN ENTRAR");

        const correo = correoAdmin.value.trim();
        const password = passwordAdmin.value;

        if (!correo || !password) {

            errorLogin.textContent =
                "⚠️ Escribe correo y contraseña";

            return;

        }

        entrarAdmin.disabled = true;
        entrarAdmin.textContent = "⏳ ENTRANDO...";

        errorLogin.textContent = "";

        try {

            console.log("🔐 Intentando iniciar sesión...");

            const resultado =
                await signInWithEmailAndPassword(
                    auth,
                    correo,
                    password
                );

            console.log(
                "✅ Firebase autenticó:",
                resultado.user.email
            );

            console.log(
                "🆔 UID:",
                resultado.user.uid
            );

            // ==============================
            // COMPROBAR ADMIN
            // ==============================

            if (resultado.user.uid !== ADMIN_UID) {

                console.log(
                    "🚫 UID NO AUTORIZADO"
                );

                await signOut(auth);

                errorLogin.textContent =
                    "🚫 Esta cuenta no es administradora";

                entrarAdmin.disabled = false;
                entrarAdmin.textContent =
                    "🔐 ENTRAR";

                return;

            }

            // ==============================
            // ADMIN CORRECTO
            // ==============================

            console.log(
                "👑 ADMINISTRADOR AUTORIZADO"
            );

            errorLogin.textContent =
                "✅ Acceso correcto";

            // onAuthStateChanged mostrará el panel

        }

        catch (error) {

            console.error(
                "❌ ERROR FIREBASE:",
                error
            );

            console.error(
                "Código:",
                error.code
            );

            console.error(
                "Mensaje:",
                error.message
            );

            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                errorLogin.textContent =
                    "❌ Correo o contraseña incorrectos";

            }

            else if (
                error.code ===
                "auth/wrong-password"
            ) {

                errorLogin.textContent =
                    "❌ Contraseña incorrecta";

            }

            else if (
                error.code ===
                "auth/user-not-found"
            ) {

                errorLogin.textContent =
                    "❌ Usuario no encontrado";

            }

            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                errorLogin.textContent =
                    "⚠️ Correo inválido";

            }

            else if (
                error.code ===
                "auth/too-many-requests"
            ) {

                errorLogin.textContent =
                    "⏳ Demasiados intentos. Espera unos minutos";

            }

            else {

                errorLogin.textContent =
                    "❌ " +
                    error.code;

            }

            entrarAdmin.disabled = false;
            entrarAdmin.textContent =
                "🔐 ENTRAR";

        }

    });

}

// =====================================================
// CONTROL DE SESIÓN
// =====================================================

onAuthStateChanged(auth, async (user) => {

    // =================================================
    // NO HAY USUARIO
    // =================================================

    if (!user) {

        if (loginAdmin) {

            loginAdmin.style.display =
                "flex";

        }

        if (dashboardAdmin) {

            dashboardAdmin.style.display =
                "none";

        }

        return;

    }

    // =================================================
    // USUARIO NO ES ADMIN
    // =================================================

    if (user.uid !== ADMIN_UID) {

        await signOut(auth);

        if (loginAdmin) {

            loginAdmin.style.display =
                "flex";

        }

        if (dashboardAdmin) {

            dashboardAdmin.style.display =
                "none";

        }

        if (errorLogin) {

            errorLogin.textContent =
                "🚫 Esta cuenta no tiene permisos de administrador";

        }

        return;

    }


    // =================================================
    // ADMINISTRADOR AUTORIZADO
    // =================================================

    console.log(
        "✅ Administrador autorizado:",
        user.uid
    );

    if (loginAdmin) {

        loginAdmin.style.display =
            "none";

    }

    if (dashboardAdmin) {

        dashboardAdmin.style.display =
            "block";

    }


    // =================================================
    // CARGAR PANEL
    // =================================================

    cargarOfertas();

    cargarCupones();

    cargarEstadisticas();

    cargarRegiones();

});


// =====================================================
// IMAGEN BASE64
// =====================================================

const imagen =
    document.getElementById("imagen");

const preview =
    document.getElementById("preview");


imagen?.addEventListener(
    "change",
    () => {

        const archivo =
            imagen.files[0];

        if (!archivo) return;

        const reader =
            new FileReader();

        reader.onload = e => {

            imagenBase64 =
                e.target.result;

            if (preview) {

                preview.src =
                    e.target.result;

                preview.style.display =
                    "block";

            }

        };

        reader.readAsDataURL(archivo);

    }
);


// =====================================================
// LIMPIAR OFERTA
// =====================================================

function limpiarOferta() {

    titulo.value = "";

    precioAntes.value = "";

    precioFinal.value = "";

    descuento.value = "";

    link.value = "";

    tipoOferta.value = "normal";

    imagen.value = "";

    imagenBase64 = "";

    preview.src = "";

    preview.style.display = "none";

    ofertaEditando = null;

    document.getElementById(
        "publicar"
    ).innerHTML =
        "🔥 PUBLICAR OFERTA";

}


// =====================================================
// LIMPIAR CUPÓN
// =====================================================

function limpiarCupon() {

    codigoCupon.value = "";

    nombreCupon.value = "";

    if (tipoDescuentoCupon)

        tipoDescuentoCupon.value =
            "pesos";

    descuentoCupon.value = "";

    if (topeCupon)

        topeCupon.value = "";

    minimoCupon.value = "";

    tipoCupon.value =
        "relampago";

    estadoCupon.value =
        "activo";

    cuponEditando = null;

    document.getElementById(
        "crearCupon"
    ).innerHTML =
        "🎟️ GUARDAR CUPÓN";

}


// =====================================================
// REFERENCIAS FORMULARIO
// =====================================================

const titulo =
    document.getElementById("titulo");

const precioAntes =
    document.getElementById("precioAntes");

const precioFinal =
    document.getElementById("precioFinal");

const descuento =
    document.getElementById("descuento");

const link =
    document.getElementById("link");

const tipoOferta =
    document.getElementById("tipoOferta");

const codigoCupon =
    document.getElementById("codigoCupon");

const nombreCupon =
    document.getElementById("nombreCupon");

const tipoDescuentoCupon =
    document.getElementById("tipoDescuentoCupon");

const descuentoCupon =
    document.getElementById("descuentoCupon");

const topeCupon =
    document.getElementById("topeCupon");

const minimoCupon =
    document.getElementById("minimoCupon");

const tipoCupon =
    document.getElementById("tipoCupon");

const estadoCupon =
    document.getElementById("estadoCupon");


// =====================================================
// MAYÚSCULAS CUPÓN
// =====================================================

codigoCupon?.addEventListener(
    "input",
    () => {

        codigoCupon.value =
            codigoCupon.value.toUpperCase();

    }
);


// =====================================================
// PUBLICAR / ACTUALIZAR OFERTA
// =====================================================

document
    .getElementById("publicar")
    ?.addEventListener(
        "click",
        async () => {

            try {

                // Seguridad adicional
                if (
                    !auth.currentUser ||
                    auth.currentUser.uid !== ADMIN_UID
                ) {

                    mensaje(
                        "🚫 No autorizado"
                    );

                    return;

                }


                if (
                    !titulo.value ||
                    !precioFinal.value
                ) {

                    mensaje(
                        "⚠️ Completa los datos"
                    );

                    return;

                }


                // =========================================
                // EDITAR
                // =========================================

                if (ofertaEditando) {

                    await updateDoc(

                        doc(
                            db,
                            "ofertas",
                            ofertaEditando
                        ),

                        {

                            titulo:
                                titulo.value,

                            imagen:
                                imagenBase64,

                            precioAntes:
                                precioAntes.value,

                            precioFinal:
                                precioFinal.value,

                            descuento:
                                descuento.value,

                            link:
                                link.value,

                            tipo:
                                tipoOferta.value

                        }

                    );

                    mensaje(
                        "✏️ Oferta actualizada"
                    );

                    limpiarOferta();

                    cargarOfertas();

                    cargarEstadisticas();

                    return;

                }


                // =========================================
                // NUEVA OFERTA
                // =========================================

                await addDoc(

                    collection(
                        db,
                        "ofertas"
                    ),

                    {

                        titulo:
                            titulo.value,

                        imagen:
                            imagenBase64,

                        precioAntes:
                            precioAntes.value,

                        precioFinal:
                            precioFinal.value,

                        descuento:
                            descuento.value,

                        link:
                            link.value,

                        tipo:
                            tipoOferta.value,

                        clics:
                            0,

                        creado:
                            serverTimestamp()

                    }

                );


                mensaje(
                    "🔥 Oferta publicada"
                );

                limpiarOferta();

                cargarOfertas();

                cargarEstadisticas();

            }

            catch (error) {

                console.error(
                    error
                );

                mensaje(
                    "❌ Error al guardar oferta"
                );

            }

        }
    );


// =====================================================
// CREAR / ACTUALIZAR CUPÓN
// =====================================================

document
    .getElementById("crearCupon")
    ?.addEventListener(
        "click",
        async () => {

            try {

                if (
                    !auth.currentUser ||
                    auth.currentUser.uid !== ADMIN_UID
                ) {

                    mensaje(
                        "🚫 No autorizado"
                    );

                    return;

                }


                if (!codigoCupon.value) {

                    mensaje(
                        "⚠️ Escribe un código"
                    );

                    return;

                }


                const datosCupon = {

                    codigo:
                        codigoCupon.value
                            .trim()
                            .toUpperCase(),

                    nombre:
                        nombreCupon.value ||
                        "CUPON",

                    tipoDescuento:
                        tipoDescuentoCupon.value ||
                        "pesos",

                    descuento:
                        descuentoCupon.value,

                    tope:
                        topeCupon.value || 0,

                    minimo:
                        minimoCupon.value,

                    tipo:
                        tipoCupon.value,

                    estado:
                        estadoCupon.value

                };


                // =========================================
                // EDITAR CUPÓN
                // =========================================

                if (cuponEditando) {

                    await updateDoc(

                        doc(
                            db,
                            "cupones",
                            cuponEditando
                        ),

                        datosCupon

                    );

                    mensaje(
                        "✏️ Cupón actualizado"
                    );

                    limpiarCupon();

                    cargarCupones();

                    return;

                }


                // =========================================
                // NUEVO CUPÓN
                // =========================================

                await addDoc(

                    collection(
                        db,
                        "cupones"
                    ),

                    {

                        ...datosCupon,

                        copias:
                            0,

                        creado:
                            serverTimestamp()

                    }

                );


                mensaje(
                    "🎟️ Cupón guardado"
                );

                limpiarCupon();

                cargarCupones();

                cargarEstadisticas();

            }

            catch (error) {

                console.error(
                    error
                );

                mensaje(
                    "❌ Error al guardar cupón"
                );

            }

        }
    );


// =====================================================
// CARGAR OFERTAS
// =====================================================

async function cargarOfertas() {

    const lista =
        document.getElementById(
            "listaOfertas"
        );

    if (!lista) return;

    try {

        lista.innerHTML =
            "Cargando...";


        const datos =
            await getDocs(
                collection(
                    db,
                    "ofertas"
                )
            );


        lista.innerHTML = "";


        datos.forEach(item => {

            const o =
                item.data();


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "ofertaAdmin";


            div.innerHTML = `

                <img src="${o.imagen || ""}">

                <h3>
                    ${o.titulo || "Sin título"}
                </h3>

                <p>
                    ❌ Antes:
                    $${o.precioAntes || 0}
                </p>

                <p>
                    🔥 Descuento:
                    ${o.descuento || 0}%
                </p>

                <p>
                    💥 Precio:
                    $${o.precioFinal || 0}
                </p>

                <p>
                    🖱️ Clics:
                    ${o.clics || 0}
                </p>

                <button class="editBtn">
                    ✏️ EDITAR
                </button>

                <button class="deleteBtn">
                    🗑️ ELIMINAR
                </button>

            `;


            // =========================================
            // EDITAR
            // =========================================

            div
                .querySelector(
                    ".editBtn"
                )
                .onclick = () => {

                    ofertaEditando =
                        item.id;

                    titulo.value =
                        o.titulo || "";

                    precioAntes.value =
                        o.precioAntes || "";

                    precioFinal.value =
                        o.precioFinal || "";

                    descuento.value =
                        o.descuento || "";

                    link.value =
                        o.link || "";

                    tipoOferta.value =
                        o.tipo || "normal";


                    imagenBase64 =
                        o.imagen || "";


                    preview.src =
                        o.imagen || "";

                    preview.style.display =
                        "block";


                    document.getElementById(
                        "publicar"
                    ).innerHTML =
                        "✏️ ACTUALIZAR OFERTA";


                    window.scrollTo({

                        top: 0,

                        behavior: "smooth"

                    });

                };


            // =========================================
            // ELIMINAR
            // =========================================

            div
                .querySelector(
                    ".deleteBtn"
                )
                .onclick = async () => {

                    if (
                        !confirm(
                            "¿Eliminar oferta?"
                        )
                    )

                        return;


                    try {

                        await deleteDoc(

                            doc(
                                db,
                                "ofertas",
                                item.id
                            )

                        );


                        mensaje(
                            "🗑️ Oferta eliminada"
                        );


                        cargarOfertas();

                        cargarEstadisticas();

                    }

                    catch (error) {

                        console.error(
                            error
                        );

                        mensaje(
                            "❌ No se pudo eliminar"
                        );

                    }

                };


            lista.appendChild(div);

        });

    }

    catch (error) {

        console.error(
            error
        );

        lista.innerHTML =
            "❌ Error cargando ofertas";

    }

}


// =====================================================
// CARGAR CUPONES
// =====================================================

async function cargarCupones() {

    const lista =
        document.getElementById(
            "listaCupones"
        );

    if (!lista) return;


    try {

        lista.innerHTML =
            "Cargando...";


        const datos =
            await getDocs(
                collection(
                    db,
                    "cupones"
                )
            );


        lista.innerHTML = "";


        datos.forEach(item => {

            const c =
                item.data();


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "ofertaAdmin";


            let descuentoTexto = "";


            if (
                c.tipoDescuento ===
                "porcentaje"
            ) {

                descuentoTexto =
                    c.descuento +
                    "% OFF";

            }

            else {

                descuentoTexto =
                    "$" +
                    c.descuento +
                    " OFF";

            }


            div.innerHTML = `

                <h3>
                    🎟️ ${c.nombre || "CUPON"}
                </h3>

                <strong>
                    ${c.codigo || ""}
                </strong>

                <p>
                    💰 Descuento:
                    ${descuentoTexto}
                </p>

                <p>
                    🛒 Compra mínima:
                    $${c.minimo || 0}
                </p>

                ${
                    c.tipoDescuento ===
                    "porcentaje"

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

                <p>
                    Estado:
                    ${c.estado || "activo"}
                </p>

                <p>
                    📋 Copias:
                    ${c.copias || 0}
                </p>

                <button class="editCupon">
                    ✏️ EDITAR
                </button>

                <button class="estadoBtn">
                    🔄 CAMBIAR ESTADO
                </button>

                <button class="deleteBtn">
                    🗑️ ELIMINAR
                </button>

            `;


            // =========================================
            // EDITAR
            // =========================================

            div
                .querySelector(
                    ".editCupon"
                )
                .onclick = () => {

                    cuponEditando =
                        item.id;


                    codigoCupon.value =
                        c.codigo || "";

                    nombreCupon.value =
                        c.nombre || "";


                    if (
                        tipoDescuentoCupon
                    )

                        tipoDescuentoCupon.value =
                            c.tipoDescuento ||
                            "pesos";


                    descuentoCupon.value =
                        c.descuento || "";


                    if (topeCupon)

                        topeCupon.value =
                            c.tope || "";


                    minimoCupon.value =
                        c.minimo || "";


                    tipoCupon.value =
                        c.tipo ||
                        "relampago";


                    estadoCupon.value =
                        c.estado ||
                        "activo";


                    document.getElementById(
                        "crearCupon"
                    ).innerHTML =
                        "✏️ ACTUALIZAR CUPÓN";


                    window.scrollTo({

                        top: 500,

                        behavior: "smooth"

                    });

                };


            // =========================================
            // CAMBIAR ESTADO
            // =========================================

            div
                .querySelector(
                    ".estadoBtn"
                )
                .onclick = async () => {

                    let nuevoEstado;


                    if (
                        c.estado ===
                        "activo"
                    ) {

                        nuevoEstado =
                            "agotando";

                    }

                    else if (
                        c.estado ===
                        "agotando"
                    ) {

                        nuevoEstado =
                            "agotado";

                    }

                    else {

                        nuevoEstado =
                            "activo";

                    }


                    try {

                        await updateDoc(

                            doc(
                                db,
                                "cupones",
                                item.id
                            ),

                            {
                                estado:
                                    nuevoEstado
                            }

                        );


                        mensaje(
                            "✅ Estado actualizado"
                        );


                        cargarCupones();

                    }

                    catch (error) {

                        console.error(
                            error
                        );

                        mensaje(
                            "❌ No se pudo actualizar"
                        );

                    }

                };


            // =========================================
            // ELIMINAR
            // =========================================

            div
                .querySelector(
                    ".deleteBtn"
                )
                .onclick = async () => {

                    if (
                        !confirm(
                            "¿Eliminar cupón?"
                        )
                    )

                        return;


                    try {

                        await deleteDoc(

                            doc(
                                db,
                                "cupones",
                                item.id
                            )

                        );


                        mensaje(
                            "🗑️ Cupón eliminado"
                        );


                        cargarCupones();

                        cargarEstadisticas();

                    }

                    catch (error) {

                        console.error(
                            error
                        );

                        mensaje(
                            "❌ No se pudo eliminar"
                        );

                    }

                };


            lista.appendChild(div);

        });

    }

    catch (error) {

        console.error(
            error
        );

        lista.innerHTML =
            "❌ Error cargando cupones";

    }

}


// =====================================================
// ESTADÍSTICAS
// =====================================================

async function cargarEstadisticas() {

    try {

        const ofertas =
            await getDocs(
                collection(
                    db,
                    "ofertas"
                )
            );


        const cupones =
            await getDocs(
                collection(
                    db,
                    "cupones"
                )
            );


        let clics = 0;

        let copias = 0;


        ofertas.forEach(item => {

            clics += Number(
                item.data().clics || 0
            );

        });


        cupones.forEach(item => {

            copias += Number(
                item.data().copias || 0
            );

        });


        document.getElementById(
            "totalOfertas"
        ).innerHTML =
            ofertas.size;


        document.getElementById(
            "totalCupones"
        ).innerHTML =
            cupones.size;


        document.getElementById(
            "totalClics"
        ).innerHTML =
            clics;


        document.getElementById(
            "totalCopias"
        ).innerHTML =
            copias;


        const visitas =
            await getDoc(

                doc(
                    db,
                    "estadisticas",
                    "visitas"
                )

            );


        if (visitas.exists()) {

            document.getElementById(
                "totalVisitas"
            ).innerHTML =
                visitas.data().total || 0;

        }


        const usuarios =
            await getDocs(
                collection(
                    db,
                    "usuarios"
                )
            );


        document.getElementById(
            "totalUsuarios"
        ).innerHTML =
            usuarios.size;

    }

    catch (error) {

        console.error(
            "Error estadísticas:",
            error
        );

    }

}


// =====================================================
// REGIONES
// =====================================================

async function cargarRegiones() {

    const lista =
        document.getElementById(
            "listaRegiones"
        );

    if (!lista) return;


    try {

        lista.innerHTML =
            "Cargando...";


        const datos =
            await getDocs(
                collection(
                    db,
                    "regiones"
                )
            );


        lista.innerHTML = "";


        datos.forEach(item => {

            const r =
                item.data();


            lista.innerHTML += `

                <div class="ofertaAdmin">

                    <h3>
                        🌎 ${item.id}
                    </h3>

                    <p>
                        👥 Visitas:
                        ${r.visitas || 0}
                    </p>

                </div>

            `;

        });

    }

    catch (error) {

        console.error(
            "Error regiones:",
            error
        );

        lista.innerHTML =
            "❌ Error cargando regiones";

    }

}


// =====================================================
// SALIR
// =====================================================

document
    .getElementById("salir")
    ?.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

            }

            catch (error) {

                console.error(
                    "Error al salir:",
                    error
                );

            }

        }
    );


// =====================================================
// ACTUALIZAR ESTADÍSTICAS
// =====================================================

let intervaloEstadisticas = null;


// =====================================================
// FIN ADMIN.JS
// =====================================================