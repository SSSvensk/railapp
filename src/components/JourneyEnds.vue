<template>
    <table>
        <tr
            v-for="terminus, index in termini"
            :key="'index-' + index + '-' + terminus.attribute"
        >
            <td>
                {{ terminus.text }}
            </td>
            <td>
                <station-name 
                    :name="terminus['leg'].station" 
                />
            </td>
            <td>
                {{ new Date(terminus['leg'].dateTimeInISO).toLocaleDateString('fi-FI') }},
            </td>
            <td>
                klo {{ new Date(terminus['leg'].dateTimeInISO).toLocaleTimeString('fi-FI', { hour: "2-digit", minute: "2-digit" }) }} 
            </td>
        </tr>
    </table>
</template>
<script>
import StationName from './StationName.vue'
export default {
    name: 'JourneyEnds',
    components: {
        StationName
    },
    props: {
        firstLeg: {
            default: () => ({}),
            type: Object
        },
        lastLeg: {
            default: () => ({}),
            type: Object
        }
    },
    computed: {
        termini() {
            return [
                {leg: this.firstLeg, text: 'Lähtö'},
                {leg: this.lastLeg, text: 'Saapuminen'}
            ]
        }
    }
}
</script>