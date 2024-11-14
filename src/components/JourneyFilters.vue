<template>
    <v-col>
        <from-to-input 
            v-model="models.start" 
            country="Finland" 
            :name="defaultData.startName"
            title="Lähtö Suomessa" 
            @updateName="updateName('startName', $event)"
        />

        <from-to-input
            v-if="vias.length > 0"
            v-model="models.via"
            label="Kautta"
        />

        <v-btn append-icon="mdi-plus" @click="addViaStop">
            {{ vias.length > 0 ? 'Poista välipysähdys' : 'Lisää välipysähdys' }}
        </v-btn>

        <from-to-input 
            v-model="models.end" 
            label="Määränpää" 
            :name="defaultData.endName"
            @updateName="updateName('endName', $event)"
        />
        <v-row>
            <v-col>
                <vue-date-picker v-model="models.departure" />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-row>
                    <v-container fluid>
                        <v-row style="align-items: flex-start;">
                            <v-col v-if="models.option != 3">
                                <span>Alkaa</span>
                                <vue-date-picker 
                                    v-model="models.startTime" 
                                    :time-picker="true"
                                />
                            </v-col>
                            <v-col v-if="models.option != 3">
                                <span>Loppuu</span>
                                <vue-date-picker 
                                    v-model="models.endTime" 
                                    :time-picker="true"
                                />
                            </v-col>
                            <v-col style="width: 100px;">
                                <text-and-button-input 
                                    v-model="models.transfer" 
                                    :step="10"
                                />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-radio-group v-model="models.option">
                                <v-radio 
                                    v-for="opt, index in nightOptions" 
                                    v-bind:key="'index-' + index" 
                                    :label="opt.label" 
                                    :value="opt.value"
                                ></v-radio>
                            </v-radio-group>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-btn color="primary" @click="startSearching">
                                    Löydä matkasi
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-row>
            </v-col>
        </v-row>
    </v-col>
</template>

<script>
import TextAndButtonInput from './TextAndButtonInput.vue'
import FromToInput from "./inputs/FromToInput.vue"

export default {
    name: 'JourneyFilters',
    props: {
        defaultData: {
            default: () => ({}),
            type: Object
        }
    },
    emits: ['startLoading'],
    components: { 
        FromToInput,
        TextAndButtonInput 
    },
    data() {
        return {
            departing: '',
            firstRender: true,
            models: {
                departure: new Date(),
                end: '',
                endName: '',
                endTime: '22:00',
                option: '2',
                start: '',
                startName: '',
                startTime: '06:00',
                transfer: 0,
                via: ''
            },
            nightOptions: [
                {label: 'Ei rajoituksia. Matkantekoa 24/7!!', value: '3'},
                {label: 'Max 1 yhteys joka kestää koko ulkopuolisen aikavälin', value: '2'},
                {label: 'Ei matkantekoa ajan ulkopuolella', value: '1'},
            ],
            vias: []
        }
    },
    computed: {
        defaultDataGiven() {
            return Object.keys(this.defaultData).length > 0
        },
    },
    watch: {
        models: {
            handler(v) {
                if (v.start && v.end && this.defaultDataGiven && this.firstRender) {
                    let obj = JSON.parse(JSON.stringify(v))
                    this.$emit('startLoading', obj)
                    this.firstRender = false
                }
            },
            deep: true
        }
    },
    created() {
        console.log('created!')
        if (this.defaultData.departure) {
            let obj = {...this.models, ...this.defaultData}
            obj['departure'] = new Date(this.defaultData['departure'])
            this.models = obj
        } else {
            this.models = {...this.models, ...this.defaultData}
        }
    },
    methods: {
        addViaStop() {
            if (this.vias.length > 0) {
                this.vias = []
                this.models.via = ''
            } else {
                this.vias.push('')
            }
        },
        
        startSearching() {
            if (this.models.start && this.models.end) {
                console.log(this.models)
                this.$emit('startLoading', this.models)
            }
        },
        updateName(attr, v) {
            if (attr) {
                this.models[attr] = v
            }
        }
    }
}
</script>