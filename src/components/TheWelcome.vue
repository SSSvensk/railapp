

<template>
    <div>
        <div>
            <journey-filters @startLoading="startLoading" />
        </div>
    </div>
</template>
<script>
import FromToInput from "./inputs/FromToInput.vue"
import JourneyFilters from './JourneyFilters.vue'
import connections from "./composition/connections.js"
export default {
    components: { 
        FromToInput,
        JourneyFilters
    },
    setup() {
        const { getConnections } = connections()
        return {
            getConnections
        }
    },
    methods: {
        formatISOString(v = new Date()) {
            let manualISOString = v.getFullYear()
            manualISOString += '-'
            manualISOString += v.getMonth() + 1 < 10 ? '0' + (v.getMonth() + 1) : (v.getMonth() + 1)
            manualISOString += '-'
            manualISOString += (v.getDate() < 10 ? '0' + v.getDate() : v.getDate())  + 'T'
            manualISOString += v.getHours() < 10 ? '0' + v.getHours() : v.getHours()
            manualISOString += ':'
            manualISOString += v.getMinutes() < 10 ? '0' + v.getMinutes() : v.getMinutes()
            manualISOString += ':00.000Z'
            console.log(manualISOString)
            return manualISOString
        },
        startLoading(v) {
            this.$router.push({
                name: 'planner', 
                query: {
                    endName: v.endName.trim(),
                    endTime: v.endTime,
                    option: v.option,
                    startName: v.startName.trim(), 
                    startTime: v.startTime,
                    departure: v.departure.toISOString()
                }
            })
        }
    }
}
</script>
