// El navegador hablando con la API. Hasta ahora la API solo se veía con
// curl; desde aquí se ve en una página.

const estado = document.querySelector('#estado');
const salida = document.querySelector('#salida');

async function cargarProductos() {
  try {
    // response.ok es true para 200-299. Un 404 también es una respuesta
    // válida: por eso se comprueba antes de usar los datos.
    const response = await fetch('/api/productos');

    if (!response.ok) {
      throw new Error(`El servidor respondió ${response.status}`);
    }

    const productos = await response.json();

    estado.textContent = `${productos.length} productos`;

    // Provisional: se enseña el JSON en crudo. La tabla viene en el
    // siguiente to-do.
    salida.textContent = JSON.stringify(productos, null, 2);
  } catch (error) {
    estado.textContent = 'No se pudo cargar el catálogo';
    console.error(error);
  }
}

cargarProductos();
