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
    required: true,
    validator: (wordGiven: string) => validWords.includes(wordGiven)
  }
});

const guessesSubmitted = ref<string[]>([]);
</script>

<template>
  <main>
    <guess-input @guess-submitted="guess => guessesSubmitted.push(guess)" />
    <p class="end-of-game-message"
      v-if="guessesSubmitted.includes(wordOfTheDay) || guessesSubmitted.length === WORD_LENGTH + 1"
      v-text="guessesSubmitted.includes(wordOfTheDay) ? VICTORY_MESSAGE : DEFEAT_MESSAGE">
    </p>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
}

@keyframes end-of-game-message-animation {
  0% {
    opacity: 0;
    transform: rotateZ(0);
  }

  100% {
    opacity: 1;
    transform: translateY(2rem);
  }
}

.end-of-game-message {
  font-size: 3rem;
  text-align: center;
  white-space: nowrap;
  animation: end-of-game-message-animation 700ms forwards;
}
</style>