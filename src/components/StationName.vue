<template>
    <span>{{ formattedName }}</span>
</template>

<script>
export default {
    name: 'StationName',
    props: {
        name: {
            default: '',
            type: String
        }
    },
    computed: {
        formattedName() {
            const spl = this.name.split(' ')
            let a = ''
            for (let i = 0; i < spl.length; i++) {
                a = a + ' ' + spl[i][0].toUpperCase() + '' + spl[i].slice(1, spl[i].length).toLowerCase()
            }

            return a
        }
    }
}
</script>