import { isValid, owShape, owStr } from '../src'

function expectType<T>(value: T) {}

let a: unknown
if (
  isValid(
    a,
    owShape({
      message: owStr()
    })
  )
) {
  expectType<{ message: string; [key: string]: unknown }>(a)
}
