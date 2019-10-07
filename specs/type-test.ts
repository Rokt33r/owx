import { isValid, owShape, owStr, owx } from '../src'

function expectType<T>(value: T) {}

let unknownValue: unknown

// owStr#equals
if (isValid(unknownValue, owStr().equals('a'))) {
  expectType<'a'>(unknownValue)
}

// owStr#oneOf
if (isValid(unknownValue, owStr().oneOf('a', 'b'))) {
  expectType<'a' | 'b'>(unknownValue)
}

// owShape
if (
  isValid(
    unknownValue,
    owShape({
      message: owStr()
    })
  )
) {
  expectType<{ message: string; [key: string]: unknown }>(unknownValue)
}

// owShape(exact)
if (
  isValid(
    unknownValue,
    owShape(
      {
        message: owStr()
      },
      true
    )
  )
) {
  expectType<{ message: string }>(unknownValue)
}

// owAny
if (isValid(unknownValue, owx.any(owStr().equals('a'), owStr().equals('b')))) {
  expectType<'a' | 'b'>(unknownValue)
}
