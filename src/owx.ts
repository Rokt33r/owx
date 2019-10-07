import { ArgumentError } from './ArgumentError'
import { owStr } from './string'

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

export function validate(
  input: any,
  predicator: Predicator<Predicate<any>>
): void {
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

export const owx = {
  any,
  anyx
}

function anyx<T>(
  ...predicators: Predicator<Predicate<any>>[]
): Predicator<Predicate<T>> {
  const messagesSymbol = Symbol()
  const validator: Validator<any> = {
    validate(input, context): input is any {
      const messages = []
      for (const predicator of predicators) {
        const message = reportValidation(input, predicator)
        if (message == null) return true
        messages.push(message)
      }
      context[messagesSymbol] = messages
      return false
    },
    report(_input, context) {
      const messages: string[] = context[messagesSymbol]
      return [
        `Expected value to match any of following conditions`,
        ...messages.map(message => `- ${message.replace(/\n/g, '\n  ')}`)
      ].join('\n')
    }
  }
  return {
    predicate: {
      validators: [validator]
    }
  }
}

function any<T1>(
  predicator1: Predicator<Predicate<T1>>
): Predicator<Predicate<T1>>
function any<T1, T2>(
  predicator1: Predicator<Predicate<T1>>,
  predicator2: Predicator<Predicate<T2>>
): Predicator<Predicate<T1 | T2>>
function any<T1, T2, T3>(
  predicator1: Predicator<Predicate<T1>>,
  predicator2: Predicator<Predicate<T2>>,
  predicator3: Predicator<Predicate<T3>>
): Predicator<Predicate<T1 | T2 | T3>>
function any<T1, T2, T3, T4>(
  predicator1: Predicator<Predicate<T1>>,
  predicator2: Predicator<Predicate<T2>>,
  predicator3: Predicator<Predicate<T3>>,
  predicator4: Predicator<Predicate<T4>>
): Predicator<Predicate<T1 | T2 | T3 | T4>>
function any<T1, T2, T3, T4, T5>(
  predicator1: Predicator<Predicate<T1>>,
  predicator2: Predicator<Predicate<T2>>,
  predicator3: Predicator<Predicate<T3>>,
  predicator4: Predicator<Predicate<T4>>,
  predicator5: Predicator<Predicate<T5>>
): Predicator<Predicate<T1 | T2 | T3 | T4 | T5>>
function any<T1, T2, T3, T4, T5, T6>(
  predicator1: Predicator<Predicate<T1>>,
  predicator2: Predicator<Predicate<T2>>,
  predicator3: Predicator<Predicate<T3>>,
  predicator4: Predicator<Predicate<T4>>,
  predicator5: Predicator<Predicate<T5>>,
  predicator6: Predicator<Predicate<T6>>
): Predicator<Predicate<T1 | T2 | T3 | T4 | T5 | T6>>
function any<T1, T2, T3, T4, T5, T6, T7>(
  predicator1: Predicator<Predicate<T1>>,
  predicator2: Predicator<Predicate<T2>>,
  predicator3: Predicator<Predicate<T3>>,
  predicator4: Predicator<Predicate<T4>>,
  predicator5: Predicator<Predicate<T5>>,
  predicator6: Predicator<Predicate<T6>>,
  predicator7: Predicator<Predicate<T7>>
): Predicator<Predicate<T1 | T2 | T3 | T4 | T5 | T6 | T7>>
function any<T1, T2, T3, T4, T5, T6, T7, T8>(
  predicator1: Predicator<Predicate<T1>>,
  predicator2: Predicator<Predicate<T2>>,
  predicator3: Predicator<Predicate<T3>>,
  predicator4: Predicator<Predicate<T4>>,
  predicator5: Predicator<Predicate<T5>>,
  predicator6: Predicator<Predicate<T6>>,
  predicator7: Predicator<Predicate<T7>>,
  predicator8: Predicator<Predicate<T8>>
): Predicator<Predicate<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8>>
function any<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  predicator1: Predicator<Predicate<T1>>,
  predicator2: Predicator<Predicate<T2>>,
  predicator3: Predicator<Predicate<T3>>,
  predicator4: Predicator<Predicate<T4>>,
  predicator5: Predicator<Predicate<T5>>,
  predicator6: Predicator<Predicate<T6>>,
  predicator7: Predicator<Predicate<T7>>,
  predicator8: Predicator<Predicate<T8>>,
  predicator9: Predicator<Predicate<T9>>
): Predicator<Predicate<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9>>
function any<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
  predicator1: Predicator<Predicate<T1>>,
  predicator2: Predicator<Predicate<T2>>,
  predicator3: Predicator<Predicate<T3>>,
  predicator4: Predicator<Predicate<T4>>,
  predicator5: Predicator<Predicate<T5>>,
  predicator6: Predicator<Predicate<T6>>,
  predicator7: Predicator<Predicate<T7>>,
  predicator8: Predicator<Predicate<T8>>,
  predicator9: Predicator<Predicate<T9>>,
  predicator10: Predicator<Predicate<T10>>
): Predicator<Predicate<T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10>>
function any(
  ...predicators: Predicator<Predicate<any>>[]
): Predicator<Predicate<any>> {
  return anyx(...predicators)
}
