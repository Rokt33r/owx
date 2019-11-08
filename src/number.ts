import is from '@sindresorhus/is'
import { Validator, Predicator, Predicate } from './owx'

const numberValidator: Validator<number> = {
  validate: is.number,
  report(input) {
    return `Expected value to be of type \`number\` but received \`${is(
      input
    )}\``
  }
}

function createNumberInrangeValidator(
  start: number,
  end: number
): Validator<number, number> {
  return {
    validate(input): input is number {
      return is.inRange(input, [start, end])
    },
    report(input) {
      return `Expected value to be in range [${start}...${end}], got ${input}`
    }
  }
}

function createNumberGreaterThanValidator(
  target: number
): Validator<number, number> {
  return {
    validate(input): input is number {
      return input > target
    },
    report(input) {
      return `Expected value to be greater than ${target}, got ${input}`
    }
  }
}

function createNumberGreaterThanOrEqualValidator(
  target: number
): Validator<number, number> {
  return {
    validate(input): input is number {
      return input >= target
    },
    report(input) {
      return `Expected value to be greater than or equal to ${target}, got ${input}`
    }
  }
}

function createNumberLessThanValidator(
  target: number
): Validator<number, number> {
  return {
    validate(input): input is number {
      return input < target
    },
    report(input) {
      return `Expected value to be less than ${target}, got ${input}`
    }
  }
}

function createNumberLessThanOrEqualValidator(
  target: number
): Validator<number, number> {
  return {
    validate(input): input is number {
      return input <= target
    },
    report(input) {
      return `Expected value to be less than or equal to ${target}, got ${input}`
    }
  }
}

function createNumberEqualValidator(target: number): Validator<number, number> {
  return {
    validate(input): input is number {
      return input === target
    },
    report(input) {
      return `Expected value to be equal to ${target}, got ${input}`
    }
  }
}

function createNumberOneOfValidator<A extends number[]>(
  expectedList: A
): Validator<A[number], number> {
  return {
    validate(input): input is A[number] {
      return expectedList.includes(input)
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

      return `Expected value to be one of \`${printedList}\`, got ${input}`
    }
  }
}

const numberIntegerValidator: Validator<number, number> = {
  validate(input): input is number {
    return is.integer(input)
  },
  report(input) {
    return `Expected value to be an integer, got ${input}`
  }
}

const numberFiniteValidator: Validator<number, number> = {
  validate(input): input is number {
    return !is.infinite(input)
  },
  report(input) {
    return `Expected value to be finite, got ${input}`
  }
}

const numberInfiniteValidator: Validator<number, number> = {
  validate(input): input is number {
    return is.infinite(input)
  },
  report(input) {
    return `Expected value to be infinite, got ${input}`
  }
}

const numberPositiveValidator: Validator<number, number> = {
  validate(input): input is number {
    return input > 0
  },
  report(input) {
    return `Expected value to be positive, got ${input}`
  }
}

const numberNegativeValidator: Validator<number, number> = {
  validate(input): input is number {
    return input < 0
  },
  report(input) {
    return `Expected value to be negative, got ${input}`
  }
}

const numberIntegerOrInfiniteValidator: Validator<number, number> = {
  validate(input): input is number {
    return is.integer(input) || is.infinite(input)
  },
  report(input) {
    return `Expected value to be an integer or infinite, got ${input}`
  }
}

class NumberPredicator<N extends number> implements Predicator<Predicate<N>> {
  constructor(validators: Validator<any>[] = [numberValidator]) {
    this.predicate = {
      validators
    }
  }
  predicate: Predicate<N>

  addValidator<SS extends number>(
    validator: Validator<SS, number>
  ): NumberPredicator<SS> {
    return new NumberPredicator<SS>([...this.predicate.validators, validator])
  }

  inRange(start: number, end: number) {
    return this.addValidator(createNumberInrangeValidator(start, end))
  }

  greaterThan(target: number) {
    return this.addValidator(createNumberGreaterThanValidator(target))
  }

  greaterThanOrEqual(target: number) {
    return this.addValidator(createNumberGreaterThanOrEqualValidator(target))
  }

  lessThan(target: number) {
    return this.addValidator(createNumberLessThanValidator(target))
  }

  lessThanOrEqual(target: number) {
    return this.addValidator(createNumberLessThanOrEqualValidator(target))
  }

  equal(target: number) {
    return this.addValidator(createNumberEqualValidator(target))
  }

  oneOf<A extends number[]>(expectedList: A) {
    return this.addValidator(createNumberOneOfValidator(expectedList))
  }

  integer() {
    return this.addValidator(numberIntegerValidator)
  }

  finite() {
    return this.addValidator(numberFiniteValidator)
  }

  infinite() {
    return this.addValidator(numberInfiniteValidator)
  }

  positive() {
    return this.addValidator(numberPositiveValidator)
  }

  negative() {
    return this.addValidator(numberNegativeValidator)
  }

  integerOrInfinite() {
    return this.addValidator(numberIntegerOrInfiniteValidator)
  }

  uint8() {
    return this.integer().inRange(0, 255)
  }

  uint16() {
    return this.integer().inRange(0, 65535)
  }

  uint32() {
    return this.integer().inRange(0, 4294967295)
  }

  int8() {
    return this.integer().inRange(-128, 127)
  }

  int16() {
    return this.integer().inRange(-32768, 32767)
  }
  int32() {
    return this.integer().inRange(-2147483648, 2147483647)
  }
}

export function owNum(): NumberPredicator<number> {
  return new NumberPredicator()
}
