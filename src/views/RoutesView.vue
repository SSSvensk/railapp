<template>
    <div>
        <RouterLink to="/route">
            <WelcomeItem @click="navigateToRoute">
                <template #heading>
                    Tukholma - Kööpenhamina - Hampuri
                </template>
                <div>
                    Jatko: Koko Eurooppa
                </div>
                <div>
                    Hintataso €
                </div>
                <div>
                    Kulkuneuvot €
                </div>
                <div>
                    Yhteyksien klassikko. Raiteet vievät Ruotsin ja Tanskan läpi Hampuriin, josta lukuisia vaihtoyhteyksiä eri puolille Eurooppaa.
                </div>
            </WelcomeItem>
        </RouterLink>
        <WelcomeItem>
            <template #heading>
                Tukholma - Göteborg - Kiel
            </template>
            <div>
                Jatko: Koko Eurooppa
            </div>
            <div>
                Hintataso €
            </div>
            <div>
                Kulkuneuvot Juna, laiva
            </div>
            <div>
                Arvostat rauhallisuutta, etkä halua istua koko päivää paikallasi? Pyrähdä ensin kolmessa tunnissa Göteborgiin. Sieltä pääset laivaan, jossa nukut yön rennosti laivan viedessä nukkuessasi Pohjois-Saksaan. Pääset kätevästi jatkoyhteyksien ääreen läheltä Hampurissa.
            </div>
        </WelcomeItem>
    </div>
</template>

<script>
import WelcomeItem from '../components/WelcomeItem.vue';
import { RouterLink } from 'vue-router';
export default {
    name: 'RouteView',
    components: {
        WelcomeItem
    }
}
</script>