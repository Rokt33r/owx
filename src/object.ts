import is from '@sindresorhus/is'
import {
  Validator,
  PredicatorShape,
  Unshape,
  Predicator,
  reportValidation,
  Predicate
} from './owx'

export const objectValidator: Validator<object> = {
  validate: is.object,
  report(input) {
    return `Expected value to be object, got \`${input}\``
  }
}

const valueErrorRegexp = /^Expected value/
const propertyErrorRegexp = /^Expected property, `(.+)`,/

export function createObjectPartialShapeValidator<P extends PredicatorShape>(
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

class ObjectPredicator<O extends object>
  implements Predicator<Predicate<object>> {
  constructor(validators: Validator<any>[] = [objectValidator]) {
    this.predicate = {
      validators
    }
  }
  predicate: Predicate<O>

  partialShape<S extends PredicatorShape>(shape: S) {
    return new ObjectPredicator<O & Unshape<S> & { [key: string]: unknown }>([
      ...this.predicate.validators,
      createObjectPartialShapeValidator(shape)
    ])
  }

  exactShape<S extends PredicatorShape>(shape: S) {
    return new ObjectPredicator<O & Unshape<S>>([
      ...this.predicate.validators,
      createObjectExactShapeValidator(shape)
    ])
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
