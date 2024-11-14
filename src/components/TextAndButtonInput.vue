<template>
    <v-row>
        <v-btn 
            style="top: 25px;"
            density="compact" 
            variant="plain" 
            icon="mdi-minus" 
            @click="updateValue(-step)" 
        />
        <v-col>
            <v-text-field v-model="v" />
        </v-col>
        <v-btn 
            style="top: 25px;"
            density="compact" 
            variant="plain"  
            icon="mdi-plus" 
            @click="updateValue(step)" 
        />
    </v-row>
</template>

<script>
export default {
    name: 'TextAndButtonInput',
    props: {
        modelValue: {
            default: '0',
            type: [Number, String]
        },
        step: {
            default: 1,
            type: Number
        }
    },
    data() {
        return {
            v: '0'
        }
    },
    watch: {
        v(v) {
            console.log(v)
            this.$emit('update:modelValue', v)
        }
    },
    methods: {
        updateValue(diff = 1) {
            console.log(diff)
            this.v = Number(this.v) + diff
        }
    }
}
</script>