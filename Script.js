// Activa el modo estricto: JS avisa de errores comunes (variables sin declarar, etc.)
"use strict";

/* ==========================================================
   CONFIGURACIÓN — editá solo esto
   ========================================================== */

// Objeto con los datos que vas a cambiar vos
const CONFIG = {
    // Tu correo, usado por el botón Email
    email: "tucorreo@ejemplo.com",
    // Link a tu canal, usado por el botón YouTube
    youtube: "https://www.youtube.com/@tucanal",
    // URL del servicio de formularios (Formspree, etc.); vacío = envío simulado
    formEndpoint: "",
    // Mínimo de caracteres que debe tener la consulta
    minConsulta: 20,
    // Máximo de caracteres que puede tener la consulta
    maxConsulta: 500,
};

// Objeto con los textos que aparecen en el modal de cada servicio
const SERVICIOS = {
    // Clave "civil": coincide con el data-servicio del botón en el HTML
    civil: {
        // Título que se verá en el modal
        titulo: "Civil y Comercial",
        // Texto largo del modal (reemplazalo por el real)
        texto: "Contratos, daños y perjuicios, sucesiones, cobro de deudas y conflictos comerciales. Texto de ejemplo.",
    },
    // Clave "penal"
    penal: {
        // Título del modal penal
        titulo: "Penal",
        // Texto del modal penal
        texto: "Asistencia a víctimas y a personas imputadas durante todo el proceso. Texto de ejemplo.",
    },
    // Clave "laboral"
    laboral: {
        // Título del modal laboral
        titulo: "Laboral",
        // Texto del modal laboral
        texto: "Despidos, indemnizaciones, trabajo no registrado y accidentes laborales. Texto de ejemplo.",
    },
    // Clave "familia"
    familia: {
        // Título del modal de familia
        titulo: "Familia",
        // Texto del modal de familia
        texto: "Divorcios, cuota alimentaria, régimen de comunicación y adopciones. Texto de ejemplo.",
    },
};

/* ==========================================================
   1. Botón "Contactate con nosotros" → baja al formulario
   ========================================================== */

// Busca en la página el botón con id="btnContacto" y lo guarda en una constante
const btnContacto = document.querySelector("#btnContacto");

// Si el botón existe (?.), escucha el click y ejecuta la función flecha
btnContacto?.addEventListener("click", () => {
    // Lee el data-target del botón ("#SeccionContacto") y busca ese elemento
    const destino = document.querySelector(btnContacto.dataset.target);
    // Si encontró el destino, hace scroll suave hasta él
    destino?.scrollIntoView({ behavior: "smooth" });
});

/* ==========================================================
   2. Botones Email y YouTube
   ========================================================== */

// Busca el botón #Email y, al hacer click, ejecuta la función
document.querySelector("#Email")?.addEventListener("click", () => {
    // Cambia la dirección del navegador a un mailto: para abrir el correo
    window.location.href = `mailto:${CONFIG.email}`;
});

// Busca el botón #YouTube y, al hacer click, ejecuta la función
document.querySelector("#YouTube")?.addEventListener("click", () => {
    // Abre tu canal en una pestaña nueva (noopener por seguridad)
    window.open(CONFIG.youtube, "_blank", "noopener");
});

/* ==========================================================
   3. Menú: marca la sección visible (scroll spy)
   ========================================================== */

// Guarda todas las secciones de <main> en una lista
const secciones = document.querySelectorAll("main section");
// Guarda todos los links del menú en una lista
const linksMenu = document.querySelectorAll("nav a");

// Crea un observador que avisa cuando algo entra o sale de la pantalla
const observerMenu = new IntersectionObserver(
    // Función que se ejecuta cada vez que cambia la visibilidad de una sección
    (entradas) => {
        // Recorre cada sección que cambió
        entradas.forEach((entrada) => {
            // Si la sección no está visible, no hace nada y sigue con la próxima
            if (!entrada.isIntersecting) return;
            // Recorre todos los links del menú
            linksMenu.forEach((link) => {
                // Agrega "is-active" solo al link cuyo href coincide con la sección visible
                link.classList.toggle(
                    // Nombre de la clase a agregar o quitar
                    "is-active",
                    // Condición: ¿el href del link es "#" + id de la sección visible?
                    link.getAttribute("href") === `#${entrada.target.id}`
                );
            });
        });
    },
    // Opción: la sección se considera visible cuando cruza el centro de la pantalla
    { rootMargin: "-50% 0px -50% 0px" }
);

