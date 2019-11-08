import { owArr, validate, owStr } from '../src'

describe('owArr', () => {
  it('validates array', () => {
    const input: any[] = []
    const predicator = owArr()

    expect(() => {
      validate(input, predicator)
    }).not.toThrow()
  })

  it('throws if value is not an array', () => {
    const input = 123
    const predicator = owArr()

    expect(() => {
      validate(input, predicator)
    }).toThrow('Expected value to be of type `Array` but received `number`')
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

  describe('#includes', () => {
    it('validates an array including targets', () => {
      const input: any[] = [1, 2, 3, 4]
      const predicator = owArr().includes(1, 2)

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when an array does not inlcude all targets', () => {
      const input: any[] = [2, 3, 4]
      const predicator = owArr().includes(1, 2)

      expect(() => {
        validate(input, predicator)
      }).toThrow(
        'Expected value to include all elements of `[1,2]`, got `[2,3,4]`'
      )
    })
  })

  describe('#includesAny', () => {
    it('validates an array including any of targets', () => {
      const input: any[] = [2, 3, 4]
      const predicator = owArr().includesAny(1, 2)

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when an array does not inlcude any of targets', () => {
      const input: any[] = [3, 4]
      const predicator = owArr().includesAny(1, 2)

      expect(() => {
        validate(input, predicator)
      }).toThrow(
        'Expected value to include any element of `[1,2]`, got `[3,4]`'
      )
    })
  })

  describe('#deepEqual', () => {
    it('validates an array is deeply equal to the target', () => {
      const input: any[] = [1, 2]
      const predicator = owArr().deepEqual([1, 2])

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when an array is not deeply equal to the target', () => {
      const input: any[] = [3, 4]
      const predicator = owArr().deepEqual([1, 2])

      expect(() => {
        validate(input, predicator)
      }).toThrow(
        `Expected value to be deeply equal to \`[1,2]\`, got \`[3,4]\``
      )
    })
  })

  describe('#ofType', () => {
    it('validates elements of an array with the predicator', () => {
      const input: any[] = ['a', 'b']
      const predicator = owArr().ofType(owStr().oneOf('a', 'b'))

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when any of elements is invalid', () => {
      const input: any[] = ['a', 'b', 'c']
      const predicator = owArr().ofType(owStr().oneOf('a', 'b'))

      expect(() => {
        validate(input, predicator)
      }).toThrow(
        `Expected property, \`2\`, to be one of \`["a","b"]\`, got \`c\``
      )
    })
  })
})
