<script lang="ts">
const wordsImportFile = `@/${LANGUAGE}WordsWith${WORD_LENGTH}Letters.json`;
const { default: validWords } = await import(wordsImportFile);
</script>

<script setup lang="ts">
import { DEFEAT_MESSAGE, LANGUAGE, VICTORY_MESSAGE, WORD_LENGTH } from '@/settings';
import { computed, ref } from 'vue';

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => validWords.includes(wordGiven)
  }
});

const guessInProgress = ref('');
const guessSubmitted = ref('');

const formattedGuessInProgress = computed({
  get: () => guessInProgress.value,
  set: (newValue: string) => guessInProgress.value = newValue.slice(0, WORD_LENGTH)
});

const handleSubmit = () => {
  if (!validWords.includes(guessInProgress.value)) {
    return;
  }

  guessSubmitted.value = guessInProgress.value;
};
</script>

<template>
  <input type="text" v-model="formattedGuessInProgress" @keydown.enter="handleSubmit" :maxlength="WORD_LENGTH" />
  <p v-if="guessSubmitted.length > 0" v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"></p>
</template>
