import GuessView from '@/components/GuessView.vue'
import WordleBoard from '@/components/WordleBoard.vue'
import { DEFEAT_MESSAGE, LANGUAGE, MAX_GUESSES, VICTORY_MESSAGE, WORD_LENGTH } from '@/settings'
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

    describe.each(
      Array.from({ length: MAX_GUESSES }, (_, i) => {
        const numberOfGuesses = i + 1

        return { numberOfGuesses, shouldSeeDefeatMessage: numberOfGuesses === MAX_GUESSES }
      })
    )(
      `a defeat message should appear when the user makes ${MAX_GUESSES} wrong guesses in a row`,
      ({ numberOfGuesses, shouldSeeDefeatMessage }) => {
        test(`therefore for ${numberOfGuesses} guess(es), a defeat message ${shouldSeeDefeatMessage ? 'should' : 'should not'} appear`, async () => {
          for (let i = 0; i < numberOfGuesses; i++) {
            await playerSubmitsGuess('WRONG')
          }

          if (shouldSeeDefeatMessage) {
            expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
          } else {
            expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
          }
        })
      }
    )

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
      { wordOfTheDay: 'QWERT', reason: `not being a real word in ${capitalize(LANGUAGE)}` }
    ])('if $wordOfTheDay is provided, a warning is emitted for $reason', ({ wordOfTheDay }) => {
      mount(WordleBoard, { props: { wordOfTheDay } })

      expect(console.warn).toHaveBeenCalled()
    })

    test(`no warning is emitted if the word of the day is a real uppercase word in ${capitalize(LANGUAGE)} with ${WORD_LENGTH} characters`, () => {
      mount(WordleBoard, { props: { wordOfTheDay: 'TESTS' } })

      expect(console.warn).not.toHaveBeenCalled()
    })
  })

  describe('Player input', () => {
    test('remains in focus the entire time the game is being played', async () => {
      document.body.innerHTML = '<div id="app"></div>'
      wrapper = mount(WordleBoard, { props: { wordOfTheDay }, attachTo: '#app' })

      expect(wrapper.find('input[type="text"]').attributes('autofocus')).not.toBeUndefined()

      await wrapper.find('input[type="text"]').trigger('blur')
      expect(document.activeElement).toBe(wrapper.find('input[type="text"]').element)
    })

    test('player guesses are cleared after they are submitted', async () => {
      await playerSubmitsGuess('WRONG')

      expect(wrapper.find<HTMLInputElement>('input[type="text"]').element.value).toEqual('')
    })

    test(`player guesses are limited to ${WORD_LENGTH} characters`, async () => {
      await playerSubmitsGuess(wordOfTheDay + 'EXTRA')

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test(`player guesses can only be submitted if they are real words in ${capitalize(LANGUAGE)}`, async () => {
      await playerSubmitsGuess('QWERT')

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })

    test('player guesses are not case-sensitive', async () => {
      await playerSubmitsGuess(wordOfTheDay.toLowerCase())

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test('player guesses can only contain letters', async () => {
      await playerSubmitsGuess('H3!ÜñRT')

      expect(wrapper.find<HTMLInputElement>('input[type="text"]').element.value).toEqual('HÜÑRT')
    })

    test('non-alphabetic characters are not rendered while being typed', async () => {
      await playerSubmitsGuess('333')

      expect(wrapper.find<HTMLInputElement>('input[type="text"]').element.value).toEqual('')
    })

    test('the player loses control after the maximum number of guesses has been reached', async () => {
      for (let i = 0; i < MAX_GUESSES; i++) {
        await playerSubmitsGuess('WRONG')
      }

      expect(
        wrapper.find<HTMLInputElement>('input[type="text"]').attributes('disabled')
      ).not.toBeUndefined()
    })

    test('the player loses control after the correct word is guessed', async () => {
      await playerSubmitsGuess(wordOfTheDay)

      expect(
        wrapper.find<HTMLInputElement>('input[type="text"]').attributes('disabled')
      ).not.toBeUndefined()
    })
  })

  describe('Guess history', () => {
    test(`${MAX_GUESSES} guess-view components are displayed at the start of the game`, () => {
      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES)
    })

    test(`${MAX_GUESSES} guess-view components are displayed when the player loses the game`, async () => {
      for (let i = 0; i < MAX_GUESSES; i++) {
        await playerSubmitsGuess('WRONG')
      }

      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES)
    })

    test(`${MAX_GUESSES} guess-view components are displayed when the player wins the game`, async () => {
      await playerSubmitsGuess(wordOfTheDay)

      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES)
    })

    test(`${MAX_GUESSES} guess-view components are displayed after each guess is submitted`, async () => {
      for (let i = 0; i < MAX_GUESSES; i++) {
        await playerSubmitsGuess('WRONG')
        expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES)
      }
    })

    test('all the guesses made by the player are displayed in the order they were made', async () => {
      const guesses = ['WRONG', 'GUESS', 'HELLO', 'WORLD', 'HAPPY', 'CODER']
      for (const guess of guesses) {
        await playerSubmitsGuess(guess)
      }

      const guessViews = wrapper.findAllComponents(GuessView)
      expect(guessViews).toHaveLength(guesses.length)
      for (let i = 0; i < guessViews.length; i++) {
        expect(guessViews[i].text()).toContain(guesses[i])
      }
    })
  })
})
