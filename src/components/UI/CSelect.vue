<template>
    <el-select v-model="value" :multiple="multiple" filterable :placeholder="placeholder" :label="label"
    @change="$emit('update:modelValue', $event)">
        <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
        />
    </el-select>
</template>

<script>
export default {
    name: "CSelect",
    props: {
        label: String,
        placeholder: String,
        options: Array,
        modelValue: String | Array,
        multiple: {
            type: Boolean,
            default: false
        },
    },

    data() {
        return {
            value: this.modelValue
        }
    },
}
</script>
