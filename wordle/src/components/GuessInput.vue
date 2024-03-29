<script lang="ts">
const { default: validWords } = await import(`../${LANGUAGE}WordsWith${WORD_LENGTH}Letters.json`);
</script>

<script setup lang="ts">
import GuessView from '@/components/GuessView.vue';
import { LANGUAGE, WORD_LENGTH } from '@/settings';
import { ref } from 'vue';

const emit = defineEmits<{
  'guess-submitted': [guess: string],
}>();

const guessInProgress = ref('');
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

  emit('guess-submitted', guessInProgress.value);
  guessInProgress.value = '';
};
</script>

<template>
  <guess-view :guess="guessInProgress" />
  <input id="guessInput" type="text" :value="guessInProgress" @keydown.enter="handleSubmit" @input="formatInput"
    :maxlength="WORD_LENGTH" autofocus @blur="({ target }) => (target as HTMLInputElement).focus()" />
</template>

<style scoped>
input {
  position: absolute;
  opacity: 0;
}
</style>