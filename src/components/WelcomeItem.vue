<template>
    <div class="item">
        <div class="details">
            <h3>
                <slot name="heading" />
            </h3>
            <slot />
        </div>
    </div>
</template>

<style scoped>
.item {
    margin-top: 2rem;
    display: flex;
}

.details {
    flex: 1;
}

h3 {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 0.4rem;
    color: var(--color-heading);
}

@media (min-width: 1024px) {
    .item {
        margin-top: 0;
    }
}
</style>
