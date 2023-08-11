<template>
  <ElConfigProvider namespace="ep">
    <BaseHeader/>
    <div style="display: flex">
      <BaseSide/>
      <!--            <Main w="full"/>-->
      <RouterView w="full"/>
    </div>
  </ElConfigProvider>
</template>

<script lang="ts" setup>
import BaseHeader from './components/layouts/BaseHeader.vue'
import BaseSide from './components/layouts/BaseSide.vue'
import Main from './views/Main.vue'
</script>

<style>
#app {
  color: var(--ep-text-color-primary);
}
</style>
