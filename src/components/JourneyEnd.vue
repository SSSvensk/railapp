<template>
    <div style="position: relative; display: flex; flex-direction: row; align-items: flex-start;">
        <div 
            class="end-connector" 
            v-bind:style="{
                'height': start ? '100%' : '50%',
                'top': start ? '20px' : '0%'
            }"
        /> 
        <div class="end-marker" />
        <div style="width: 100%; margin-left: 8px;">
            <station-item 
                :datetime="type != 'STATION_CHANGE_PUBLIC_TRANSPORT' ? datetime : ''" 
                :end="end"
                :legStartTime="datetime"
                :name="name" 
                :options="options && start"
                :time="time"
                @selectAlternativeDeparture="$emit('selectAlternativeDeparture', $event)"
            />
        </div>
    </div>
</template>

<script>
import StationItem from './StationItem.vue'
export default {
    name: 'JourneyEnd',
    props: {
        datetime: String,
        end: [Number, String],
        name: String,
        options: {
            default: true,
            type: Boolean
        },
        start: {
            default: false,
            type: Boolean
        },
        stopsFollowing: {
            default: false,
            type: Boolean
        },
        time: Object,
        type: String
    },
    emits: ['selectAlternativeDeparture'],
    components: {
        StationItem 
    }
}
</script>
<style scoped>
.end-connector {
    background-color: var(--color-text);
    /*height: 100%;*/
    left: 6px;
    position: absolute;
    top: 50%;
    width: 2px;
    z-index: 1;
}
.end-marker {
    background-color: var(--color-background-soft);
    border: 2px solid var(--color-text);
    border-radius: 50%; 
    height: 15px;
    top: 5px;
    left: 0px;
    width: 15px;
    z-index: 2;     
}
</style>