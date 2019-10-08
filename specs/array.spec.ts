import { owArr, validate } from '../src'

describe('owArr', () => {
  it('validates array', () => {
    const input: any[] = []
    const predicator = owArr()

    expect(() => {
      validate(input, predicator)
    }).not.toThrow()
  })

  describe('#length', () => {
    it('validates length of an array', () => {
      const input: any[] = [1]
      const predicator = owArr().length(1)

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when length does not match', () => {
      const input: any[] = [1, 2]
      const predicator = owArr().length(1)

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to have length `1`, got `2`')
    })
  })
})
