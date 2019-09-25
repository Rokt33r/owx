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
    return `Expected to be object, got '${input}'`
  }
}

export function createObjectShapeValidator<P extends PredicatorShape>(
  shape: P
): Validator<Unshape<P>, object> {
  const messageSymbol = Symbol()
  return {
    validate(input, context): input is Unshape<P> {
      for (const key of Object.keys(shape)) {
        const message = reportValidation(input, shape[key])
        if (message != null) {
          context[messageSymbol] = { key, message }
          return false
        }
      }
      return true
    },
    report(input, context) {
      const { key, message } = context[messageSymbol]
      return message.replace(/^Expected/, `Expected property, '${key}',`)
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

  shape<S extends PredicatorShape>(shape: S) {
    return new ObjectPredicator<S & O>([
      ...this.predicate.validators,
      createObjectShapeValidator(shape)
    ])
  }
}

export function owObj() {
  return new ObjectPredicator()
}

export function owShape<S extends PredicatorShape>(shape: S) {
  return owObj().shape(shape)
}
