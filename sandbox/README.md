# sandbox

Scripts de prueba que se ejecutan por separado de la API:

```bash
node sandbox/leer.js
```

Aquí se juega. Cuando algo funcione, el código que interesa se copia a
`src/` en forma ordenada, y lo que hay en esta carpeta se puede borrar sin
que se rompa nada.

Los scripts de esta carpeta **no** se usan en la versión final. Sirven para
ver de cerca cómo se habla con MySQL antes de envolverlo en la API.
