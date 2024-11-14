<template>
    <div style="width: 100%;">
        <div style="position: relative; display: flex; flex-direction: row; align-items: center;" @click="showStops = !showStops">
            <div class="line" /> 
            <v-icon :icon="showStops ? 'mdi-chevron-up' : 'mdi-chevron-down'" style="margin-left: 24px;" />
            <div style="font-size: 14px; margin-left: 4px;">
                {{ showStops ? 'Piilota' : 'Näytä' }} välipysähdykset
            </div>  
        </div>
        <div v-show="showStops" style="width: 100%;">
            <div 
                v-for="stop, stopIndex in stops" 
                v-bind:key="'stop-' + stopIndex"
                style="position: relative; display: flex; flex-direction: row; align-items: center; width: 100%;"
            >
                <div class="extended-line" /> 
                <div class="midstop" />
                <div style="font-size: 14px; margin-left: 28px; width: 100%;">
                    <station-item 
                        :coordinates="stop.geocoordinates"
                        :end="end"
                        :legStartTime="legStartTime"
                        :name="stop.station" 
                        options
                        :time="stop.time" 
                        @loadConnection="$emit('loadConnection', $event)"
                        @selectAlternativeDeparture="$emit('selectAlternativeDeparture', $event)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import StationItem from './StationItem.vue'
import StationName from './StationName.vue'
export default {
    name: 'LegStops',
    props: {
        end: {
            required: true,
            type: [Number, String]
        },
        legStartTime: {
            required: true,
            type: String
        },
        stops: Array
    },
    emits: [
        'selectAlternativeDeparture'
    ],
    components: { 
        StationName,
        StationItem 
    },
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