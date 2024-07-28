import { ClassicPreset } from 'rete';
import { Type } from 'formula-ts-helper';
import { FormulaNode } from './FormulaNode';
import { AdvancedSocket } from 'rete-advanced-sockets-plugin';
import { stringValidator } from '../types';

export class ResultNode extends FormulaNode {
  constructor(type: Type) {
    super('Result');
    const socket = new AdvancedSocket<Type>(type);
    const input = new ClassicPreset.Input(socket, 'result');
    this.addInput('input', input);
  }

  override data(inputs: Record<string, any>): { output: string } {
    const validated = this.validateInputs(inputs, { input: stringValidator });
    return { output: validated.input };
  }
}
