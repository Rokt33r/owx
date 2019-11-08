import { ArgumentError } from './ArgumentError'

export interface Validator<O extends I, I = any> {
  validate(input: I, context: {}): input is O
  report(input: I, context: {}): string
}

export type PredicatorShape = {
  [key: string]: Predicator<Predicate<any>>
}

export type PredicateResult<P extends Predicate<any>> = P extends Predicate<
  infer T
>
  ? Unshape<T>
  : never

export type Unshape<S> = S extends PredicatorShape
  ? {
      [K in keyof S]: PredicateResult<ExtractPredicate<S[K]>>
    }
  : S

export type ExtractPredicate<PP extends Predicator<any>> = PP['predicate']

export interface Predicate<T> {
  validators: Validator<any>[]
}

export interface Predicator<P extends Predicate<any>> {
  predicate: P
}

export function isValid<P extends Predicate<any>>(
  input: any,
  predicator: Predicator<P>
): input is PredicateResult<P> {
  const context = {}
  for (const validator of predicator.predicate.validators) {
    const result = validator.validate(input, context)
    if (!result) {
      return false
    }
  }
  return true
}

export function validate<P extends Predicate<any>> (
  input: any,
  predicator: Predicator<P>
): asserts input is PredicateResult<P> {
  const context = {}
  for (const validator of predicator.predicate.validators) {
    const result = validator.validate(input, context)
    if (!result) {
      throw new ArgumentError(validator.report(input, context), validate)
    }
  }
}

export function reportValidation<P>(
  input: any,
  predicator: Predicator<Predicate<any>>
): string | null {
  const context = {}
  for (const validator of predicator.predicate.validators) {
    const result = validator.validate(input, context)
    if (!result) {
      return validator.report(input, context)
    }
  }
  return null
}
