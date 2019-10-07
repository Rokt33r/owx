import { owObj, validate, owStr, owShape } from '../src'

describe('owObj', () => {
  it('throws when input is not an object', () => {
    const input = 'Hello, World!'
    const predicator = owObj()

    expect(() => {
      validate(input, predicator)
    }).toThrow('Expected value to be object, got `Hello, World!`')
  })

  describe('#partialShape', () => {
    it('validates with shape', () => {
      const input: unknown = {
        message: 'Hello, World!'
      }
      const predicator = owObj().partialShape({
        message: owStr()
      })

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('validates with nested shape', () => {
      const input: unknown = {
        data: {
          message: 'Hello, World!'
        }
      }
      const predicator = owObj().partialShape({
        data: owObj().partialShape({
          message: owStr()
        })
      })

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('reports an invalid property', () => {
      const input: unknown = {
        message: 123
      }
      const predicator = owObj().partialShape({
        message: owStr()
      })

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected property, `message`, to be string, got `123`')
    })

    it('reports a nested invalid property', () => {
      const input: unknown = {
        data: {
          message: 123
        }
      }
      const predicator = owObj().partialShape({
        data: owObj().partialShape({
          message: owStr()
        })
      })

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected property, `data.message`, to be string, got `123`')
    })
  })

  describe('#exactShape', () => {
    it('validates with shape', () => {
      const input: unknown = {
        message: 'Hello, World!'
      }
      const predicator = owObj().exactShape({
        message: owStr()
      })

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('validates with nested shape', () => {
      const input: unknown = {
        data: {
          message: 'Hello, World!'
        }
      }
      const predicator = owObj().exactShape({
        data: owObj().exactShape({
          message: owStr()
        })
      })

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('reports an invalid property', () => {
      const input: unknown = {
        message: 123
      }
      const predicator = owObj().exactShape({
        message: owStr()
      })

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected property, `message`, to be string, got `123`')
    })

    it('reports a nested invalid property', () => {
      const input: unknown = {
        data: {
          message: 123
        }
      }
      const predicator = owObj().exactShape({
        data: owObj().exactShape({
          message: owStr()
        })
      })

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected property, `data.message`, to be string, got `123`')
    })

    it('reports an extra property', () => {
      const input: unknown = {
        message: 'Hello, World!',
        extra: 456
      }
      const predicator = owObj().exactShape({
        message: owStr()
      })

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected property, `extra`, not to exist, got `456`')
    })

    it('reports a nested extra property', () => {
      const input: unknown = {
        data: {
          message: 'Hello, World!',
          extra: 456
        }
      }
      const predicator = owObj().exactShape({
        data: owObj().exactShape({
          message: owStr()
        })
      })

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected property, `data.extra`, not to exist, got `456`')
    })
  })

  describe('#shape', () => {
    it('uses partialShape by default', () => {
      const input: unknown = {
        message: 'Hello, World!',
        extra: 456
      }
      const predicator = owObj().shape({
        message: owStr()
      })

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('uses exactShape when the option is given', () => {
      const input: unknown = {
        message: 'Hello, World!',
        extra: 456
      }
      const predicator = owObj().shape(
        {
          message: owStr()
        },
        true
      )

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected property, `extra`, not to exist, got `456`')
    })
  })

  describe('#plain', () => {
    it('validates plain object', () => {
      const input: unknown = {}
      const predicator = owObj().plain()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when input is not plain object', () => {
      class NotPlain {}
      const input: unknown = new NotPlain()
      const predicator = owObj().plain()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be a plain object')
    })
  })

  describe('#empty', () => {
    it('validates object has no keys', () => {
      const input = {}
      const predicator = owObj().empty()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when object has keys', () => {
      const input = { message: 'Hello, World!' }
      const predicator = owObj().empty()

      expect(() => {
        validate(input, predicator)
      }).toThrow(
        'Expected value to be empty, got `{"message":"Hello, World!"}`'
      )
    })
  })

  describe('#nonEmpty', () => {
    it('validates object has keys', () => {
      const input = { message: 'Hello, World!' }
      const predicator = owObj().nonEmpty()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when object has no keys', () => {
      const input = {}
      const predicator = owObj().nonEmpty()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to not be empty')
    })
  })

  describe('#valuesOfType', () => {
    it('validates values in object', () => {
      const input = {
        message: 'Hello, World!',
        message2: 'Hello, World2!'
      }
      const predicator = owObj().valuesOfType(owStr())

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when any values in object are invalid', () => {
      const input = {
        message: 123,
        message2: 'Hello, World2!'
      }
      const predicator = owObj().valuesOfType(owStr())

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected property, `message`, to be string, got `123`')
    })

    it('throws when any values in object are invalid(nested)', () => {
      const input = {
        item1: {
          message: 123
        },
        item2: {
          message: 'Hello, World2!'
        }
      }
      const predicator = owObj().valuesOfType(
        owShape({
          message: owStr()
        })
      )

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected property, `item1.message`, to be string, got `123`')
    })
  })

  describe('#deepEqual', () => {
    it('validates input is deeply equal to target', () => {
      const input = {
        data: {
          message: 'Hello, World!'
        }
      }
      const predicator = owObj().deepEqual({
        data: {
          message: 'Hello, World!'
        }
      })

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('validates input is deeply equal to target', () => {
      const input = {
        data: {
          message: 123
        }
      }
      const predicator = owObj().deepEqual({
        data: {
          message: 'Hello, World!'
        }
      })

      expect(() => {
        validate(input, predicator)
      }).toThrowError(
        'Expected value to be deeply equal to `{"data":{"message":"Hello, World!"}}`, got `{"data":{"message":123}}`'
      )
    })
  })

  describe('instanceOf', () => {
    it('validates input is instance of target', () => {
      class Data {}
      const input = new Data()
      const predicator = owObj().instanceOf(Data)

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws if input is not instance of target', () => {
      class Data {}
      class WrongData {}
      const input = new WrongData()
      const predicator = owObj().instanceOf(Data)

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be instance of `Data`, got `WrongData`')
    })

    it('stringifies input if it is plain object', () => {
      class Data {}
      const input = { message: 'Hello, World!' }
      const predicator = owObj().instanceOf(Data)

      expect(() => {
        validate(input, predicator)
      }).toThrow(
        'Expected value to be instance of `Data`, got `{"message":"Hello, World!"}`'
      )
    })
  })
})

describe('#owShape', () => {
  it('uses partialShape by default', () => {
    const input: unknown = {
      message: 'Hello, World!',
      extra: 456
    }
    const predicator = owShape({
      message: owStr()
    })

    expect(() => {
      validate(input, predicator)
    }).not.toThrow()
  })

  it('uses exactShape when the option is given', () => {
    const input: unknown = {
      message: 'Hello, World!',
      extra: 456
    }
    const predicator = owShape(
      {
        message: owStr()
      },
      true
    )

    expect(() => {
      validate(input, predicator)
    }).toThrow('Expected property, `extra`, not to exist, got `456`')
  })
})
