export class ResourceNotFoundError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'ResourceNotFoundError';
  }
}
