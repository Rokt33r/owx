import { isValid, validate, reportValidation, owStr, owObj, owx } from '../src'

describe('isValid', () => {
  it('returns true if input is valid', () => {
    const input = 'Hello, World!'
    const predicator = owStr()

    const result = isValid(input, predicator)

    expect(result).toBe(true)
  })

  it('returns false if input is not valid', () => {
    const input = 'Hello, World!'
    const predicator = owObj()

    const result = isValid(input, predicator)

    expect(result).toBe(false)
  })
})

describe('validate', () => {
  it('validates input', () => {
    const input = 'Hello, World!'
    const predicator = owStr()

    expect(() => {
      validate(input, predicator)
    })
  })

  it('throws when input is invalid', () => {
    const input = 'Hello, World!'
    const predicator = owObj()

    expect(() => {
      validate(input, predicator)
    }).toThrowError()
  })
})

describe('reportValidation', () => {
  it('returns null if input is valid', () => {
    const input = 'Hello, World!'
    const predicator = owStr()

    const result = reportValidation(input, predicator)

    expect(result).toBe(null)
  })

  it('returns error message if input is not valid', () => {
    const input = 'Hello, World!'
    const predicator = owObj()

    const result = reportValidation(input, predicator)

    expect(result).toBe('Expected value to be object, got `Hello, World!`')
  })
})

describe('owx', () => {
  describe('#any', () => {
    it('throws value does not match any of predicator', () => {
      const input = 'b'
      const predicator = owx.any(owStr().equals('a'), owStr().equals('b'))

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws value does not match any of predicator', () => {
      const input = 'c'
      const predicator = owx.any(owStr().equals('a'), owStr().equals('b'))

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
      const predicator = owx.any(
        owx.any(owStr().equals('a'), owStr().equals('b')),
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
})
