<template>
  <embed :src="src" type="application/pdf" width="100%" height="100%" />
  <!-- <iframe :src="src" type="application/pdf" width="100%" height="100%" /> -->
  <!-- <object :src="src" type="application/pdf" width="100%" height="100%" /> -->
</template>

<script setup lang="ts">
  defineProps<{
    src: string;
  }>();
</script>

<style lang="scss"></style>
