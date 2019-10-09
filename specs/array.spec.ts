import { owArr, validate } from '../src'

describe('owArr', () => {
  it('validates array', () => {
    const input: any[] = []
    const predicator = owArr()

    expect(() => {
      validate(input, predicator)
    }).not.toThrow()
  })

  describe('#empty', () => {
    it('validate an array is empty', () => {
      const input: any[] = []
      const predicator = owArr().empty()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when an array is not empty', () => {
      const input: any[] = [1]
      const predicator = owArr().empty()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be empty, got `[1]`')
    })
  })

  describe('#nonEpty', () => {
    it('validate an array is not empty', () => {
      const input: any[] = [1]
      const predicator = owArr().nonEmpty()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when an array is empty', () => {
      const input: any[] = []
      const predicator = owArr().nonEmpty()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to not be empty')
    })
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

  describe('#minLength', () => {
    it('validates min length of an array', () => {
      const input: any[] = [1, 2, 3]
      const predicator = owArr().minLength(3)

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when length of an array is less than the minimum length', () => {
      const input: any[] = [1, 2]
      const predicator = owArr().minLength(3)

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to have a minimum length `3`, got `2`')
    })
  })

  describe('#maxLength', () => {
    it('validates max length of an array', () => {
      const input: any[] = [1, 2, 3]
      const predicator = owArr().maxLength(3)

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when length of an array is more than the maximum length', () => {
      const input: any[] = [1, 2, 3, 4]
      const predicator = owArr().maxLength(3)

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to have a maximum length `3`, got `4`')
    })
  })
})
