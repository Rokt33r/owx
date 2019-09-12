import { Validator, Predicate } from './owx'
import is from '@sindresorhus/is'

export const stringValidator: Validator<string> = {
  validate: is.string,
  report(input) {
    return `Expected to be string, got '${input}'`
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
      return `Expected to have length '${length}', got '${input.length}'`
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
      return `Expected to have a minimum length of '${length}', got '${input}'`
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
      return `Expected to have a maximum length of '${length}', got '${input}'`
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
      return `Expected to match '${regExp}', got '${input}'`
    }
  }
}

export class StringPredicate extends Predicate {
  addValidator(validator: Validator<string, string>) {
    this.validators.push(validator)
    return this
  }
  length(length: number) {
    return this.addValidator(createStringLengthValidator(length))
  }

  min(length: number) {
    return this.addValidator(createStringMinLengthValidator(length))
  }

  max(length: number) {
    return this.addValidator(createStringMaxLengthValidator(length))
  }

  match(regExp: RegExp) {
    return this.addValidator(createStringMatchValidator(regExp))
  }
}

export function owStr() {
  return new StringPredicate().addValidator(stringValidator)
}
