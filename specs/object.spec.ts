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