// Le dice al observador que vigile cada una de las secciones
secciones.forEach((s) => observerMenu.observe(s));

/* ==========================================================
   4. Animación de aparición al hacer scroll
   ========================================================== */

// Guarda en una lista todos los elementos que querés animar (selectores separados por coma)
const elementosReveal = document.querySelectorAll(
    ".Contenedor_Incio > *, .Contenedor_Abogado > *, .Contenedor_Servicio > div, .Contenedor_Noticias > *, .Contenedor_Contacto form"
);

// Crea un segundo observador, ahora para las animaciones
const observerReveal = new IntersectionObserver(
    // Función que recibe los elementos que cambiaron y el propio observador
    (entradas, observer) => {
        // Recorre cada elemento que cambió de visibilidad
        entradas.forEach((entrada) => {
            // Si todavía no se ve en pantalla, lo ignora
            if (!entrada.isIntersecting) return;
            // Le agrega la clase que lo hace aparecer (definida en el CSS)
            entrada.target.classList.add("is-visible");
            // Deja de observarlo para que la animación ocurra una sola vez
            observer.unobserve(entrada.target);
        });
    },
    // Opción: se activa cuando se ve al menos el 15% del elemento
    { threshold: 0.15 }
);

// Recorre cada elemento a animar
elementosReveal.forEach((el) => {
    // Le agrega la clase inicial (invisible y desplazado hacia abajo)
    el.classList.add("reveal");
    // Le pide al observador que lo vigile
    observerReveal.observe(el);
});

/* ==========================================================
   5. "Más información" de servicios → modal
   ========================================================== */

// Crea un elemento <dialog> (la ventana modal) en memoria
const modal = document.createElement("dialog");
// Le asigna la clase "modal" para que tome los estilos del CSS
modal.className = "modal";
// Escribe el HTML interno del modal: título, texto y dos botones
modal.innerHTML = `
    <h3 id="modalTitulo"></h3>
    <p id="modalTexto"></p>
    <div class="modal-acciones">
        <button type="button" id="modalContactar">Consultar</button>
        <button type="button" id="modalCerrar" class="btn-outline">Cerrar</button>
    </div>
`;
// Agrega el modal al final del <body> para que exista en la página
document.body.appendChild(modal);

// Guarda el título del modal para poder cambiarle el texto después
const modalTitulo = modal.querySelector("#modalTitulo");
// Guarda el párrafo del modal para poder cambiarle el texto después
const modalTexto = modal.querySelector("#modalTexto");

// Busca todos los botones que tengan el atributo data-servicio y recorre cada uno
document.querySelectorAll("button[data-servicio]").forEach((boton) => {
    // Cuando se hace click en ese botón, ejecuta la función
    boton.addEventListener("click", () => {
        // Busca en SERVICIOS el objeto que corresponde al data-servicio del botón
        const servicio = SERVICIOS[boton.dataset.servicio];
        // Si no existe ese servicio, corta la función para evitar errores
        if (!servicio) return;
        // Pone el título del servicio en el modal
        modalTitulo.textContent = servicio.titulo;
        // Pone el texto del servicio en el modal
        modalTexto.textContent = servicio.texto;
        // Muestra el modal en pantalla (bloquea el resto de la página)
        modal.showModal();
    });
});

// Al hacer click en "Cerrar", cierra el modal
modal.querySelector("#modalCerrar").addEventListener("click", () => modal.close());

// Al hacer click en "Consultar", ejecuta la función
modal.querySelector("#modalContactar").addEventListener("click", () => {
    // Cierra el modal
    modal.close();
    // Lleva suavemente hasta la sección del formulario
    document.querySelector("#SeccionContacto")?.scrollIntoView({ behavior: "smooth" });
});

