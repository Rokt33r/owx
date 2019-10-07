import { owStr, validate } from '../src'

describe('owStr', () => {
  it('validates string', () => {
    const input = 'Hello, World!'
    const predicator = owStr()

    expect(() => {
      validate(input, predicator)
    }).not.toThrow()
  })

  it('throws when value is not string', () => {
    const input = 123
    const predicator = owStr()

    expect(() => {
      validate(input, predicator)
    }).toThrow('Expected value to be string')
  })

  describe('#length', () => {
    it('validates length of string', () => {
      const input = 'Hello, World!'
      const predicator = owStr().length(13)

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('validates length of string', () => {
      const input = 'Hello!'
      const predicator = owStr().length(13)

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to have length `13`, got `6`')
    })
  })

  describe('#min', () => {
    it('validates min length of string', () => {
      const input = '12345'
      const predicator = owStr().min(5)

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when length of string is less than the minimum length', () => {
      const input = '1234'
      const predicator = owStr().min(5)

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to have a minimum length of `5`, got `1234`')
    })
  })

  describe('#max', () => {
    it('validates max length of string', () => {
      const input = '12345'
      const predicator = owStr().max(5)

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when length of string is more than the maximum length', () => {
      const input = '123456'
      const predicator = owStr().max(5)

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to have a maximum length of `5`, got `123456`')
    })
  })

  describe('#match', () => {
    it('validates value matches the regexp', () => {
      const input = 'Hello, World!'
      const predicator = owStr().match(/^Hello/)

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value does not match the regexp', () => {
      const input = 'Hola, World!'
      const predicator = owStr().match(/^Hello/)

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to match `/^Hello/`, got `Hola, World!`')
    })
  })

  describe('#startsWith', () => {
    it('validates value starts with the target string', () => {
      const input = 'Hello, World!'
      const predicator = owStr().startsWith('Hello')

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value does not start with the target string', () => {
      const input = 'Hola, World!'
      const predicator = owStr().startsWith('Hello')

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to start with `Hello`, got `Hola, World!`')
    })
  })

  describe('#endsWith', () => {
    it('validates value ends with the target string', () => {
      const input = 'Hello, World!'
      const predicator = owStr().endsWith('World!')

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value does not end with the target string', () => {
      const input = 'Hello, Mundo!'
      const predicator = owStr().endsWith('World!')

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to end with `World!`, got `Hello, Mundo!`')
    })
  })

  describe('#includes', () => {
    it('validates value includes the target string', () => {
      const input = 'Hello, World!'
      const predicator = owStr().includes('World')

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value does not include the target string', () => {
      const input = 'Hello, Mundo!'
      const predicator = owStr().includes('World')

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to include `World`, got `Hello, Mundo!`')
    })
  })

  describe('#oneOf', () => {
    it('validates value is in expected list', () => {
      const input = 'Hello, World!'
      const predicator = owStr().oneOf('Hello, World!', 'Hola, Mundo!')

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not in expected list', () => {
      const input = '안녕, 세상아!'
      const predicator = owStr().oneOf('Hello, World!', 'Hola, Mundo!')

      expect(() => {
        validate(input, predicator)
      }).toThrow(
        'Expected value to be one of `["Hello, World!","Hola, Mundo!"]`, got `안녕, 세상아!`'
      )
    })

    it('omits overflow expected list items', () => {
      const input = '안녕, 세상아!'
      const predicator = owStr().oneOf(
        'Hello, World!',
        'Hola, Mundo!',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        'overflow'
      )

      expect(() => {
        validate(input, predicator)
      }).toThrow(
        'Expected value to be one of `["Hello, World!","Hola, Mundo!","1","2","3","4","5","6","7","8",…+1 more]`, got `안녕, 세상아!`'
      )
    })
  })

  describe('#empty', () => {
    it('validates value is empty', () => {
      const input = ''
      const predicator = owStr().empty()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not empty', () => {
      const input = 'Hello, World!'
      const predicator = owStr().empty()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be empty, got `Hello, World!`')
    })
  })

  describe('#nonEmpty', () => {
    it('validates value is not empty', () => {
      const input = 'Hello, World!'
      const predicator = owStr().nonEmpty()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is empty', () => {
      const input = ''
      const predicator = owStr().nonEmpty()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to not be empty')
    })
  })

  describe('#equals', () => {
    it('validates value equals to the expected', () => {
      const input = 'Hello, World!'
      const predicator = owStr().equals('Hello, World!')

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value does not equal to the expected', () => {
      const input = ''
      const predicator = owStr().equals('Hello, World!')

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be equal to `Hello, World!`, got ``')
    })
  })

  describe('#alphanumeric', () => {
    it('validates value is alphanumeric', () => {
      const input = 'owx123'
      const predicator = owStr().alphanumeric()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not alphanumeric', () => {
      const input = 'owx123/'
      const predicator = owStr().alphanumeric()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be alphanumeric, got `owx123/`')
    })
  })

  describe('#alphabetical', () => {
    it('validates value is alphabetical', () => {
      const input = 'owx'
      const predicator = owStr().alphabetical()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not alphabetical', () => {
      const input = 'owx123'
      const predicator = owStr().alphabetical()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be alphabetical, got `owx123`')
    })
  })

  describe('#numeric', () => {
    it('validates value is numeric', () => {
      const input = '+123'
      const predicator = owStr().numeric()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not numeric', () => {
      const input = '+123o'
      const predicator = owStr().numeric()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be numeric, got `+123o`')
    })
  })

  describe('#date', () => {
    it('validates value is date string', () => {
      const input = 'December 17, 1995 03:24:00'
      const predicator = owStr().date()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not date string', () => {
      const input = 'Hello, World!'
      const predicator = owStr().date()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be a date, got `Hello, World!`')
    })
  })

  describe('#lowercase', () => {
    it('validates value is lowercase', () => {
      const input = 'hello, world!'
      const predicator = owStr().lowercase()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not lowercase', () => {
      const input = 'Hello, World!'
      const predicator = owStr().lowercase()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be lowercase, got `Hello, World!`')
    })
  })

  describe('#uppercase', () => {
    it('validates value is uppercase', () => {
      const input = 'HELLO, WORLD!'
      const predicator = owStr().uppercase()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not uppercase', () => {
      const input = 'Hello, World!'
      const predicator = owStr().uppercase()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be uppercase, got `Hello, World!`')
    })
  })

  describe('#url', () => {
    it('validates value is a URL', () => {
      const input = 'https://rokt33r.github.io/'
      const predicator = owStr().url()

      expect(() => {
        validate(input, predicator)
      }).not.toThrow()
    })

    it('throws when value is not a URL', () => {
      const input = 'Hello, World!'
      const predicator = owStr().url()

      expect(() => {
        validate(input, predicator)
      }).toThrow('Expected value to be a URL, got `Hello, World!`')
    })
  })
})
