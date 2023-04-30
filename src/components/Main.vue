<template>
    <div class="content">

    </div>
</template>

<script lang="ts">
import {ref} from "vue";
import {ElMessage} from "element-plus";

export default {
    setup() {

        const toast = () => {
            ElMessage.success("Hello");
        };
    }
}
</script>

<style>
.ep-button {
    margin: 4px;
}

.ep-button + .ep-button {
    margin-left: 0;
    margin: 4px;
}

.content {
    height: calc(100vh - var(--header-height) - 1px);
    overflow-scrolling: auto;
}
</style>

