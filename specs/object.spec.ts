import { owObj, validate, owStr } from '../src'

describe('owObj', () => {
  it('throws when input is not an object', () => {
    const input = 'Hello, World!'
    const predicate = owObj()

    expect(() => {
      validate(input, predicate)
    }).toThrow('Expected value to be object, got `Hello, World!`')
  })

  describe('#partialShape', () => {
    it('validates with shape', () => {
      const input: unknown = {
        message: 'Hello, World!'
      }
      const predicate = owObj().partialShape({
        message: owStr()
      })

      expect(() => {
        validate(input, predicate)
      }).not.toThrow()
    })

    it('validates with nested shape', () => {
      const input: unknown = {
        data: {
          message: 'Hello, World!'
        }
      }
      const predicate = owObj().partialShape({
        data: owObj().partialShape({
          message: owStr()
        })
      })

      expect(() => {
        validate(input, predicate)
      }).not.toThrow()
    })

    it('reports an invalid property', () => {
      const input: unknown = {
        message: 123
      }
      const predicate = owObj().partialShape({
        message: owStr()
      })

      expect(() => {
        validate(input, predicate)
      }).toThrow('Expected property, `message`, to be string, got `123`')
    })

    it('reports a nested invalid property', () => {
      const input: unknown = {
        data: {
          message: 123
        }
      }
      const predicate = owObj().partialShape({
        data: owObj().partialShape({
          message: owStr()
        })
      })

      expect(() => {
        validate(input, predicate)
      }).toThrow('Expected property, `data.message`, to be string, got `123`')
    })
  })

  describe('#exactShape', () => {
    it('validates with shape', () => {
      const input: unknown = {
        message: 'Hello, World!'
      }
      const predicate = owObj().exactShape({
        message: owStr()
      })

      expect(() => {
        validate(input, predicate)
      }).not.toThrow()
    })

    it('validates with nested shape', () => {
      const input: unknown = {
        data: {
          message: 'Hello, World!'
        }
      }
      const predicate = owObj().exactShape({
        data: owObj().exactShape({
          message: owStr()
        })
      })

      expect(() => {
        validate(input, predicate)
      }).not.toThrow()
    })

    it('reports an invalid property', () => {
      const input: unknown = {
        message: 123
      }
      const predicate = owObj().exactShape({
        message: owStr()
      })

      expect(() => {
        validate(input, predicate)
      }).toThrow('Expected property, `message`, to be string, got `123`')
    })

    it('reports a nested invalid property', () => {
      const input: unknown = {
        data: {
          message: 123
        }
      }
      const predicate = owObj().exactShape({
        data: owObj().exactShape({
          message: owStr()
        })
      })

      expect(() => {
        validate(input, predicate)
      }).toThrow('Expected property, `data.message`, to be string, got `123`')
    })

    it('reports an extra property', () => {
      const input: unknown = {
        message: 'Hello, World!',
        extra: 456
      }
      const predicate = owObj().exactShape({
        message: owStr()
      })

      expect(() => {
        validate(input, predicate)
      }).toThrow('Expected property, `extra`, not to exist, got `456`')
    })

    it('reports a nested extra property', () => {
      const input: unknown = {
        data: {
          message: 'Hello, World!',
          extra: 456
        }
      }
      const predicate = owObj().exactShape({
        data: owObj().exactShape({
          message: owStr()
        })
      })

      expect(() => {
        validate(input, predicate)
      }).toThrow('Expected property, `data.extra`, not to exist, got `456`')
    })
  })
})
