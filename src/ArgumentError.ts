const argumentErrorSymbol = Symbol('oww.ArgumentError')

export class ArgumentError extends Error {
  [argumentErrorSymbol] = true
  constructor(message: string, context: Function) {
    super(message)

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, context)
    }

    this.name = 'ArgumentError'
  }
}

export function isArgumentError(error: Error) {
  return !!error[argumentErrorSymbol]
}
