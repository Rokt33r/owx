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
      const input = {
        message: 123
      } as unknown
      const predicate = owObj().shape({
        message: owStr()
      })

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
