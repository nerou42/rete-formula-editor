export class InvalidNodeError extends Error {
  constructor(message: string, public readonly nodeID: string, public readonly input?: string) {
    super(message); 
  }
}