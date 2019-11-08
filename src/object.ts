import is from '@sindresorhus/is'
import {
  Validator,
  PredicatorShape,
  Unshape,
  Predicator,
  reportValidation,
  Predicate
} from './owx'
import isEqual from 'lodash.isequal'

const objectValidator: Validator<object> = {
  validate: is.object,
  report(input) {
    return `Expected value to be of type \`Object\` but received \`${is(
      input
    )}\``
  }
}

const valueErrorRegexp = /^Expected value/
const propertyErrorRegexp = /^Expected property, `(.+)`,/

function createObjectPartialShapeValidator<P extends PredicatorShape>(
  shape: P
): Validator<Unshape<P> & { [key: string]: unknown }, object> {
  const messageSymbol = Symbol()
  return {
    validate(input, context): input is Unshape<P> {
      for (const key of Object.keys(shape)) {
        const message = reportValidation(input[key], shape[key])

        if (message != null) {
          context[messageSymbol] = { key, message }
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

const ExtraKeyErrorType = 'EXTRA_KEY'
const InvalidValueErrorType = 'INVALID_VALUE'

export function createObjectExactShapeValidator<P extends PredicatorShape>(
  shape: P
): Validator<Unshape<P>, object> {
  const messageSymbol = Symbol()
  return {
    validate(input, context): input is Unshape<P> {
      const inputKeySet = new Set(Object.keys(input))
      for (const key of Object.keys(shape)) {
        const message = reportValidation(input[key], shape[key])
        inputKeySet.delete(key)

        if (message != null) {
          context[messageSymbol] = {
            type: InvalidValueErrorType,
            key,
            message
          }
          return false
        }

        inputKeySet.delete(key)
      }

      if (inputKeySet.size > 0) {
        const missingKey = [...inputKeySet][0]
        context[messageSymbol] = {
          type: ExtraKeyErrorType,
          message: `Expected property, \`${missingKey}\`, not to exist, got \`${input[missingKey]}\``
        }
        return false
      }

      return true
    },
    report(_input, context) {
      const { type, key, message } = context[messageSymbol]

      if (type === ExtraKeyErrorType) {
        return message
      }

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

const objectPlainValidator: Validator<object, object> = {
  validate(input): input is object {
    return is.plainObject(input)
  },
  report() {
    return `Expected value to be a plain object`
  }
}

const objectEmptyValidator: Validator<object, object> = {
  validate(input): input is object {
    return Object.keys(input).length === 0
  },
  report(input) {
    return `Expected value to be empty, got \`${JSON.stringify(input)}\``
  }
}

const objectNonEmptyValidator: Validator<object, object> = {
  validate(input): input is object {
    return Object.keys(input).length > 0
  },
  report() {
    return `Expected value to not be empty`
  }
}

type ValuesOfType<O> = { [key: string]: O }

function createObjectValuesOfType<O>(
  predicator: Predicator<Predicate<O>>
): Validator<ValuesOfType<O>, object> {
  const messageSymbol = Symbol()
  return {
    validate(input, context): input is ValuesOfType<O> {
      for (const key in input) {
        const message = reportValidation(input[key], predicator)
        if (message != null) {
          context[messageSymbol] = {
            key,
            message
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

function createObjectDeepEqual<O extends object>(
  expected: O
): Validator<O, object> {
  return {
    validate(input): input is O {
      return isEqual(input, expected)
    },
    report(input) {
      return `Expected value to be deeply equal to \`${JSON.stringify(
        expected
      )}\`, got \`${JSON.stringify(input)}\``
    }
  }
}

function createObjectInstanceOfValidator<F extends Function>(
  instance: F
): Validator<F, object> {
  return {
    validate(input): input is F {
      return input instanceof instance
    },
    report(input) {
      let { name } = input.constructor

      if (!name || name === 'Object') {
        name = JSON.stringify(input)
      }
      return `Expected value to be instance of \`${instance.name}\`, got \`${name}\``
    }
  }
}

class ObjectPredicator<O extends object>
  implements Predicator<Predicate<object>> {
  constructor(validators: Validator<any>[] = [objectValidator]) {
    this.predicate = {
      validators
    }
  }
  predicate: Predicate<O>

  addValidator<OO extends object>(validator: Validator<OO, object>) {
    return new ObjectPredicator<OO>([...this.predicate.validators, validator])
  }

  partialShape<S extends PredicatorShape>(
    shape: S
  ): ObjectPredicator<O & Unshape<S> & { [key: string]: unknown }> {
    return this.addValidator(createObjectPartialShapeValidator(shape))
  }

  exactShape<S extends PredicatorShape>(
    shape: S
  ): ObjectPredicator<O & Unshape<S>> {
    return this.addValidator(createObjectExactShapeValidator(shape))
  }

  shape<S extends PredicatorShape>(
    shape: S,
    exact: true
  ): ObjectPredicator<O & Unshape<S>>
  shape<S extends PredicatorShape>(
    shape: S,
    exact?: false
  ): ObjectPredicator<O & Unshape<S> & { [key: string]: unknown }>
  shape<S extends PredicatorShape>(shape: S, exact: boolean = false) {
    if (exact) {
      return this.exactShape(shape)
    }
    return this.partialShape(shape)
  }

  plain(): ObjectPredicator<O> {
    return this.addValidator(objectPlainValidator)
  }

  empty(): ObjectPredicator<O> {
    return this.addValidator(objectEmptyValidator)
  }

  nonEmpty(): ObjectPredicator<O> {
    return this.addValidator(objectNonEmptyValidator)
  }

  valuesOfType<OO>(
    predicator: Predicator<Predicate<O>>
  ): ObjectPredicator<ValuesOfType<OO>> {
    return this.addValidator(createObjectValuesOfType(predicator))
  }

  deepEqual<OO extends O>(expected: OO): ObjectPredicator<OO> {
    return this.addValidator(createObjectDeepEqual(expected))
  }

  instanceOf<F extends Function>(instance: F): ObjectPredicator<F> {
    return this.addValidator(createObjectInstanceOfValidator(instance))
  }
}

export function owObj() {
  return new ObjectPredicator()
}

export function owShape<S extends PredicatorShape>(
  shape: S,
  exact: true
): ObjectPredicator<Unshape<S>>
export function owShape<S extends PredicatorShape>(
  shape: S,
  exact?: false
): ObjectPredicator<Unshape<S> & { [key: string]: unknown }>
export function owShape<S extends PredicatorShape>(
  shape: S,
  exact: boolean = false
) {
  if (exact) {
    return owObj().exactShape(shape)
  }
  return owObj().partialShape(shape)
}
