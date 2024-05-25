<script setup lang="ts">
import { Transition } from 'vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView v-slot="{ Component }">
    <main>
      <Transition name="scale" mode="out-in">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </Transition>
    </main>
  </RouterView>
</template>

<style lang="scss" scoped>
@use '~/styles/transition' as transition;
@include transition.scale;

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
