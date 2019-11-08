import { isValid, validate, reportValidation, owStr, owObj } from '../src'

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

    expect(result).toBe(
      'Expected value to be of type `Object` but received `string`'
    )
  })
})
