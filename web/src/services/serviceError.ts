export default class ServiceError extends Error {
  fieldErrors?: Record<string, string>

  constructor(message: string, fieldErrors?: Record<string, string>) {
    super(message)
    this.fieldErrors = fieldErrors
  }
}
