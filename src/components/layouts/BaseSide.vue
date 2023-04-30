<template>
    <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            @open="handleOpen"
            @close="handleClose"
    >
        <el-menu-item h="full" @click="toggleDark()">
            <button
                    class="border-none w-full bg-transparent cursor-pointer"
                    style="height: var(--ep-menu-item-height)"
            >
                <i inline-flex i="dark:ep-moon ep-sunny"/>
            </button>
        </el-menu-item>
    </el-menu>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {
    Location,
    Document,
    Menu as IconMenu,
    Setting,
} from "@element-plus/icons-vue";
import {toggleDark} from "~/composables";

const isCollapse = ref(true);
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath);
};
</script>
