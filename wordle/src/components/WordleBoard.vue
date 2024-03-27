<script lang="ts">
const { default: validWords } = await import(`../${LANGUAGE}WordsWith${WORD_LENGTH}Letters.json`);
</script>

<script setup lang="ts">
import GuessInput from '@/components/GuessInput.vue';
import { DEFEAT_MESSAGE, LANGUAGE, VICTORY_MESSAGE, WORD_LENGTH } from '@/settings';
import { ref } from 'vue';

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => validWords.includes(wordGiven)
  }
});

const guessSubmitted = ref('');
</script>

<template>
  <guess-input @guess-submitted="guess => guessSubmitted = guess" />
  <p v-if="guessSubmitted.length > 0" v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"></p>
</template>
