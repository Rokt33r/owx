import { Validator, Predicator, Predicate } from './owx'
import is from '@sindresorhus/is'

const stringValidator: Validator<string> = {
  validate: is.string,
  report(input) {
    return `Expected value to be string, got \`${input}\``
  }
}

function createStringLengthValidator(
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

function createStringMinLengthValidator(
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

function createStringMaxLengthValidator(
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

function createStringMatchValidator(regExp: RegExp): Validator<string, string> {
  return {
    validate(input): input is string {
      return regExp.test(input)
    },
    report(input) {
      return `Expected value to match \`${regExp}\`, got \`${input}\``
    }
  }
}

function createStringStartsWithValidator(
  searchString: string
): Validator<string, string> {
  return {
    validate(input): input is string {
      return input.startsWith(searchString)
    },
    report(input) {
      return `Expected value to start with \`${searchString}\`, got \`${input}\``
    }
  }
}

function createStringEndsWithValidator(
  searchString: string
): Validator<string, string> {
  return {
    validate(input): input is string {
      return input.endsWith(searchString)
    },
    report(input) {
      return `Expected value to end with \`${searchString}\`, got \`${input}\``
    }
  }
}

function createStringIncludesValidator(
  searchString: string
): Validator<string, string> {
  return {
    validate(input): input is string {
      return input.includes(searchString)
    },
    report(input) {
      return `Expected value to include \`${searchString}\`, got \`${input}\``
    }
  }
}

function createStringOneOfValidator<A extends string[]>(
  expectedList: A
): Validator<A[number], string> {
  return {
    validate(input): input is A[number] {
      return expectedList.some(searchString => searchString === input)
    },
    report(input) {
      const limit = 10
      const overflow = expectedList.length - limit
      const printedList =
        expectedList.length > limit
          ? JSON.stringify(expectedList.slice(0, limit)).replace(
              /]$/,
              `,…+${overflow} more]`
            )
          : JSON.stringify(expectedList)

      return `Expected value to be one of \`${printedList}\`, got \`${input}\``
    }
  }
}

const stringEmptyValidator: Validator<'', string> = {
  validate(input: string): input is '' {
    return input === ''
  },
  report(input) {
    return `Expected value to be empty, got \`${input}\``
  }
}

const stringNonEmptyValidator: Validator<string, string> = {
  validate(input: string): input is '' {
    return input !== ''
  },
  report(input) {
    return `Expected value to not be empty`
  }
}

function createStringEqualsValidator<S extends string>(
  expected: S
): Validator<S, string> {
  return {
    validate(input): input is S {
      return input === expected
    },
    report(input) {
      return `Expected value to be equal to \`${expected}\`, got \`${input}\``
    }
  }
}

const stringAlphanumericValidator: Validator<string, string> = {
  validate(input: string): input is string {
    return /^[a-z\d]+$/gi.test(input)
  },
  report(input) {
    return `Expected value to be alphanumeric, got \`${input}\``
  }
}

const stringAlphabeticalValidator: Validator<string, string> = {
  validate(input: string): input is string {
    return /^[a-z]+$/gi.test(input)
  },
  report(input) {
    return `Expected value to be alphabetical, got \`${input}\``
  }
}

const stringNumericValidator: Validator<string, string> = {
  validate(input: string): input is string {
    return /^(\+|-)?\d+$/i.test(input)
  },
  report(input) {
    return `Expected value to be numeric, got \`${input}\``
  }
}

const stringDateValidator: Validator<string, string> = {
  validate(input: string): input is string {
    return !isNaN(Date.parse(input))
  },
  report(input) {
    return `Expected value to be a date, got \`${input}\``
  }
}

const stringLowercaseValidator: Validator<string, string> = {
  validate(input: string): input is string {
    return input.trim() !== '' && input === input.toLowerCase()
  },
  report(input) {
    return `Expected value to be lowercase, got \`${input}\``
  }
}

const stringUppercaseValidator: Validator<string, string> = {
  validate(input: string): input is string {
    return input.trim() !== '' && input === input.toUpperCase()
  },
  report(input) {
    return `Expected value to be uppercase, got \`${input}\``
  }
}

const stringUrlValidator: Validator<string, string> = {
  validate(input: string): input is string {
    return is.urlString(input)
  },
  report(input) {
    return `Expected value to be a URL, got \`${input}\``
  }
}

class StringPredicator<S extends string> implements Predicator<Predicate<S>> {
  constructor(validators: Validator<any>[] = [stringValidator]) {
    this.predicate = {
      validators
    }
  }
  predicate: Predicate<S>

  addValidator<SS extends string>(
    validator: Validator<SS, string>
  ): StringPredicator<SS> {
    return new StringPredicator<SS>([...this.predicate.validators, validator])
  }

  length(length: number): StringPredicator<S> {
    return this.addValidator(createStringLengthValidator(length))
  }

  min(length: number): StringPredicator<S> {
    return this.addValidator(createStringMinLengthValidator(length))
  }

  max(length: number): StringPredicator<S> {
    return this.addValidator(createStringMaxLengthValidator(length))
  }

  match(regExp: RegExp): StringPredicator<S> {
    return this.addValidator(createStringMatchValidator(regExp))
  }

  startsWith(searchString: string): StringPredicator<S> {
    return this.addValidator(createStringStartsWithValidator(searchString))
  }

  endsWith(searchString: string): StringPredicator<S> {
    return this.addValidator(createStringEndsWithValidator(searchString))
  }

  includes(searchString: string): StringPredicator<S> {
    return this.addValidator(createStringIncludesValidator(searchString))
  }

  oneOf<A extends string[]>(...expectedList: A): StringPredicator<A[number]> {
    return this.addValidator(createStringOneOfValidator(expectedList))
  }

  empty(): StringPredicator<''> {
    return this.addValidator(stringEmptyValidator)
  }

  nonEmpty(): StringPredicator<S> {
    return this.addValidator(stringNonEmptyValidator)
  }

  equals<SS extends string>(expected: SS): StringPredicator<SS> {
    return this.addValidator(createStringEqualsValidator(expected))
  }

  alphanumeric(): StringPredicator<S> {
    return this.addValidator(stringAlphanumericValidator)
  }

  alphabetical(): StringPredicator<S> {
    return this.addValidator(stringAlphabeticalValidator)
  }

  numeric(): StringPredicator<S> {
    return this.addValidator(stringNumericValidator)
  }

  date(): StringPredicator<S> {
    return this.addValidator(stringDateValidator)
  }

  lowercase(): StringPredicator<S> {
    return this.addValidator(stringLowercaseValidator)
  }

  uppercase(): StringPredicator<S> {
    return this.addValidator(stringUppercaseValidator)
  }

  url(): StringPredicator<S> {
    return this.addValidator(stringUrlValidator)
  }
}

export function owStr(): StringPredicator<string> {
  return new StringPredicator()
}
