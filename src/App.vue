<template>
  <v8-menu-top />
  <div class="container-fluid">
    <router-view/>
  </div>
</template>

<script>
export default {
  methods: {
    recortarCadena(cadena) {
        // Verifica si la longitud de la cadena es mayor a 10 caracteres
        if (cadena.length > 10) {
            // Obtiene los primeros 5 caracteres y los últimos 5 caracteres
            const inicio = cadena.slice(0, 5);
            const fin = cadena.slice(-5);
            // Devuelve la cadena recortada con "..."
            return `${inicio}...${fin}`;
        }
    },
  }
}
</script>