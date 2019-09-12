import { ArgumentError } from './ArgumentError'

export interface Validator<O extends I, I = any> {
  validate(input: I, context: {}): input is O
  report(input: I, context: {}): string
}

export type PredicateShape = {
  [key: string]: Predicate<any>
}

export type PredicateResult<P extends Predicate> = P extends Predicate<infer T>
  ? T
  : never

export type ValidatedObject<S extends PredicateShape> = {
  [K in keyof S]: PredicateResult<S[K]>
}

export interface Predicate2<T = unknown> {
  validators: Validator<any>[]
  addValidator<O extends T>(validator: Validator<O, T>): Predicate<O>
}

export class Predicate<T = unknown> {
  validators: Validator<any>[] = []
}

export function isValid<P>(input: any, predicate: Predicate<P>): input is P {
  const context = {}
  for (const validator of predicate.validators) {
    const result = validator.validate(input, context)
    if (!result) {
      return false
    }
  }
  return true
}

export function validate<P>(input: any, predicate: Predicate<P>): void {
  const context = {}
  for (const validator of predicate.validators) {
    const result = validator.validate(input, context)
    if (!result) {
      throw new ArgumentError(validator.report(input, context), validate)
    }
  }
}

export function reportValidation<P>(
  input: any,
  predicate: Predicate<P>
): string | null {
  const context = {}
  for (const validator of predicate.validators) {
    const result = validator.validate(input, context)
    if (!result) {
      return validator.report(input, context)
    }
  }
  return null
}
