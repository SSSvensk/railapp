<template>
    <div>
        <div @click="toggleOptions">
            <span v-if="datetime">
                {{ datetime ? new Date(datetime).toLocaleTimeString('fi-FI', { hour: "2-digit", minute: "2-digit" }) : '' }}
            </span>
            <span v-else-if="time">
                {{ timeString }}
            </span>

            <station-name :name="name" />
        </div>
        <div
            v-if="options"
            v-show="showOptions"
        >
            <div style="height: 70px;">
                <v-row>
                    <v-col :xs="6">
                        <v-btn 
                            :append-icon="laterConnections ? 'mdi-chevron-up' : 'mdi-chevron-down'" 
                            flat 
                            @click="toggleOptionalJourneys"
                        >
                            {{ laterConnections ? 'Piilota' : 'Seuraavat' }}
                        </v-btn>
                    </v-col>
                    <v-col :xs="6">
                        <div>
                            <vue-date-picker v-model="when" />
                        </div>
                    </v-col>
                </v-row>
            </div>
            <div v-show="laterConnections">
                <table>
                    <tr
                        v-for="opt, index in optionalJourneys"
                        :key="index"
                        @click="selectNextDeparture(opt)"
                    >
                        <td style="width: 72px;">
                            klo {{ new Date(opt.departure).toLocaleTimeString('fi-FI', {hour: '2-digit', minute:'2-digit'}) }}
                        </td>
                        <td>
                            <station-name :name="opt.legs[0].end.station" />
                        </td>
                        <td>
                            <span v-if="opt.departure.split('T')[0] != legStartDate">
                                <v-icon
                                    icon="mdi-alert"
                                    size="x-small"
                                />
                                {{ new Date(opt.departure).toLocaleDateString('fi-FI') }}
                            </span>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import StationName from './StationName.vue';
import connections from "./composition/connections.js"
import locations from "./composition/locations.js"
export default {
    name: 'StationItem',
    components: {
        StationName
    },
    props: {
        coordinates: {
            default: () => ({}),
            required: false,
            type: Object
        },
        datetime: {
            default: undefined,
            type: String
        },
        end: {
            default: undefined,
            type: [Number, String]
        },
        name: {
            default: '',
            type: String
        },
        options: {
            default: true,
            type: Boolean
        },
        legStartTime: {
            default: '',
            type: String
        },
        time: {
            default: () => ({}),
            type: Object
        }
    },
    emits: [
        'selectAlternativeDeparture'
    ],
    setup() {
        const { loadSimpleConnection } = connections()
        const { getLocations } = locations()
        return {
            loadSimpleConnection,
            getLocations
        }
    },
    data() {
        return {
            laterConnections: false,
            optionalJourneys: [],
            showOptions: false,
            when: ''
        }
    },
    computed: {
        legStartDate() {
            return this.legStartTime.split('T')[0]
        },
        nextTimeDeparture() {
            const hours = Number(this.timeString.split(':')[0])
            const minutes = Number(this.timeString.split(':')[1])

            let newMinutes = minutes + 10
            if (minutes >= 50) {
                newMinutes = minutes - 50
            }

            if (newMinutes < 10) {
                newMinutes = '0' + newMinutes
            }

            let newHours = hours

            if (hours == 23) {
                newHours = 0
            }

            if (newHours < 10) {
                newHours = '0' + newHours
            }

            return this.legStartTime.split('T')[0] + 'T' + newHours + ':' + newMinutes + ':00.000Z'
        },
        timeString() {
            if (this.time) {
                const hours = this.time ? this.time.hours > 9 ? this.time.hours : '0' + this.time.hours : '00'
                const minutes = this.time ? this.time.minutes > 9 ? this.time.minutes : '0' + this.time.minutes : '00'

                return hours + ':' + minutes
            }
            return 'nn:nn'
        }
    },
    watch: {
        when(v) {
            console.log(v)
            let manualISOString = v.getFullYear()
            manualISOString += '-'
            manualISOString += v.getMonth() + 1 < 10 ? '0' + (v.getMonth() + 1) : (v.getMonth() + 1)
            manualISOString += '-'
            manualISOString += (v.getDate() < 10 ? '0' + v.getDate() : v.getDate())  + 'T'
            manualISOString += v.getHours() < 10 ? '0' + v.getHours() : v.getHours()
            manualISOString += ':'
            manualISOString += v.getMinutes() < 10 ? '0' + v.getMinutes() : v.getMinutes()
            manualISOString += ':00.000Z'
            this.laterConnections = true
            this.loadLaterConnections(manualISOString)
        }
    },
    methods: {
        loadLaterConnections(d) {
            console.log(d)
            this.getLocations(this.name).then(r => {
                console.log(r)
                if (r.length > 0 && this.end) {
                    const dep = d ? d : this.nextTimeDeparture
                    this.loadSimpleConnection(r[0].id, this.end, dep, 6).then(connections => {
                        console.log(connections)
                        this.optionalJourneys = connections.filter((value, index, self) => {
                            return self.findIndex(v => v.departure === value.departure) === index;
                        })
                    })
                }
            }) 
        },
        selectNextDeparture(v) {            
            this.showOptions = false
            this.laterConnections = false
            this.$emit('selectAlternativeDeparture', {
                departure: v.departure,
                end: v.legs[v.legs.length - 1].end.id,
                geocoordinates: this.coordinates,
                start: v.legs[0].start.id,
                startCountry: v.legs[0].start.country,
                startName: this.name,
                arrival: this.time
            })
        },
        toggleOptionalJourneys() {
            if (this.laterConnections) {
                this.laterConnections = false
            } else {
                this.loadLaterConnections()
                this.laterConnections = true
            }
        },
        toggleOptions() {
            if (this.options) {
                this.showOptions = !this.showOptions
            }
        }
    }
}
</script>