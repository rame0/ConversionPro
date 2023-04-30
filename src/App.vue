<template>
    <ElConfigProvider namespace="ep">
        <BaseHeader/>
        <div style="display: flex">
            <BaseSide/>
            <Main w="full"/>
        </div>
    </ElConfigProvider>
</template>

<script lang="ts" setup>
import BaseHeader from './components/layouts/BaseHeader.vue'
import BaseSide from './components/layouts/BaseSide.vue'
import Main from './components/Main.vue'
</script>

<style>
#app {
    text-align: center;
    color: var(--ep-text-color-primary);
}
</style>
