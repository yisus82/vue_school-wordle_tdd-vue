<script setup lang="ts">
import { WORD_LENGTH } from '@/settings';

defineProps<{ guess: string; }>();
</script>

<template>
  <ul class="word">
    <li v-for="(letter, index) in guess.padEnd(WORD_LENGTH, ' ')" :key="`${letter}-${index}`" :data-letter="letter"
      class="letter" v-text="letter"></li>
  </ul>
</template>

<style scoped>
ul {
  margin: 0;
  padding: 0;
}

.word {
  display: flex;
  list-style-type: none;
  padding: 0;
  gap: 0.25rem;
}

.letter {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  height: 5rem;
  font-size: 2rem;
  font-weight: bolder;
  border: 1px solid hsl(0, 0%, 70%);
  background-color: white;
}

@keyframes pop {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.4);
  }
}

li:not([data-letter=" "]) {
  animation: pop 100ms;
}
</style>