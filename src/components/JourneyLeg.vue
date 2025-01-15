<template>
    <div>
        <div 
            v-if="leg.type == 'TRAIN_TRAVEL'"
            style="display: flex; flex-direction: row; align-items: center; margin: 16px 0;"
        >
            <div style="width: 70px;">
                <journey-meta 
                    :code="leg.transport ? leg.transport.code : ''"
                    :service-provider="leg.transport.operatorCode"
                    :transport="leg.transport ? leg.transport.type : ''"
                    :type="leg.type"
                />
            </div>
                    
            <div style="width: 100%; margin-left: 8px;">
                <journey-end 
                    :datetime="leg.start.dateTimeInISO" 
                    :end="end"
                    :name="leg.start.station" 
                    start 
                    :stops-following="leg.stops.length > 0"
                    :time="leg.start.time"
                    :type="leg.type" 
                    @select-alternative-departure="modifyJourney($event, false)"
                />
            
                <leg-stops 
                    v-if="leg.stops.length > 0" 
                    :end="end"
                    :leg-start-time="leg.start.dateTimeInISO"
                    :stops="leg.stops" 
                    @load-connection="$emit('loadConnection', {date: leg.start.dateTimeInISO, ...$event})"
                    @select-alternative-departure="modifyJourney($event, true)"
                />

                <journey-end 
                    :datetime="leg.end.dateTimeInISO" 
                    :name="leg.end.station" 
                    :type="leg.type" 
                />
            </div>
        </div>
        <div>
            <waiting-time 
                v-if="nextLegStart && !nextLegCityTransfer" 
                :journey-end="journeyEnd"
                :next-leg-city-transfer="nextLegCityTransfer"
                :next-leg-start="nextLegStart"
                :visible="leg.type != 'STATION_CHANGE_PUBLIC_TRANSPORT'"
            >
                <div v-if="leg.type == 'STATION_CHANGE_PUBLIC_TRANSPORT'">
                    <div style="display: flex; flex-direction: row;">
                        <div>
                            <v-icon icon="mdi-information" />
                        </div>
                        <div style="margin-left: 10px;">
                            Vaihda terminaalia kaupungin sisällä.
                        </div>
                    </div>
                
                    <div style="display: flex; flex-direction: row; align-items: center; margin: 16px 0;">
                        <div style="width: 70px; ">
                            <journey-meta 
                                :code="leg.transport ? leg.transport.code : ''"
                                :transport="leg.transport ? leg.transport.type : ''"
                                :type="leg.type"
                            />
                        </div>
                
                        <div style="margin-left: 8px;">
                            <journey-end
                                :datetime="leg.start.dateTimeInISO"
                                :name="leg.start.station"
                                :options="false"
                                start
                                :type="leg.type"
                            />
                            <journey-end
                                :datetime="leg.end.dateTimeInISO"
                                :name="leg.end.station"
                                :options="false"
                                :type="leg.type"
                            />
                        </div>
                    </div>
                </div>
            </waiting-time>
        </div>
    </div>
</template>
<script>
import JourneyEnd from './JourneyEnd.vue'
import JourneyMeta from './JourneyMeta.vue'
import LegStops from './LegStops.vue'
import WaitingTime from './WaitingTime.vue'
export default {
    name: 'JourneyLeg',
    components: { 
        LegStops,
        JourneyMeta,
        WaitingTime,
        JourneyEnd
    },
    props: {
        end: {
            default: undefined,
            required: true,
            type: [Number, String]
        },
        nextLegCityTransfer: Boolean,
        nextLegStart: {
            default: undefined,
            type: String
        },
        leg: {
            default: () => ({}),
            type: Object
        }
    },
    emits: [
        'loadConnection',
        'modifyJourney'
    ],
    data() {
        return {
            allowedLegTypes: ['STATION_CHANGE_PUBLIC_TRANSPORT', 'TRAIN_TRAVEL']
        }
    },
    computed: {
        journeyEnd() {
            return this.leg.end.dateTimeInISO
        },
        journeyStart() {
            return this.leg.start.dateTimeInISO
        }
    },
    methods: {
        modifyJourney(data, manipulateJourney = false) {
            this.$emit('modifyJourney', {...data, manipulateJourney})
        }
    }
}
</script>