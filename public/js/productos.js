// El navegador hablando con la API: pide, y pinta lo que le llega.

const estado = document.querySelector('#estado');
const tabla = document.querySelector('#tabla-productos');
const filas = document.querySelector('#filas');
const totalValor = document.querySelector('#total-valor');
const totalUnidades = document.querySelector('#total-unidades');
const formulario = document.querySelector('#formulario');
const botonEnviar = document.querySelector('#boton-enviar');

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

async function crearProducto(evento) {
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

  botonEnviar.disabled = true;
  try {
    const response = await fetch('/api/productos', {
      method: 'POST',
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

    formulario.reset();
    await cargarProductos();
    estado.textContent = `«${datos.nombre}» añadido`;
  } catch (error) {
    estado.textContent = error.message;
  } finally {
    botonEnviar.disabled = false;
  }
}

formulario.addEventListener('submit', crearProducto);

cargarProductos();
