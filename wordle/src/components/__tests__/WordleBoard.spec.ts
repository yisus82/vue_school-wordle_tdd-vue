import WordleBoard from '@/components/WordleBoard.vue'
import { DEFEAT_MESSAGE, VICTORY_MESSAGE } from '@/settings'
import { mount } from '@vue/test-utils'

describe('WordleBoard', () => {
  const wordOfTheDay = 'TESTS'
  let wrapper: ReturnType<typeof mount>

  const playerSubmitsGuess = async (guessWord: string) => {
    const guessInput = wrapper.find('input[type="text"]')
    await guessInput.setValue(guessWord)
    await guessInput.trigger('keydown.enter')
  }

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
      { wordOfTheDay: 'LESS', reason: 'having less than 5 characters' },
      { wordOfTheDay: 'LONGER', reason: 'having more than 5 characters' },
      { wordOfTheDay: 'lower', reason: 'not being in uppercase' },
      { wordOfTheDay: 'QWERT', reason: 'not being a real word in English' }
    ])('if $wordOfTheDay is provided, a warning is emitted for $reason', ({ wordOfTheDay }) => {
      mount(WordleBoard, { props: { wordOfTheDay } })

      expect(console.warn).toHaveBeenCalled()
    })

    test('no warning is emitted if the word of the day is a real uppercase word in English with 5 characters', () => {
      mount(WordleBoard, { props: { wordOfTheDay: 'TESTS' } })

      expect(console.warn).not.toHaveBeenCalled()
    })
  })

  describe('Player guesses', () => {
    test.todo('player guesses are limited to 5 characters')

    test.todo('player guesses can only be submitted if they are real words in English')

    test.todo('player guesses are not case-sensitive')

    test.todo('player guesses can only contain letters')
  })
})
