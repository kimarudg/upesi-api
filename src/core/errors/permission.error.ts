export class PermissionError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}
