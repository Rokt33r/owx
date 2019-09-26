import { owObj, validate, owStr } from '../src'

describe('owObj', () => {
  it('throws when input is not an object', () => {
    const input = 'Hello, World!'
    const predicate = owObj()

    expect(() => {
      validate(input, predicate)
    }).toThrow('Expected value to be object, got `Hello, World!`')
  })

  describe('#shape', () => {
    it('validates with shape', () => {
      const input: unknown = {
        message: 123
      }
      const predicate = owObj().shape({
        message: owStr()
      })

      expect(() => {
        validate(input, predicate)
      }).toThrow('Expected property, `message`, to be string, got `123`')
    })

    it('validates with nested shape', () => {
      const input: unknown = {
        data: {
          message: 123
        }
      }
      const predicate = owObj().shape({
        data: owObj().shape({
          message: owStr()
        })
      })

      expect(() => {
        validate(input, predicate)
      }).toThrow('Expected property, `data.message`, to be string, got `123`')
    })
  })
})
