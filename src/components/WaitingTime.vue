<template>
    <div style="position: relative; width: 100%; padding: 0 8px;">
        <div v-if="visible" style="position: relative; width: 100%; text-align: center; display: flex; justify-content: center;">
            <div style="z-index: -2; position: absolute; top: 50%; z-index: 0; width: 100%; border: none; border-top: 1px dashed gray;" />
            <div style="width: max-content; position: relative; z-index: 1; padding: 0 8px;">
                <span style="background-color: gray;">Vaihto {{ transferHours }} h {{ transferMinutes }} min</span>
            </div>
        </div>
        <div class="info">
            <slot name="default"></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: 'WaitingTime',
    props: {
        journeyEnd: String,
        nextLegCityTransfer: Boolean,
        nextLegStart: String,
        visible: {
            default: true,
            type: Boolean
        }
    },
    computed: {
        isOverNight() {
            if (new Date(this.journeyEnd)) {
                return 'aa'
            }
            return 'nbb'
        },
        transferDays() {
            return 0
        },
        transferDuration() {
            return new Date(this.nextLegStart).getTime() - new Date(this.journeyEnd).getTime()
        },
        transferHours() {
            return parseInt(this.transferDuration / 1000 / 60 / 60)
        },
        transferMinutes() {
            return (this.transferDuration / 1000 / 60) - (this.transferHours * 60)
        }
    }
}
</script>
<style scoped>

.background {
    background-color: rgb(242, 242, 242, 0.1);
}
.info {
    background-color: rgb(242, 242, 242, 0.1);
    width: 100%; 
    padding: 8px; 
    position: relative; 
    top: 0%; 
    border-top: 1px dashed gray;
    border-bottom: 1px dashed gray; 
    border-left: 1px dashed gray;
    border-right: 1px dashed gray;
}
.info:empty {
    display: none;
}
</style>