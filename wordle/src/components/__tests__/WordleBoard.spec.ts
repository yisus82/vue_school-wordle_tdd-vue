import WordleBoard from '@/components/WordleBoard.vue'
import { DEFEAT_MESSAGE, LANGUAGE, VICTORY_MESSAGE, WORD_LENGTH } from '@/settings'
import { mount } from '@vue/test-utils'

describe('WordleBoard', () => {
  const wordOfTheDay = 'TESTS'
  let wrapper: ReturnType<typeof mount>

  const playerSubmitsGuess = async (guessWord: string) => {
    const guessInput = wrapper.find('input[type="text"]')
    await guessInput.setValue(guessWord)
    await guessInput.trigger('keydown.enter')
  }

  const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay } })
  })

  describe('End of game messages', () => {
    test('a victory message appears when the user makes a guess that matches the word of the day', async () => {
      await playerSubmitsGuess(wordOfTheDay)

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test('a defeat message appears when the user makes a guess that does not match the word of the day', async () => {
      await playerSubmitsGuess('WRONG')

      expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
    })

    test('no message appears when the user has not yet made a guess', async () => {
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })
  })

  describe('Rules for defining the word of the day', () => {
    beforeEach(() => {
      console.warn = vi.fn()
    })

    test.each([
      { wordOfTheDay: 'LESS', reason: `having less than ${WORD_LENGTH} characters` },
      { wordOfTheDay: 'LONGER', reason: `having more than ${WORD_LENGTH} characters` },
      { wordOfTheDay: 'lower', reason: 'not being in uppercase' },
      {
        wordOfTheDay: 'QWERT',
        reason: `not being a real word in ${capitalize(LANGUAGE)}`
      }
    ])('if $wordOfTheDay is provided, a warning is emitted for $reason', ({ wordOfTheDay }) => {
      mount(WordleBoard, { props: { wordOfTheDay } })

      expect(console.warn).toHaveBeenCalled()
    })

    test(`no warning is emitted if the word of the day is a real uppercase word in ${capitalize(LANGUAGE)} with ${WORD_LENGTH} characters`, () => {
      mount(WordleBoard, { props: { wordOfTheDay: 'TESTS' } })

      expect(console.warn).not.toHaveBeenCalled()
    })
  })

  describe('Player guesses', () => {
    test(`player guesses are limited to ${WORD_LENGTH} characters`, async () => {
      await playerSubmitsGuess(wordOfTheDay + 'EXTRA')

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test.todo(
      `player guesses can only be submitted if they are real words in ${capitalize(LANGUAGE)}`
    )

    test.todo('player guesses are not case-sensitive')

    test.todo('player guesses can only contain letters')
  })
})
