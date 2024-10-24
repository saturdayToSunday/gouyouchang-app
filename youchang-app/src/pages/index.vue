<template>
    <div class="application-box">
        <component :is="name"></component>
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
    const route = useRoute();
    const name = computed(function(){
        return route.meta.layout || 'blank-layout';
    })

</script>