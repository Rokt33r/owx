import is from '@sindresorhus/is'
import {
  Validator,
  PredicateShape,
  ValidatedObject,
  Predicate,
  reportValidation
} from './owx'

export const objectValidator: Validator<object> = {
  validate: is.object,
  report(input) {
    return `Expected to be object, got '${input}'`
  }
}

export function createObjectShapeValidator<P extends PredicateShape>(
  shape: P
): Validator<ValidatedObject<P>, object> {
  const messageSymbol = Symbol()
  return {
    validate(input, context): input is ValidatedObject<P> {
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

export class ObjectPredicate<T extends object> extends Predicate<T> {
  validators = [objectValidator]

  addValidator<O extends object>(
    validator: Validator<O, object>
  ): ObjectPredicate<O> {
    this.validators.push(validator)
    return this
  }

  shape<P extends PredicateShape>(shape: P): ObjectPredicate<P> {
    const validator = createObjectShapeValidator(shape)
    return this.addValidator(validator)
  }
}

export function owObj() {
  return new ObjectPredicate()
}
