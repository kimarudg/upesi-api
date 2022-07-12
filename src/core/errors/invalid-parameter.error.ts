export class InvalidParameterError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'InvalidParameterError';
  }
}
