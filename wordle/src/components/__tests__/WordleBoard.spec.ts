import WordleBoard from '@/components/WordleBoard.vue'
import { DEFEAT_MESSAGE, VICTORY_MESSAGE } from '@/settings'
import { mount } from '@vue/test-utils'

describe('WordleBoard', () => {
  test('a victory message appears when the user makes a guess that matches the word of the day', async () => {
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay: 'TESTS' } })

    const guessInput = wrapper.find('input[type="text"]')
    await guessInput.setValue('TESTS')
    await guessInput.trigger('keydown.enter')

    expect(wrapper.text()).toContain(VICTORY_MESSAGE)
  })

  test('a defeat message appears when the user makes a guess that does not match the word of the day', async () => {
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay: 'TESTS' } })

    const guessInput = wrapper.find('input[type="text"]')
    await guessInput.setValue('WRONG')
    await guessInput.trigger('keydown.enter')

    expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
  })

  test.todo('no message appears when the user has not yet made a guess')
})