// Escucha clicks sobre el modal completo (incluye el fondo oscuro)
modal.addEventListener("click", (e) => {
    // Si el click fue sobre el fondo y no sobre el contenido, cierra el modal
    if (e.target === modal) modal.close();
});

/* ==========================================================
   6. Formulario: validación, contador y envío
   ========================================================== */

// Guarda el formulario
const form = document.querySelector("#formContacto");
// Guarda el campo de nombre
const campoNombre = document.querySelector("#nombre");
// Guarda el campo de correo
const campoMail = document.querySelector("#mail");
// Guarda el textarea de la consulta
const campoConsulta = document.querySelector("#TuConsulta");
// Guarda el párrafo donde se muestran mensajes generales del formulario
const mensajeForm = document.querySelector("#formMensaje");
// Guarda el botón de enviar buscándolo dentro del formulario
const botonEnviar = form.querySelector("button[type='submit']");

// Crea un elemento <small> para el contador de caracteres
const contador = document.createElement("small");
// Le asigna la clase "contador" para darle estilo
contador.className = "contador";
// Lo inserta justo después del textarea
campoConsulta.after(contador);

// Función que actualiza el número del contador
function actualizarContador() {
    // Calcula cuántos caracteres hay escritos en la consulta
    const largo = campoConsulta.value.length;
    // Muestra el formato "escritos / máximo"
    contador.textContent = `${largo} / ${CONFIG.maxConsulta}`;
    // Activa la clase "excedido" (rojo) solo si se pasó del máximo
    contador.classList.toggle("excedido", largo > CONFIG.maxConsulta);
}
// Ejecuta la función una vez al cargar para mostrar "0 / 500"
actualizarContador();

// Función que revisa un campo y devuelve un texto de error (o "" si está bien)
function validarCampo(campo) {
    // Obtiene el valor del campo sin espacios al principio ni al final
    const valor = campo.value.trim();

    // Si el campo revisado es el nombre
    if (campo === campoNombre) {
        // Si tiene menos de 3 letras, devuelve el mensaje de error
        if (valor.length < 3) return "Ingresá tu nombre completo.";
    }
    // Si el campo revisado es el mail
    if (campo === campoMail) {
        // Expresión regular simple: algo + @ + algo + . + algo
        const patronMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Si el valor no cumple el patrón, devuelve el error
        if (!patronMail.test(valor)) return "Ingresá un correo válido.";
    }
    // Si el campo revisado es la consulta
    if (campo === campoConsulta) {
        // Si es más corta que el mínimo, devuelve el error con el número
        if (valor.length < CONFIG.minConsulta)
            return `La consulta debe tener al menos ${CONFIG.minConsulta} caracteres.`;
        // Si es más larga que el máximo, devuelve el error con el número
        if (valor.length > CONFIG.maxConsulta)
            return `Máximo ${CONFIG.maxConsulta} caracteres.`;
    }
    // Si no falló ninguna regla, devuelve texto vacío (= campo válido)
    return "";
}

// Función que muestra u oculta el mensaje de error de un campo
function mostrarError(campo, texto) {
    // Busca si ya existe un mensaje de error creado para este campo
    let error = campo.parentElement.querySelector(`[data-error-de="${campo.id}"]`);

    // Si no hay texto de error (el campo está bien)
    if (!texto) {
        // Le quita el borde rojo al campo
        campo.classList.remove("input-error");
        // Elimina el mensaje de error si existía
        error?.remove();
        // Termina la función
        return;
    }

    // Si hay error, pone el borde rojo al campo
    campo.classList.add("input-error");
    // Si todavía no existe el mensaje de error
    if (!error) {
        // Crea un párrafo nuevo para el mensaje
        error = document.createElement("p");
        // Le asigna la clase de estilo de error
        error.className = "mensaje-error";
        // Le guarda el id del campo, para encontrarlo después
        error.dataset.errorDe = campo.id;
        // Lo inserta después del contador (si es la consulta) o después del propio campo
        (campo === campoConsulta ? contador : campo).after(error);
    }
    // Escribe el texto del error en el párrafo
    error.textContent = texto;
}

