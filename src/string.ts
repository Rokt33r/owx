import { Validator, Predicator, Predicate } from './owx'
import is from '@sindresorhus/is'

export const stringValidator: Validator<string> = {
  validate: is.string,
  report(input) {
    return `Expected value to be string, got \`${input}\``
  }
}

export function createStringLengthValidator(
  length: number
): Validator<string, string> {
  return {
    validate(input): input is string {
      return input.length === length
    },
    report(input) {
      return `Expected value to have length \`${length}\`, got \`${input.length}\``
    }
  }
}

export function createStringMinLengthValidator(
  length: number
): Validator<string, string> {
  return {
    validate(input): input is string {
      return input.length >= length
    },
    report(input) {
      return `Expected value to have a minimum length of \`${length}\`, got \`${input}\``
    }
  }
}

export function createStringMaxLengthValidator(
  length: number
): Validator<string, string> {
  return {
    validate(input): input is string {
      return input.length <= length
    },
    report(input) {
      return `Expected value to have a maximum length of \`${length}\`, got \`${input}\``
    }
  }
}

export function createStringMatchValidator(
  regExp: RegExp
): Validator<string, string> {
  return {
    validate(input): input is string {
      return input.length <= length
    },
    report(input) {
      return `Expected value to match \`${regExp}\`, got \`${input}\``
    }
  }
}

class StringPredicator implements Predicator<Predicate<string>> {
  constructor(validators: Validator<any>[] = [stringValidator]) {
    this.predicate = {
      validators
    }
  }
  predicate: Predicate<string>

  length(length: number) {
    return new StringPredicator([
      ...this.predicate.validators,
      createStringLengthValidator(length)
    ])
  }
  // min(length: number): StringPredicate

  // max(length: number): StringPredicate

  // match(regExp: RegExp): StringPredicate
}

export function owStr(): StringPredicator {
  return new StringPredicator()
}
