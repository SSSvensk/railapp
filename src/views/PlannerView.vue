<template>
    <header>
        <div>
            <journey-filters 
                :defaultData="$route.query" 
                @startLoading="startLoading" 
            />

            <div>
                Tähän varoitukset!
            </div>
        </div>
    </header>

    <div style="height: 100%;">
        <journey-loader v-if="loading" />

        <div v-else>
            Tulokset
            <journey-card 
                v-for="(item, journeyIndex) in journeys" 
                v-bind:key="'journey-' + journeyIndex" 
                :filters="filters"
                :item="item"
            />
        </div>
    </div>
</template>
<script>
import FromToInput from "../components/inputs/FromToInput.vue"
import JourneyFilters from '../components/JourneyFilters.vue'
import connections from "../components/composition/connections.js"
import JourneyLoader from '../components/JourneyLoader.vue'
import JourneyCard from '../components/JourneyCard.vue'
export default {
    components: { 
        FromToInput,
        JourneyCard,
        JourneyLoader,
        JourneyFilters
    },
    setup() {
        const { getConnections, loadSimpleConnection } = connections()
        return {
            getConnections,
            loadSimpleConnection
        }
    },
    data() {
        return {
            autoLoad: false,
            filters: {},
            journeys: [],
            loading: false
        }
    },
    created() {
        if (this.$route.query && Object.keys(this.$route.query).length > 0) {
            if (this.$route.query.start && this.$route.query.end) {
                this.autoLoad = true
            }
        }
    },
    methods: {
        getISOStringFromDateWithTimezone(v = new Date()) {
            let manualISOString = v.getFullYear()
            manualISOString += '-'
            manualISOString += v.getMonth() + 1 < 10 ? '0' + (v.getMonth() + 1) : (v.getMonth() + 1)
            manualISOString += '-'
            manualISOString += (v.getDate() < 10 ? '0' + v.getDate() : v.getDate())  + 'T'
            manualISOString += v.getHours() < 10 ? '0' + v.getHours() : v.getHours()
            manualISOString += ':'
            manualISOString += v.getMinutes() < 10 ? '0' + v.getMinutes() : v.getMinutes()
            manualISOString += ':00.000Z'

            return manualISOString
        },
        startLoading(v) {
            let dep = v.departure
            if (typeof v.departure != 'string') {
                dep = this.getISOStringFromDateWithTimezone(v.departure)
            } 
            console.log(v)
            this.filters = v
            this.loading = true
            this.getConnections(v.start, v.end, dep, 1, v).then(r => {
                console.log(r)
                this.journeys = r
            })
            .catch(e => {
                console.log(e)
            })
            .finally(() => {
                this.loading = false
            })
        }
    }
}
</script>
