<template>
    <div class="journey-overview">
        <div 
            v-for="legP, index in legPortions" 
            v-bind:key="'legv-' + index"
            class="leg-section"
            v-bind:style="{
                'width': legP + '%'
            }"
        >
            {{ legs[index].transport ? legs[index].transport.code : '' }}
        </div>  
    </div>
</template>

<script>
export default {
    name: 'JourneyOverview',
    props: {
        legs: {
            default: () => [],
            required: true,
            type: Array
        }
    },
    computed: {
        legPortions() {
            const sum = this.legs.reduce((a, b) => { return a + (b.duration.hours * 60) + b.duration.minutes}, 0)
            let tmp = []
            for (let i = 0; i < this.legs.length; i++) {
                tmp.push(this.countToMinutes(this.legs[i].duration) / sum * 100)
            }
            return tmp
        }
    },
    methods: {
        countToMinutes(obj = { hours: 0, minutes: 0}) {
            return (obj.hours) * 60 + obj.minutes
        }
    }
}
</script>

<style scoped>
.journey-overview {
    width: 100%; 
    height: 40px; 
    display: flex; 
    flex-direction: row;
}
.leg-section {
    align-items: center;
    border: 1px solid gray;
    border-radius: 4px;
    display: flex;
    margin: 0 1px;
    overflow: hidden;
    white-space: nowrap;
}
</style>