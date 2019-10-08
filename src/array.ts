import is from '@sindresorhus/is/dist'
import { Validator, Predicator, Predicate } from './owx'

const arrayValidator: Validator<any[]> = {
  validate: is.array,
  report(input) {
    return `Expected value to be an array, got \`${input}\``
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

  length(length: number): ArrayPredicator<A> {
    return this.addValidator(createArrayLengthValidator(length))
  }
}

export function owArr() {
  return new ArrayPredicator()
}
