<script setup lang="ts">
import englishWordsWith5Letters from '@/englishWordsWith5Letters.json';
import { DEFEAT_MESSAGE, VICTORY_MESSAGE } from '@/settings';
import { computed, ref } from 'vue';

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => englishWordsWith5Letters.includes(wordGiven)
  }
});

const guessInProgress = ref('');
const guessSubmitted = ref('');

const formattedGuessInProgress = computed({
  get: () => guessInProgress.value,
  set: (newValue: string) => guessInProgress.value = newValue.slice(0, 5)
});
</script>

<template>
  <input type="text" v-model="formattedGuessInProgress" @keydown.enter="guessSubmitted = guessInProgress" />
  <p v-if="guessSubmitted.length > 0" v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"></p>
</template>
