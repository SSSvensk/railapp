<template>
    <RouterView />
</template>
<script setup>
import { RouterView } from 'vue-router'
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>
