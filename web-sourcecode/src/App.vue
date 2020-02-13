<template>
  <div id="app">
    <SumaClient/>
  </div>
</template>

<script>
import SumaClient from './components/SumaClient.vue'

export default {
  name: 'app',
  components: {
    SumaClient
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
