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
