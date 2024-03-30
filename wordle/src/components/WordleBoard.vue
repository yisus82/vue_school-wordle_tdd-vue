<script lang="ts">
const { default: validWords } = await import(`../${LANGUAGE}WordsWith${WORD_LENGTH}Letters.json`);
</script>

<script setup lang="ts">
import GuessInput from '@/components/GuessInput.vue';
import GuessView from '@/components/GuessView.vue';
import { DEFEAT_MESSAGE, LANGUAGE, MAX_GUESSES, VICTORY_MESSAGE, WORD_LENGTH } from '@/settings';
import { computed, ref } from 'vue';

const props = defineProps({
  wordOfTheDay: {
    type: String,
    required: true,
    validator: (wordGiven: string) => validWords.includes(wordGiven)
  }
});

const guessesSubmitted = ref<string[]>([]);

const isGameOver = computed(() =>
  guessesSubmitted.value.includes(props.wordOfTheDay)
  || guessesSubmitted.value.length === MAX_GUESSES);

const remainingGuesses = computed(() => {
  const remainingGuesses = MAX_GUESSES - guessesSubmitted.value.length;
  return isGameOver.value ? remainingGuesses : remainingGuesses - 1;
});
</script>

<template>
  <main>
    <ul>
      <li v-for="(guess, index) in guessesSubmitted" :key="`${index}-${guess}`">
        <guess-view :guess="guess" :answer="wordOfTheDay" />
      </li>
      <li v-if="!isGameOver">
        <guess-input @guess-submitted="guess => guessesSubmitted.push(guess)" :guessesSubmitted="guessesSubmitted" />
      </li>
      <li v-for="index in remainingGuesses" :key="`empty-${index}`">
        <guess-view :guess="''" />
      </li>
    </ul>
    <p class="end-of-game-message" v-if="isGameOver"
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

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  margin-bottom: 0.25rem;
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