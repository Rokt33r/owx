import { owAny, owAnyx, validate, owStr } from '../src'

describe('owAny', () => {
  it('throws value does not match any of predicator', () => {
    const input = 'b'
    const predicator = owAny(owStr().equals('a'), owStr().equals('b'))

    expect(() => {
      validate(input, predicator)
    }).not.toThrow()
  })

  it('throws value does not match any of predicator', () => {
    const input = 'c'
    const predicator = owAny(owStr().equals('a'), owStr().equals('b'))

    expect(() => {
      validate(input, predicator)
    }).toThrow(
      [
        'Expected value to match any of following conditions',
        '- Expected value to be equal to `a`, got `c`',
        '- Expected value to be equal to `b`, got `c`'
      ].join('\n')
    )
  })

  it('throws with indented messages', () => {
    const input = 'd'
    const predicator = owAny(
      owAny(owStr().equals('a'), owStr().equals('b')),
      owStr().equals('c')
    )

    expect(() => {
      validate(input, predicator)
    }).toThrow(
      [
        'Expected value to match any of following conditions',
        '- Expected value to match any of following conditions',
        '  - Expected value to be equal to `a`, got `d`',
        '  - Expected value to be equal to `b`, got `d`',
        '- Expected value to be equal to `c`, got `d`'
      ].join('\n')
    )
  })
})

describe('owAnyx', () => {
  it('throws value does not match any of predicator', () => {
    const input = 'b'
    const predicator = owAnyx(owStr().equals('a'), owStr().equals('b'))

    expect(() => {
      validate(input, predicator)
    }).not.toThrow()
  })
})
