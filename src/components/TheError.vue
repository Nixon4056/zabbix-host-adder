<template>
  <div class="errorContainer">
    <h1>{{ error }}</h1>
  </div>
</template>

<script>
export default {
  props: ['error']
}
</script>

<style scoped>
.errorContainer{
  position: absolute;
  top: 0;
  right: 0;
  margin: 1rem;
  border-radius: 10px;
  background-color: rgb(190, 54, 54);
  color: white;
}
</style>