<template>
    <div class="container">
        <div>
            <div class="container">
                <v-progress-circular
                    indeterminate
                    color="primary"
                />
            </div>
            <div>
                {{ text }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'JourneyLoader',
    props: {
        text: {
            default: 'Pieni hetki. Toiveitasi vastaavaa yhteyttä ladataan.',
            type: String
        }
    }
}
</script>
<style scoped>
.container {
    display: flex;
    justify-content: center;
}
</style>