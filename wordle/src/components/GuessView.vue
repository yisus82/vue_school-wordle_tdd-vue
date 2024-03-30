<script setup lang="ts">
import { WORD_LENGTH } from '@/settings';
import { LetterFeedback } from '@/types';

const props = defineProps<{ guess: string; answer?: string; }>();

const getFeedback = (position: number): null | LetterFeedback => {
  if (!props.answer) {
    return null;
  }

  const letter = props.guess[position];

  return letter === props.answer[position] ?
    LetterFeedback.CORRECT : props.answer.includes(letter) ?
      LetterFeedback.ALMOST : LetterFeedback.INCORRECT;
};
</script>

<template>
  <ul class="word">
    <li v-for="(letter, index) in guess.padEnd(WORD_LENGTH, ' ')" :key="`${letter}-${index}`" :data-letter="letter"
      :data-letter-feedback="getFeedback(index)" class="letter" v-text="letter" :class="{
      flip: answer,
      correct: getFeedback(index) === LetterFeedback.CORRECT,
      almost: getFeedback(index) === LetterFeedback.ALMOST,
      incorrect: getFeedback(index) === LetterFeedback.INCORRECT
    }">
    </li>
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

.correct {
  --back-color: hsl(120, 25%, 65%);
}

.almost {
  --back-color: hsl(40, 25%, 65%);
}

.incorrect {
  --back-color: hsl(0, 25%, 65%);
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