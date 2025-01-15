<template>
    <div style="display: flex; justify-content: center; align-items: flex-start;">
        <div v-if="type == 'TRAIN_TRAVEL'">
            <div style="display: flex; justify-content: center;">
                <v-icon :icon="transport == 'Ship' ? 'mdi-ferry' : 'mdi-train'" />
            </div>
            <div
                v-if="transport != 'Ship'"
                style="display: flex; justify-content: center;"
            >
                {{ code }}
            </div>
            <div style="display: flex; justify-content: center; margin-top: 4px;">
                <img
                    v-if="companyLogoForLeg"
                    :src="companyLogoForLeg"
                    width="20"
                >
            </div>
        </div>
        <div v-else-if="type == 'PLATFORM_CHANGE'">
            <v-icon icon="mdi-transit-transfer" />
        </div>
        <div v-else-if="type == 'STATION_CHANGE_PUBLIC_TRANSPORT'">
            <v-icon icon="mdi-city-switch" />
        </div>
    </div>
</template>

<script>
import dblogo from '@/assets/companylogos/db.png'
import dsblogo from '@/assets/companylogos/dsb.png'
import sjlogo from '@/assets/companylogos/sj.png'
import skaneLogo from '@/assets/companylogos/skane.png'
import vikinglinelogo from '@/assets/companylogos/vikingline.png'
import vrlogo from '@/assets/companylogos/vr.png'


export default {
    name: 'JourneyMeta',
    props: {
        code: {
            default: '',
            type: String
        },
        serviceProvider: {
            default: undefined,
            type: [String, Number]
        },
        transport: {
            default: '',
            type: String
        },
        type: {
            default: 'TRAIN_TRAVEL',
            validator: (v) => {
                return ['PLATFORM_CHANGE', 'STATION_CHANGE_PUBLIC_TRANSPORT', 'TRAIN_TRAVEL'].includes(v)
            },
            type: String
        }
    },
    computed: {
        companyLogoForLeg() {
            if (this.serviceProvider) {
                if (['2480', '2580', '3594'].includes(this.serviceProvider)) {
                    return dblogo
                } else if (['1186'].includes(this.serviceProvider)) {
                    return dsblogo
                } else if (['1174'].includes(this.serviceProvider)) {
                    return sjlogo
                } else if (['3029'].includes(this.serviceProvider)) {
                    return vikinglinelogo
                } else if (['0010'].includes(this.serviceProvider)) {
                    return vrlogo
                }  else if (['3126'].includes(this.serviceProvider)) {
                    return skaneLogo
                }
            }
            return undefined
        }
    }
}
</script>