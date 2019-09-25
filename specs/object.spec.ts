import { owObj, reportValidation, owStr, isValid } from '../src'

describe('owObj', () => {
  it('throws when input is not an object', () => {
    const input = 'Hello, World!'
    const predicate = owObj()

    const result = reportValidation(input, predicate)

    expect(result).toBe(`Expected to be object, got 'Hello, World!'`)
  })

  describe('#shape', () => {
    it('validates with shape', () => {
      let input: unknown = {
        message: 123
      }
      const shape = {
        message: owStr()
      }
      const predicate = owObj().shape(shape)

      if (isValid(input, predicate)) {
        input
      }

      const result = reportValidation(input, predicate)

      expect(result).toBe(
        `Expected property, 'message', to be string, got '[object Object]'`
      )

      if (isValid(input, predicate)) {
        input
      }
    })
  })
})
