import { owNum, validate } from '../src'

describe('owNum', () => {
  it('validates number', () => {
    const input = 123
    const predicator = owNum()

    expect(() => {
      validate(input, predicator)
    }).not.toThrow()
  })

  it('throws when value is not number', () => {
    const input = 'Hello, World!'
    const predicator = owNum()

    expect(() => {
      validate(input, predicator)
    }).toThrow('Expected value to be of type `number` but received `string`')
  })

  describe('#inRange', () => {
    it('validates number is in range', () => {
      const input = 2
      const predicator = owNum().inRange(0, 2)

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws value is not in range', () => {
      const input = 3
      const predicator = owNum().inRange(0, 2)

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be in range [0...2], got 3')
    })
  })

  describe('#greaterThan', () => {
    it('validates value is greater than target', () => {
      const input = 3
      const predicator = owNum().greaterThan(2)

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not greater than target', () => {
      const input = 2
      const predicator = owNum().greaterThan(2)

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be greater than 2, got 2')
    })
  })

  describe('#greaterThanOrEqual', () => {
    it('validates value is greater than or equal to target', () => {
      const input = 2
      const predicator = owNum().greaterThanOrEqual(2)

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not greater than or equal to target', () => {
      const input = 1
      const predicator = owNum().greaterThanOrEqual(2)

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be greater than or equal to 2, got 1')
    })
  })

  describe('#lessThan', () => {
    it('validates value is less than target', () => {
      const input = 1
      const predicator = owNum().lessThan(2)

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not less than target', () => {
      const input = 2
      const predicator = owNum().lessThan(2)

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be less than 2, got 2')
    })
  })

  describe('#lessThanOrEqual', () => {
    it('validates value is less than or equal to target', () => {
      const input = 2
      const predicator = owNum().lessThanOrEqual(2)

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not less than or equal to target', () => {
      const input = 3
      const predicator = owNum().lessThanOrEqual(2)

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be less than or equal to 2, got 3')
    })
  })

  describe('#equal', () => {
    it('validates value to equal to target', () => {
      const input = 2
      const predicator = owNum().equal(2)

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not equal to target', () => {
      const input = 1
      const predicator = owNum().equal(2)

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be equal to 2, got 1')
    })
  })

  describe('#oneOf', () => {
    it('validates value is one of expected list', () => {
      const input = 2
      const predicator = owNum().oneOf([1, 2])

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not one of expected list', () => {
      const input = 3
      const predicator = owNum().oneOf([1, 2])

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be one of `[1,2]`, got 3')
    })

    it('throws when value is not one of expected list(with more than 10 items)', () => {
      const input = 11
      const predicator = owNum().oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

      expect(() => {
        validate(input, predicator)
      }).toThrow(
        'Expected value to be one of `[0,1,2,3,4,5,6,7,8,9,…+1 more]`, got 11'
      )
    })
  })

  describe('#integer', () => {
    it('validates value is an integer', () => {
      const input = 2
      const predicator = owNum().integer()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not an integer', () => {
      const input = 2.2
      const predicator = owNum().integer()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be an integer, got 2.2')
    })
  })

  describe('#finite', () => {
    it('validates value is finite', () => {
      const input = 2
      const predicator = owNum().finite()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is infinite', () => {
      const input = Infinity
      const predicator = owNum().finite()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be finite, got Infinity')
    })
  })

  describe('#infinite', () => {
    it('validates value is infinite', () => {
      const input = Infinity
      const predicator = owNum().infinite()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is infinite', () => {
      const input = 2
      const predicator = owNum().infinite()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be infinite, got 2')
    })
  })

  describe('#positive', () => {
    it('validates value is positive', () => {
      const input = 2
      const predicator = owNum().positive()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not positive', () => {
      const input = 0
      const predicator = owNum().positive()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be positive, got 0')
    })
  })

  describe('#negative', () => {
    it('validates value is negative', () => {
      const input = -2
      const predicator = owNum().negative()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not negative', () => {
      const input = 0
      const predicator = owNum().negative()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be negative, got 0')
    })
  })

  describe('#integerOrInfinite', () => {
    it('passes when value is an integer', () => {
      const input = 2
      const predicator = owNum().integerOrInfinite()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('passes when value is infinite', () => {
      const input = Infinity
      const predicator = owNum().integerOrInfinite()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not an integer nor infinity', () => {
      const input = 2.2
      const predicator = owNum().integerOrInfinite()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be an integer or infinite, got 2.2')
    })
  })

  describe('#uint8', () => {
    it('validates value is uint8(0, 255)', () => {
      const input = 255
      const predicator = owNum().uint8()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not uint8(0, 255)', () => {
      const input = 256
      const predicator = owNum().uint8()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be in range [0...255], got 256')
    })
  })

  describe('#uint16', () => {
    it('validates value is uint16(0, 65535)', () => {
      const input = 65535
      const predicator = owNum().uint16()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not uint16(0, 65535)', () => {
      const input = 65536
      const predicator = owNum().uint16()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be in range [0...65535], got 65536')
    })
  })

  describe('#uint32', () => {
    it('validates value is uint32(0, 4294967295)', () => {
      const input = 4294967295
      const predicator = owNum().uint32()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not uint32(0, 4294967295)', () => {
      const input = 4294967296
      const predicator = owNum().uint32()

      expect(() => {
        validate(input, predicator)
      }).toThrow(
        'Expected value to be in range [0...4294967295], got 4294967296'
      )
    })
  })

  describe('#int8', () => {
    it('validates value is int8(-128, 127)', () => {
      const input = 127
      const predicator = owNum().int8()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not int8(-128, 127)', () => {
      const input = 128
      const predicator = owNum().int8()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be in range [-128...127], got 128')
    })
  })

  describe('#int16', () => {
    it('validates value is int16(-32768, 32767)', () => {
      const input = 32767
      const predicator = owNum().int16()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not int16(-32768, 32767)', () => {
      const input = 32768
      const predicator = owNum().int16()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be in range [-32768...32767], got 32768')
    })
  })

  describe('#int32', () => {
    it('validates value is int32(-2147483648, 2147483647)', () => {
      const input = 2147483647
      const predicator = owNum().int32()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not int32(-2147483648, 2147483647)', () => {
      const input = 2147483648
      const predicator = owNum().int32()

      expect(() => {
        validate(input, predicator)
      }).toThrow(
        'Expected value to be in range [-2147483648...2147483647], got 2147483648'
      )
    })
  })
})
