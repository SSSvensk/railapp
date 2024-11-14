<template>
    <v-autocomplete
        v-model="vModel"
        v-model:search="search"
        :label="title"
        :hide-no-data="search && !loading"
        item-title="station"
        :items="items"
        return-object
        @click="items = []"
    />
</template>

<script>
import axios from 'axios'
import locations from '../composition/locations'
export default {
    name: 'FromToInput',
    props: {
        country: {
            default: '',
            type: String
        },
        modelValue: String,
        name: {
            required: false,
            type: String
        },
        title: {
            placeholder: 'Asema',
            type: String
        }
    },
    emits: ['updateName'],
    setup() {
        const { getLocations } = locations()
        return {
            getLocations
        }
    },
    data() {
        return {
            initialized: true,
            items: [],
            loading: false,
            search: '',
            vModel: ''
        }
    },
    watch: {
        search(v) {
            if (v && v.length > 2 && this.initialized) {
                this.loadSuggestions(v, this.country)
            }
            this.initialized = true
        },
        vModel(v) {
            this.$emit('update:modelValue', v ? v.id : undefined)
            this.$emit('updateName', v.station)
        }
    },
    created() {
        if (this.name) {
            this.initialized = false
            this.loadLocations(this.name, this.country).then(r => {
                if (r.length > 0) {
                    this.vModel = r[0]
                    this.search = r[0].station
                }
            })
        }
    },
    methods: {
        formatStopName(str = '') {
            const delimiter = ' ';
            const spl = str.split(delimiter);
            let a = ''
            for (let i = 0; i < spl.length; i++) {
                a = a + delimiter + spl[i][0].toUpperCase() + '' + spl[i].slice(1, spl[i].length).toLowerCase()
            }

            return a
        },
        loadLocations(v = '', country) {
            return new Promise((resolve) => {
                this.getLocations(v, country).then(r => {
                    resolve(r)
                })
                .catch(() => {
                    resolve([])
                })
            })
        },
        loadSuggestions(v, country) {
            this.items = []
            this.loading = true
            this.loadLocations(v, country).then(r => {
                this.items = r
            })
            .finally(() => {
                this.loading = false
            })
        }
    }
}
</script>