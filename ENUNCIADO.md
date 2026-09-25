# Enunciado del taller

## El problema

Una tienda vende productos y necesita un catálogo. Hoy esa información vive en
hojas de cálculo: una persona la edita a mano, nadie más puede verla, y cada
vez que alguien consulta el precio hay que preguntarle.

Se necesita un **programa que cualquiera pueda consultar** para ver los
productos, sus precios y cuántas unidades quedan.

## Qué pide el cliente

Un cliente, que lleva su negocio y no es programador, dice esto:

> Quiero una dirección web a la que ir para ver mis productos. Que me diga el
> nombre, el precio y cuántas unidades quedan. Y si vendo uno, que baje el
> número. Si me equivoco al escribir el precio, quiero poder corregirlo.

## Las reglas del negocio

1. Un producto tiene **nombre**, **precio** y **stock**. Los tres son obligatorios.
2. El nombre no puede estar vacío ni medir menos de 2 caracteres.
3. El precio y el stock no pueden ser negativos.
4. El precio se guarda con dos decimales: `89.90`, no `89.9`.
5. Cuando se consulta un producto que no existe, hay que decirlo con claridad:
   un **404**, no un error de MySQL.
6. Cuando se intenta crear un producto con datos inválidos, hay que decirlo con
   claridad: un **400** con un mensaje que diga cuál es el campo culpable.

## Lo que este taller NO incluye

Está fuera de alcance, a propósito, para que quepa en 120 minutos: autenticación,
paginación, filtros, pruebas automatizadas y despliegue.

---

# El contrato

Este es el **único** acuerdo que de verdad importa: si la API cumple esto, el
cliente no necesita saber nada más. Ni Express, ni MySQL, ni qué archivos hay.

Un contrato así se puede cambiar por dentro sin romper a nadie. Por eso se
escribe antes de escribir código.

## Los cinco peticiones

| Verbo | Dirección | Qué hace | Respuesta |
|---|---|---|---|
| `GET` | `/api/productos` | Lista todos | `200` + array |
| `GET` | `/api/productos/3` | Uno por su id | `200` + objeto, o `404` |
| `POST` | `/api/productos` | Crea uno | `201` + el objeto creado |
| `PUT` | `/api/productos/3` | Lo actualiza | `200` + el objeto ya cambiado |
| `DELETE` | `/api/productos/3` | Lo borra | `204` y nada más |

## La forma de un producto

```json
{
  "id": 1,
  "nombre": "Teclado mecánico",
  "precio": 89.9,
  "stock": 12
}
```

`id` lo pone la base de datos, no el cliente. `precio` es un número: por eso el
cliente ve `89.9` aunque debajo se guarde como `89.90`.

## Un error, también con forma

```json
{
  "error": {
    "message": "El nombre debe tener entre 2 y 120 caracteres"
  }
}
```

El mismo formato para todos los errores, para que el cliente siempre sepa dónde
mirar.

## La promesa

```bash
curl localhost:3000/api/productos
```

devuelve estos diez productos, en este orden:

```json
[
  { "id": 1, "nombre": "Teclado mecánico", "precio": 89.9, "stock": 12 },
  { "id": 2, "nombre": "Mouse inalámbrico", "precio": 34.5, "stock": 20 }
]
```

…y hay diez más. Esa es toda la lista. Si al final del taller esa orden de
comando devuelve esos diez productos, el taller está terminado.
