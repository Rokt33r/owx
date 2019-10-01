import { isArgumentError, ArgumentError } from '../src'

describe(isArgumentError.name, () => {
  it('returns true if error is ArgumentError', () => {
    const input = new ArgumentError('test', () => {})

    const result = isArgumentError(input)

    expect(result).toBe(true)
  })

  it('returns false if error is not ArgumentError', () => {
    const input = new Error()

    const result = isArgumentError(input)

    expect(result).toBe(false)
  })
})
