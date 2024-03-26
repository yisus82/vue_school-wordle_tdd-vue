<script lang="ts">
const { default: validWords } = await import(`../${LANGUAGE}WordsWith${WORD_LENGTH}Letters.json`);
</script>

<script setup lang="ts">
import { DEFEAT_MESSAGE, LANGUAGE, VICTORY_MESSAGE, WORD_LENGTH } from '@/settings';
import { ref } from 'vue';

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => validWords.includes(wordGiven)
  }
});

const guessInProgress = ref('');
const guessSubmitted = ref('');
const lastCharWasAccent = ref(false);

const formatInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const lastChar = target.value.slice(-1);
  if (lastChar === '´' || lastChar === '`' || lastChar === '^' || lastChar === '¨' || lastChar === '~' || lastChar === 'ˆ' || lastChar === '˜' || lastChar === '˚' || lastChar === '˙' || lastChar === '˝' || lastChar === '¸' || lastChar === '˛' || lastChar === 'ˇ') {
    if (lastCharWasAccent.value) {
      if (target.value.length === WORD_LENGTH) {
        target.value = target.value.slice(0, -1);
        lastCharWasAccent.value = false;
        return;
      }
      target.value = target.value.slice(0, -1) + lastChar;
    }
    lastCharWasAccent.value = true;
    return;
  } else {
    lastCharWasAccent.value = false;
  }
  guessInProgress.value = target.value.replace(/[^\p{Letter}]/gu, '').slice(0, WORD_LENGTH).toUpperCase();
  target.value = guessInProgress.value;
};

const handleSubmit = () => {
  if (!validWords.includes(guessInProgress.value)) {
    return;
  }

  guessSubmitted.value = guessInProgress.value;
};
</script>

<template>
  <input id="guessInput" type="text" :value="guessInProgress" @keydown.enter="handleSubmit" @input="formatInput"
    :maxlength="WORD_LENGTH" />
  <p v-if="guessSubmitted.length > 0" v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE"></p>
</template>
