// El navegador hablando con la API: pide, y pinta lo que le llega.

const estado = document.querySelector('#estado');
const tabla = document.querySelector('#tabla-productos');
const filas = document.querySelector('#filas');
const totalValor = document.querySelector('#total-valor');
const totalUnidades = document.querySelector('#total-unidades');

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

cargarProductos();
