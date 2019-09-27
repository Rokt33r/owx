import { isValid, owShape, owStr } from '../src'

let a: unknown
let b: { message: string }
if (
  isValid(
    a,
    owShape({
      message: owStr()
    })
  )
) {
  b = a
}
