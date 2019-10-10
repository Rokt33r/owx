import is from '@sindresorhus/is/dist'
import { Validator, Predicator, Predicate, reportValidation } from './owx'
import isEqual = require('lodash.isequal')

const arrayValidator: Validator<any[]> = {
  validate: is.array,
  report(input) {
    return `Expected value to be an array, got \`${input}\``
  }
}

const arrayEmptyValidator: Validator<any[], any[]> = {
  validate(input): input is any[] {
    return input.length === 0
  },
  report(input) {
    return `Expected value to be empty, got \`${JSON.stringify(input)}\``
  }
}

const arrayNonEmptyValidator: Validator<any[], any[]> = {
  validate(input): input is any[] {
    return input.length > 0
  },
  report(input) {
    return `Expected value to not be empty`
  }
}

function createArrayLengthValidator(length: number): Validator<any[], any[]> {
  return {
    validate(input): input is any[] {
      return input.length === length
    },
    report(input) {
      return `Expected value to have length \`${length}\`, got \`${input.length}\``
    }
  }
}

function createArrayMinLengthValidator(
  length: number
): Validator<any[], any[]> {
  return {
    validate(input): input is any[] {
      return input.length >= length
    },
    report(input) {
      return `Expected value to have a minimum length \`${length}\`, got \`${input.length}\``
    }
  }
}

function createArrayMaxLengthValidator(
  length: number
): Validator<any[], any[]> {
  return {
    validate(input): input is any[] {
      return input.length <= length
    },
    report(input) {
      return `Expected value to have a maximum length \`${length}\`, got \`${input.length}\``
    }
  }
}

function createArrayIncludesValidator(
  searchElements: any[]
): Validator<any[], any[]> {
  return {
    validate(input): input is any[] {
      return searchElements.every(searchElement =>
        input.includes(searchElements)
      )
    },
    report(input) {
      return `Expected value to include all elements of \`${JSON.stringify(
        searchElements
      )}\`, got \`${JSON.stringify(input)}\``
    }
  }
}

function createArrayIncludesAnyValidator(
  searchElements: any[]
): Validator<any[], any[]> {
  return {
    validate(input): input is any[] {
      return searchElements.some(searchElement =>
        input.includes(searchElements)
      )
    },
    report(input) {
      return `Expected value to include any element of \`${JSON.stringify(
        searchElements
      )}\`, got \`${JSON.stringify(input)}\``
    }
  }
}

function createArrayDeepEqualValidator(
  expected: any[]
): Validator<any[], any[]> {
  return {
    validate(input): input is any[] {
      return isEqual(input, expected)
    },
    report(input) {
      return `Expected value to be deeply equal to \`${JSON.stringify(
        expected
      )}\`, got \`${JSON.stringify(input)}\``
    }
  }
}

const valueErrorRegexp = /^Expected value/
const propertyErrorRegexp = /^Expected property, `(.+)`,/

function createArrayOfType<I>(
  predicator: Predicator<Predicate<I>>
): Validator<I[], any[]> {
  const messageSymbol = Symbol()
  return {
    validate(input, context): input is I[] {
      for (let index = 0; index < input.length; index++) {
        const result = reportValidation(input[index], predicator)
        if (result != null) {
          context[messageSymbol] = {
            key: index,
            message: result
          }
          return false
        }
      }
      return true
    },
    report(_input, context) {
      const { key, message } = context[messageSymbol]

      if (propertyErrorRegexp.test(message)) {
        return message.replace(
          propertyErrorRegexp,
          `Expected property, \`${key}.$1\`,`
        )
      }

      return message.replace(valueErrorRegexp, `Expected property, \`${key}\`,`)
    }
  }
}

class ArrayPredicator<A extends any[]> implements Predicator<Predicate<any[]>> {
  constructor(validators: Validator<any>[] = [arrayValidator]) {
    this.predicate = {
      validators
    }
  }

  predicate: Predicate<A>

  addValidator<AA extends any[]>(validator: Validator<AA, any[]>) {
    return new ArrayPredicator<AA>([...this.predicate.validators, validator])
  }

  empty(): ArrayPredicator<A> {
    return this.addValidator(arrayEmptyValidator)
  }

  nonEmpty(): ArrayPredicator<A> {
    return this.addValidator(arrayNonEmptyValidator)
  }

  length(length: number): ArrayPredicator<A> {
    return this.addValidator(createArrayLengthValidator(length))
  }

  minLength(length: number): ArrayPredicator<A> {
    return this.addValidator(createArrayMinLengthValidator(length))
  }

  maxLength(length: number): ArrayPredicator<A> {
    return this.addValidator(createArrayMaxLengthValidator(length))
  }

  includes(...searchElements: A): ArrayPredicator<A> {
    return this.addValidator(createArrayIncludesValidator(searchElements))
  }

  includesAny(...searchElements: A): ArrayPredicator<A> {
    return this.addValidator(createArrayIncludesAnyValidator(searchElements))
  }

  deepEqual<AA extends A>(expected: AA): ArrayPredicator<AA> {
    return this.addValidator(createArrayDeepEqualValidator(expected))
  }

  ofType<I extends A[number]>(
    predicator: Predicator<Predicate<I>>
  ): ArrayPredicator<I[]> {
    return this.addValidator(createArrayOfType(predicator))
  }
}

export function owArr() {
  return new ArrayPredicator()
}
