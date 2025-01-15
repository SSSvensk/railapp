<template>
    <div style="margin: 4px;">
        <div v-if="!modifying">
            <div style="margin: 12px;">
                <journey-ends 
                    v-if="legs.length > 0"
                    :first-leg="legs[0]['start']"
                    :last-leg="legs[endIndex]['end']"
                />
            </div>

            <div style="margin: 14px;">
                <journey-over-view 
                    :legs="legs" 
                />
            </div>
        </div>
        
        <div style="width: 100%;">
            <div style="margin-left: 14px; margin-right: 14px; display: flex; flex-direction: row;">
                <div style="flex: 1">
                    <v-btn 
                        v-if="legs.length > 1"  
                        flat
                        :append-icon="showLegs ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                        @click="showLegs = !showLegs"
                    >
                        {{ legs.length - 1 + ' vaihtoa' }}
                    </v-btn>
                    <span v-else>
                        Suora
                    </span>
                </div>
                <!--<div v-if="modified" style="flex: 1">
                    <v-btn flat icon="mdi-undo" small />
                </div>
            -->
                <div style="display: flex; flex: 1; justify-content: flex-end;">
                    <span style="font-size: 22px; font-weight: bold;">
                        alk. {{ item.price }} €
                    </span>
                </div>
            </div>
        </div>
        <div v-if="showLegs">
            <div
                v-for="leg, legIndex in legs"
                :key="'leg-' + leg.id"
            >
                <journey-leg 
                    :end="endStop"
                    :next-leg-start="legIndex < legs.length - 1 ? legs[legIndex + 1].start.dateTimeInISO : undefined" 
                    :next-leg-city-transfer="legIndex < legs.length - 1 ? legs[legIndex + 1].type == 'STATION_CHANGE_PUBLIC_TRANSPORT': false" 
                    :leg="leg" 
                    @load-connection="$emit('loadConnection', $event)"
                    @modify-journey="modifyJourney($event, legIndex)"
                />
            </div>
        </div>
        <div style="margin: 14px;">
            <v-btn color="primary">
                Valitse
            </v-btn>
        </div>
    </div>
</template>

<script>
import connections from './composition/connections'
import JourneyEnds from './JourneyEnds.vue'
import JourneyLeg from './JourneyLeg.vue'
import JourneyOverView from './JourneyOverView.vue'

export default {
    components: {
        JourneyEnds,
        JourneyLeg,
        JourneyOverView
    },
    props: {
        filters: {
            default: () => ({}),
            type: Object
        },
        item: {
            default: () => ({}),
            type: Object
        }
    },
    emits: [
        'loadConnection',
        'modifyJourney'
    ],
    setup() {
        const { getConnections } = connections()
        return {
            getConnections
        }
    },
    data() {
        return {
            legs: [],
            modifying: false,
            modified: false,
            showLegs: false
        }
    },
    computed: {
        endIndex() {
            return this.legs.length - 1
        },
        endStop() {
            return this.legs[this.legs.length - 1].end.id
        }
    },
    created() {
        this.legs = JSON.parse(JSON.stringify(this.item.legs))
    },
    methods: {
        getModifiedJourneyLegs(index, start, end, departure) {
            this.legs.splice(index)

            this.getConnections(start, end, departure + '.000Z', 1, this.filters).then(r => {
                if (r.length > 0) {
                    this.legs = this.legs.concat(r[0].legs)
                }
                this.showLegs = true
                this.modifying = false
            })
        },
        modifyJourney(data, index) {
            this.showLegs = false
            this.modifying = true
            this.modified = true

            if (!data.manipulateJourney) {
                this.getModifiedJourneyLegs(index, data.start, data.end, data.departure)
            } else {

                const oldTime = new Date(this.legs[index]['start'].dateTimeInISO)
                let nextDay = false
                if (oldTime.getHours() > data.arrival.hours || (oldTime.getHours() == data.arrival.hours && oldTime.getMinutes() > data.arrival.minutes)) {
                    nextDay = true
                }

                const timeString = (data.arrival.hours < 10 ? '0' + data.arrival.hours : data.arrival.hours) + ':' + (data.arrival.minutes < 10 ? '0' + data.arrival.minutes : data.arrival.minutes)

                /*if (nextDay) {
                    newTime = new Date(oldTime.getTime() + (1000 * 60 * 60 * 24))
                } else {*/
                const newTime = this.legs[index]['start'].dateTimeInISO.split('T')[0] + 'T' + timeString + ':00'
                //}
                
                this.legs[index]['end'] = {
                    country: data.startCountry,
                    dateTimeInISO: newTime,
                    geocoordinates: data.geocoordinates,
                    id: data.start,
                    station: data.startName,
                    time: data.arrival
                }

                let tmp = []

                for (let i = 0; i < this.legs[index]['stops'].length; i++) {
                    if (this.legs[index]['stops'][i].station == data.startName) {
                        break
                    }

                    tmp.push(this.legs[index]['stops'][i])
                }

                this.legs[index]['stops'] = tmp

                this.getModifiedJourneyLegs(index + 1, data.start, data.end, data.departure)
            }
        }
    }
}
</script>