// Función que muestra un mensaje general (éxito o error) debajo del formulario
function mostrarMensajeForm(texto, clase) {
    // Escribe el texto en el párrafo
    mensajeForm.textContent = texto;
    // Reemplaza las clases (quita "oculto" y pone la de éxito o error)
    mensajeForm.className = clase;
}

// Recorre los tres campos para activar la validación en vivo
[campoNombre, campoMail, campoConsulta].forEach((campo) => {
    // Cuando el usuario sale del campo, lo valida y muestra el error si corresponde
    campo.addEventListener("blur", () => mostrarError(campo, validarCampo(campo)));
    // Cada vez que el usuario escribe en el campo
    campo.addEventListener("input", () => {
        // Si el campo ya estaba marcado con error
        if (campo.classList.contains("input-error")) {
            // Lo revalida para que el error desaparezca apenas lo corrige
            mostrarError(campo, validarCampo(campo));
        }
    });
});

// Cada vez que se escribe en la consulta, actualiza el contador
campoConsulta.addEventListener("input", actualizarContador);

// Escucha el envío del formulario; async permite usar await adentro
form.addEventListener("submit", async (e) => {
    // Evita que el navegador recargue la página al enviar
    e.preventDefault();
    // Oculta cualquier mensaje general anterior
    mensajeForm.className = "oculto";

    // Junta los tres campos en una lista
    const campos = [campoNombre, campoMail, campoConsulta];
    // Variable para saber si hay algún error (empieza en falso)
    let hayErrores = false;

    // Recorre cada campo
    campos.forEach((campo) => {
        // Valida el campo y guarda el texto de error (o vacío)
        const error = validarCampo(campo);
        // Muestra u oculta el error en pantalla
        mostrarError(campo, error);
        // Si hubo error, marca que el formulario tiene errores
        if (error) hayErrores = true;
    });

    // Si hay errores
    if (hayErrores) {
        // Pone el cursor en el primer campo con error
        campos.find((c) => c.classList.contains("input-error"))?.focus();
        // Corta la función: no se envía nada
        return;
    }

    // Guarda el texto original del botón ("Enviar consulta")
    const textoOriginal = botonEnviar.textContent;
    // Deshabilita el botón para evitar envíos dobles
    botonEnviar.disabled = true;
    // Cambia el texto del botón para avisar que está enviando
    botonEnviar.textContent = "Enviando...";

    // Inicia un bloque donde se atrapan los errores de red
    try {
        // Si configuraste una URL de envío
        if (CONFIG.formEndpoint) {
            // Envía los datos por POST y espera la respuesta
            const respuesta = await fetch(CONFIG.formEndpoint, {
                // Método HTTP de envío
                method: "POST",
                // Cuerpo: todos los campos del formulario
                body: new FormData(form),
                // Pide que el servicio responda en formato JSON
                headers: { Accept: "application/json" },
            });
            // Si el servidor respondió con error, lanza una excepción
            if (!respuesta.ok) throw new Error("Respuesta no válida");
        // Si no configuraste URL
        } else {
            // Simula el envío esperando 0,8 segundos
            await new Promise((resolve) => setTimeout(resolve, 800));
        }

        // Vacía todos los campos del formulario
        form.reset();
        // Reinicia el contador a "0 / 500"
        actualizarContador();
        // Muestra el mensaje de éxito
        mostrarMensajeForm("¡Gracias! Recibimos tu consulta y te responderemos pronto.", "mensaje-ok");
    // Si algo falló dentro del try
    } catch (err) {
        // Muestra el mensaje de error general
        mostrarMensajeForm("No pudimos enviar tu consulta. Intentá de nuevo en unos minutos.", "mensaje-error");
    // Esto se ejecuta siempre, haya salido bien o mal
    } finally {
        // Vuelve a habilitar el botón
        botonEnviar.disabled = false;
        // Le devuelve su texto original
        botonEnviar.textContent = textoOriginal;
    }
});