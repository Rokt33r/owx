import is from '@sindresorhus/is/dist'
import { Validator, Predicator, Predicate } from './owx'

const arrayValidator: Validator<any[]> = {
  validate: is.array,
  report(input) {
    return `Expected value to be an array, got \`${input}\``
  }
}

const arrayEmptyValidator: Validator<any[], any[]> = {
  validate(input): input is any[] {
    return input.length === 0
  },
  report(input) {
    return `Expected value to be empty, got \`${JSON.stringify(input)}\``
  }
}

const arrayNonEmptyValidator: Validator<any[], any[]> = {
  validate(input): input is any[] {
    return input.length > 0
  },
  report(input) {
    return `Expected value to not be empty`
  }
}

function createArrayLengthValidator(length: number): Validator<any[], any[]> {
  return {
    validate(input): input is any[] {
      return input.length === length
    },
    report(input) {
      return `Expected value to have length \`${length}\`, got \`${input.length}\``
    }
  }
}

function createArrayMinLengthValidator(
  length: number
): Validator<any[], any[]> {
  return {
    validate(input): input is any[] {
      return input.length >= length
    },
    report(input) {
      return `Expected value to have a minimum length \`${length}\`, got \`${input.length}\``
    }
  }
}
function createArrayMaxLengthValidator(
  length: number
): Validator<any[], any[]> {
  return {
    validate(input): input is any[] {
      return input.length <= length
    },
    report(input) {
      return `Expected value to have a maximum length \`${length}\`, got \`${input.length}\``
    }
  }
}

class ArrayPredicator<A extends any[]> implements Predicator<Predicate<any[]>> {
  constructor(validators: Validator<any>[] = [arrayValidator]) {
    this.predicate = {
      validators
    }
  }

  predicate: Predicate<A>

  addValidator<AA extends any[]>(validator: Validator<AA, any[]>) {
    return new ArrayPredicator<AA>([...this.predicate.validators, validator])
  }

  empty(): ArrayPredicator<A> {
    return this.addValidator(arrayEmptyValidator)
  }

  nonEmpty(): ArrayPredicator<A> {
    return this.addValidator(arrayNonEmptyValidator)
  }

  length(length: number): ArrayPredicator<A> {
    return this.addValidator(createArrayLengthValidator(length))
  }

  minLength(length: number): ArrayPredicator<A> {
    return this.addValidator(createArrayMinLengthValidator(length))
  }

  maxLength(length: number): ArrayPredicator<A> {
    return this.addValidator(createArrayMaxLengthValidator(length))
  }
}

export function owArr() {
  return new ArrayPredicator()
}
