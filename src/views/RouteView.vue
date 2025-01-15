<template>
    <header>
        <div class="wrapper">
            <div>
                <hello-world msg="Tukholma - Kööpenhamina - Hampuri" />
            </div>

            <nav>
                <div>
                    Peruslippu
                </div>
                <div>
                    Interrail
                </div>
            </nav>

            <div>
                <welcome-item>
                    <template #heading>
                        Turku
                    </template>
                    Juna saapuu Turun satamaan
                </welcome-item>
                <welcome-item>
                    <template #heading>
                        Turku - Tukholma
                    </template>
                </welcome-item>
                <welcome-item>
                    <template #heading>
                        Tukholma
                    </template>
                </welcome-item>
                <welcome-item>
                    <template #heading>
                        Tukholma - Kööpenhamina
                    </template>
                </welcome-item>
                <welcome-item>
                    <template #heading>
                        Kööpenhamina
                    </template>
                </welcome-item>
                <welcome-item>
                    <template #heading>
                        Kööpenhamina - Hampuri
                    </template>
                </welcome-item>
                <welcome-item>
                    <template #heading>
                        Hampuri
                    </template>
                </welcome-item>
            </div>
        </div>
    </header>
</template>
<script>
import WelcomeItem from '../components/WelcomeItem.vue';
import { RouterLink } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
export default {
    components: {
        HelloWorld,
        WelcomeItem
    },
    data() {
        return {
            selected: 0
        }
    }
}
</script>

<style scoped>
header {
    line-height: 1.5;
    max-height: 100vh;
}

nav {
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
}

nav div {
    color: var(--color-text);
}

nav div {
    background-color: transparent;
}

nav div {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav div:first-of-type {
    border: 0;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        place-items: center;
        flex-wrap: wrap;
    }

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;
        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
