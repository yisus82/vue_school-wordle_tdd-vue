import GuessView from '@/components/GuessView.vue'
import WordleBoard from '@/components/WordleBoard.vue'
import { DEFEAT_MESSAGE, LANGUAGE, MAX_GUESSES, VICTORY_MESSAGE, WORD_LENGTH } from '@/settings'
import { mount } from '@vue/test-utils'

describe('WordleBoard', () => {
  const wordOfTheDay = 'TESTS'
  let wrapper: ReturnType<typeof mount>

  const playerTypesGuess = async (guessWord: string) =>
    await wrapper.find('input[type="text"]').setValue(guessWord)

  const playerSubmitsGuess = async () =>
    await wrapper.find('input[type="text"]').trigger('keydown.enter')

  const playerTypesAndSubmitsGuess = async (guessWord: string) => {
    await playerTypesGuess(guessWord)
    await playerSubmitsGuess()
  }

  const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay } })
  })

  describe('End of game messages', () => {
    test('a victory message appears when the user makes a guess that matches the word of the day', async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay)

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
            await playerTypesAndSubmitsGuess('WRONG')
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
      await playerTypesAndSubmitsGuess('WRONG')

      expect(wrapper.find<HTMLInputElement>('input[type="text"]').element.value).toEqual('')
    })

    test(`player guesses are limited to ${WORD_LENGTH} characters`, async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay + 'EXTRA')

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test(`player guesses can only be submitted if they are real words in ${capitalize(LANGUAGE)}`, async () => {
      await playerTypesAndSubmitsGuess('QWERT')

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })

    test('player guesses are not case-sensitive', async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay.toLowerCase())

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test('player guesses can only contain letters', async () => {
      await playerTypesGuess('H3!ÜñRT')

      expect(wrapper.find<HTMLInputElement>('input[type="text"]').element.value).toEqual('HÜÑRT')
    })

    test('non-alphabetic characters are not rendered while being typed', async () => {
      await playerTypesGuess('333')

      expect(wrapper.find<HTMLInputElement>('input[type="text"]').element.value).toEqual('')
    })

    describe('the player can only submit guesses if the game is not over', async () => {
      test('the guess input disappears after the maximum number of guesses has been reached', async () => {
        for (let i = 0; i < MAX_GUESSES; i++) {
          await playerTypesAndSubmitsGuess('WRONG')
        }

        expect(wrapper.find<HTMLInputElement>('input[type="text"]').exists()).toBe(false)
      })

      test('the guess input disappears after the correct word is guessed', async () => {
        await playerTypesAndSubmitsGuess(wordOfTheDay)

        expect(wrapper.find<HTMLInputElement>('input[type="text"]').exists()).toBe(false)
      })
    })
  })

  describe('Guess history', () => {
    test(`${MAX_GUESSES} guess-view components are displayed at the start of the game`, () => {
      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES)
    })

    test(`${MAX_GUESSES} guess-view components are displayed when the player loses the game`, async () => {
      for (let i = 0; i < MAX_GUESSES; i++) {
        await playerTypesAndSubmitsGuess('WRONG')
      }

      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES)
    })

    test(`${MAX_GUESSES} guess-view components are displayed when the player wins the game`, async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay)

      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES)
    })

    test(`${MAX_GUESSES} guess-view components are displayed after each guess is submitted`, async () => {
      for (let i = 0; i < MAX_GUESSES; i++) {
        await playerTypesAndSubmitsGuess('WRONG')
        expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES)
      }
    })

    test('all the guesses made by the player are displayed in the order they were made', async () => {
      const guesses = ['WRONG', 'GUESS', 'HELLO', 'WORLD', 'HAPPY', 'CODER']
      for (const guess of guesses) {
        await playerTypesAndSubmitsGuess(guess)
      }

      const guessViews = wrapper.findAllComponents(GuessView)
      expect(guessViews).toHaveLength(guesses.length)
      for (let i = 0; i < guessViews.length; i++) {
        expect(guessViews[i].text()).toContain(guesses[i])
      }
    })
  })

  describe('Feedback for player guesses', () => {
    test('hints are not displayed before the player started typing the guess', async () => {
      expect(wrapper.find('[data-letter-feedback]').exists()).toBe(false)
    })

    test('hints are not displayed before the player submits a guess', async () => {
      await playerTypesGuess('WRONG')

      expect(wrapper.find('[data-letter-feedback]').exists()).toBe(false)
    })

    test('hints are displayed after the player submits a guess', async () => {
      await playerTypesAndSubmitsGuess('WRONG')

      expect(wrapper.find('[data-letter-feedback]').exists()).toBe(true)
    })

    describe.each([
      {
        position: 0,
        expectedFeedback: 'correct',
        reason: 'the letter is in the correct position'
      },
      {
        position: 1,
        expectedFeedback: 'almost',
        reason: 'the letter is in the word but not in the correct position'
      },
      {
        position: 2,
        expectedFeedback: 'almost',
        reason: 'the letter is in the word but not in the correct position'
      },
      {
        position: 3,
        expectedFeedback: 'wrong',
        reason: 'the letter is not in the word'
      },
      {
        position: 4,
        expectedFeedback: 'wrong',
        reason: 'the letter is not in the word'
      }
    ])(
      `the feedback for the letter at position $position is $expectedFeedback because $reason`,
      ({ position, expectedFeedback, reason }) => {
        const wordOfTheDay = 'WORLD'
        const guess = 'WRONG'

        test(`the feedback for the letter at position ${position} is ${expectedFeedback} because ${reason}`, async () => {
          wrapper = mount(WordleBoard, { props: { wordOfTheDay } })

          await playerTypesAndSubmitsGuess(guess)

          const feedback = wrapper
            .findAll('[data-letter]')
            .at(position)
            ?.attributes('data-letter-feedback')

          expect(feedback).toEqual(expectedFeedback)
        })
      }
    )
  })
})
