<template>
    <div style="width: 100%;">
        <div
            style="position: relative; display: flex; flex-direction: row; align-items: center;"
            @click="showStops = !showStops"
        >
            <div class="line" /> 
            <v-icon
                :icon="showStops ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                style="margin-left: 24px;"
            />
            <div style="font-size: 14px; margin-left: 4px;">
                {{ showStops ? 'Piilota' : 'Näytä' }} välipysähdykset
            </div>  
        </div>
        <div
            v-show="showStops"
            style="width: 100%;"
        >
            <div 
                v-for="stop, stopIndex in stops" 
                :key="'stop-' + stopIndex"
                style="position: relative; display: flex; flex-direction: row; align-items: center; width: 100%;"
            >
                <div class="extended-line" /> 
                <div class="midstop" />
                <div style="font-size: 14px; margin-left: 28px; width: 100%;">
                    <station-item 
                        :coordinates="stop.geocoordinates"
                        :end="end"
                        :leg-start-time="legStartTime"
                        :name="stop.station" 
                        options
                        :time="stop.time" 
                        @load-connection="$emit('loadConnection', $event)"
                        @select-alternative-departure="$emit('selectAlternativeDeparture', $event)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import StationItem from './StationItem.vue'
export default {
    name: 'LegStops',
    components: { 
        StationItem 
    },
    props: {
        end: {
            required: true,
            type: [Number, String]
        },
        legStartTime: {
            required: true,
            type: String
        },
        stops: {
            default: () => [],
            type: Array
        }
    },
    emits: [
        'loadConnection',
        'selectAlternativeDeparture'
    ],
    data() {
        return {
            showStops: false
        }
    }
}
</script>
<style scoped>
.extended-line {
    position: absolute; 
    left: 6px; 
    background-color: var(--color-text); 
    width: 2px; 
    height: 100%;
}
.line {
    position: absolute; 
    left: 6px; 
    width: 0px; 
    height: 100%;
}
.midstop {
    position: absolute; 
    left: 3.4px; 
    width: 8px; 
    height: 8px; 
    border-radius: 50%; 
    border: 2px solid var(--color-text); 
    background-color: var(--color-background-soft);
}
</style>