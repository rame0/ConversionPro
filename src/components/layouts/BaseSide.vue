<template>
  <el-menu :router="true" :default-active="$route.path">
    <el-menu-item index="/">
      <el-icon>
        <House/>
      </el-icon>
    </el-menu-item>
    <el-menu-item index="/price-monitor">
      <el-icon>
        <TrendCharts/>
      </el-icon>
    </el-menu-item>
    <el-menu-item @click="toggleDark()" m-t="10">
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
  House,
  TrendCharts,
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
