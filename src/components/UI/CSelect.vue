<template>
    <el-select v-model="value" filterable :placeholder="placeholder" :label="label"
               @change="$emit('update:modelValue', $event)">
        <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
        />
    </el-select>
</template>

<script lang="ts">
import {PropType, toRefs} from "vue";
import {Options} from "~/types/Optons";

export default {
    name: "CSelect",
    props: {
        label: String,
        placeholder: String,
        options: {
            type: Array as PropType<Options>,
        },
        modelValue: String,
    },

    data() {
        return {
            value: this.modelValue
        }
    },
}
</script>
