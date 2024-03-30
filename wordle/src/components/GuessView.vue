<script setup lang="ts">
import { WORD_LENGTH } from '@/settings';

withDefaults(defineProps<{ guess: string; shouldFlip?: boolean; }>(), { shouldFlip: false });
</script>

<template>
  <ul class="word">
    <li v-for="(letter, index) in guess.padEnd(WORD_LENGTH, ' ')" :key="`${letter}-${index}`" :data-letter="letter"
      :data-letter-feedback="shouldFlip ? 'unknown' : null" class="letter" v-text="letter"
      :class="{ flip: shouldFlip }"></li>
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
  --front-color: hsl(0, 0%, 100%);
  --back-color: hsl(0, 0%, 70%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  height: 5rem;
  font-size: 2rem;
  font-weight: bolder;
  border: 1px solid var(--back-color);
  background-color: var(--front-color);
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

@keyframes flip-card {
  0% {
    transform: rotateY(0);
    background-color: var(--front-color);
  }

  50% {
    transform: rotateY(-90deg);
    background-color: var(--back-color);
  }

  100% {
    transform: rotateY(0);
    background-color: var(--back-color);
  }
}

li.flip {
  animation: flip-card 300ms forwards;
}
</style>