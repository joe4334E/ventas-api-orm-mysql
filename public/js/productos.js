// El navegador hablando con la API: pide, y pinta lo que le llega.

const estado = document.querySelector('#estado');
const tabla = document.querySelector('#tabla-productos');
const filas = document.querySelector('#filas');
const totalValor = document.querySelector('#total-valor');
const totalUnidades = document.querySelector('#total-unidades');
const formulario = document.querySelector('#formulario');
const botonEnviar = document.querySelector('#boton-enviar');
const botonCancelar = document.querySelector('#boton-cancelar');
const tituloFormulario = document.querySelector('#titulo-formulario');

// El id del producto que se está editando, o null si el formulario está en
// modo crear. Un solo formulario para las dos cosas: el estado del formulario
// es una variable, no dos formularios distintos.
let editando = null;

// El euro necesita dos decimales siempre, y un separador de miles que en
// español es un punto: 1.234,56 € y no 1,234.56 €.
// 'es-ES' es el código de idioma y formato. Intl es del navegador.
const euros = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
});

function crearFila(producto) {
  const tr = document.createElement('tr');

  // Se repite cuatro veces lo mismo, así que un bucle sobre los nombres de
  // las columnas. Las celdas nuevas son siempre td; los encabezados de la
  // tabla, th.
  for (const valor of [producto.id, producto.nombre, euros.format(producto.precio), producto.stock]) {
    const celda = document.createElement('td');
    // textContent, NUNCA innerHTML: innerHTML interpreta lo que le pases
    // como HTML. Si un producto se llamara <img onerror=...>, con
    // innerHTML se ejecutaría. Con textContent se muestra tal cual.
    celda.textContent = valor;
    tr.appendChild(celda);
  }

  // Sin stock, la fila se marca para que se vea de un vistazo.
  if (producto.stock === 0) {
    tr.classList.add('sin-stock');
  }

  // La quinta celda: los dos botones. Se crean como elementos, con su
  // texto en textContent y su id en dataset, nunca con innerHTML.
  const acciones = document.createElement('td');
  acciones.className = 'acciones-fila';

  const editar = document.createElement('button');
  editar.type = 'button';
  editar.textContent = 'Editar';
  editar.dataset.editar = producto.id;
  editar.addEventListener('click', () => empezarEdicion(producto));

  const borrar = document.createElement('button');
  borrar.type = 'button';
  borrar.textContent = 'Borrar';
  borrar.dataset.borrar = producto.id;
  borrar.addEventListener('click', () => borrarProducto(producto));

  acciones.append(editar, borrar);
  tr.appendChild(acciones);

  return tr;
}

function pintar(productos) {
  // Vaciar antes de rellenar: si se llama dos veces, no se duplican filas.
  filas.replaceChildren();

  let suma = 0;
  let unidades = 0;

  for (const producto of productos) {
    filas.appendChild(crearFila(producto));
    suma += Number(producto.precio) * Number(producto.stock);
    unidades += Number(producto.stock);
  }

  totalValor.textContent = euros.format(suma);
  totalUnidades.textContent = unidades;

  tabla.hidden = false;
  estado.textContent = `${productos.length} productos`;
}

async function cargarProductos() {
  try {
    const response = await fetch('/api/productos');

    // response.ok es true solo para 200-299. Un 404 también es una
    // respuesta válida, así que hay que comprobarlo antes de usarla.
    if (!response.ok) {
      throw new Error(`El servidor respondió ${response.status}`);
    }

    pintar(await response.json());
  } catch (error) {
    estado.textContent = 'No se pudo cargar el catálogo';
    console.error(error);
  }
}

async function guardarProducto(evento) {
  // Sin esto, el navegador recarga la página entera y se pierde el trabajo.
  evento.preventDefault();

  // Los campos de un formulario SIEMPRE llegan como texto, y un texto se
  // comporta distinto que un número: '10' + 1 da '101', y '0' === 0 es false.
  // La tabla ya compara con === 0, así que un stock enviado como texto
  // llegaría como "0" y la fila no se marcaría como agotada. Convertir aquí
  // es que lo que se envía y lo que se recibe sean siempre del mismo tipo.
  const datos = {
    nombre: formulario.nombre.value,
    precio: Number(formulario.precio.value),
    stock: Number(formulario.stock.value),
  };

  // El mismo botón, el mismo formulario y el mismo cuerpo JSON. Lo único que
  // cambia es la dirección y el método: POST /api/productos para crear,
  // PUT /api/productos/<id> para actualizar.
  const url = editando === null ? '/api/productos' : `/api/productos/${editando}`;
  const metodo = editando === null ? 'POST' : 'PUT';

  botonEnviar.disabled = true;
  try {
    const response = await fetch(url, {
      method: metodo,
      // Sin este header, express.json() no toca el cuerpo y llegaría vacío.
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      // La API responde los errores anidados: { error: { message } }. El
      // mensaje viene del modelo y explica qué está mal, no solo el código.
      const cuerpo = await response.json();
      throw new Error(cuerpo.error.message);
    }

    const mensaje = editando === null ? `«${datos.nombre}» añadido` : `«${datos.nombre}» actualizado`;

    salirDeEdicion();
    await cargarProductos();
    estado.textContent = mensaje;
  } catch (error) {
    estado.textContent = error.message;
  } finally {
    botonEnviar.disabled = false;
  }
}

function empezarEdicion(producto) {
  editando = producto.id;

  // Rellenar el formulario con los valores de la fila.
  formulario.nombre.value = producto.nombre;
  formulario.precio.value = producto.precio;
  formulario.stock.value = producto.stock;

  // Y cambiar lo que dice, para que se vea en qué modo está.
  tituloFormulario.textContent = `Editando #${producto.id}`;
  botonEnviar.textContent = 'Guardar cambios';
  botonCancelar.hidden = false;

  estado.textContent = `Editando «${producto.nombre}». Pulsa «Cancelar» para volver a crear.`;
  formulario.nombre.focus();
}

function salirDeEdicion() {
  editando = null;
  formulario.reset();
  tituloFormulario.textContent = 'Añadir producto';
  botonEnviar.textContent = 'Añadir';
  botonCancelar.hidden = true;
}

async function borrarProducto(producto) {
  // Borrar no tiene vuelta atrás, así que se pregunta. Un confirm() del
  // navegador vale aquí: es un tutorial y no hay nada que deshacer.
  const acepta = window.confirm(`¿Borrar «${producto.nombre}»?`);
  if (!acepta) return;

  try {
    const response = await fetch(`/api/productos/${producto.id}`, { method: 'DELETE' });

    if (!response.ok) {
      const cuerpo = await response.json();
      throw new Error(cuerpo.error.message);
    }

    // Si la fila que se estaba editando es justo la que se borra, el
    // formulario se queda editando un producto que ya no existe.
    if (editando === producto.id) {
      salirDeEdicion();
    }

    await cargarProductos();
    estado.textContent = `«${producto.nombre}» borrado`;
  } catch (error) {
    estado.textContent = error.message;
  }
}

formulario.addEventListener('submit', guardarProducto);
botonCancelar.addEventListener('click', salirDeEdicion);

cargarProductos();
