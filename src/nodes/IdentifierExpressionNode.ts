import { MixedType, Type } from 'formula-ts-helper';
import { SelectControl } from '../controls/SelectControl';
import { ClassicPreset } from 'rete';
import { FormulaNode } from './FormulaNode';
import { InvalidNodeError } from '../invalidNodeError';
import { Scope } from '../types';
import { AdvancedSocket } from 'rete-advanced-sockets-plugin';

export class IdentifierExpressionNode extends FormulaNode {

  private readonly identifierControl: SelectControl<string>;

  constructor(scope: Scope, selectedIdentifier?: string) {
    super('IdentifierExpression');
    const options = [];
    for (const key in scope) {
      if (Object.prototype.hasOwnProperty.call(scope, key)) {
        options.push({ label: key, value: key });
      }
    }
    const socket = new AdvancedSocket<Type>(new MixedType());
    const output = new ClassicPreset.Output(socket, 'output');
    this.identifierControl = new SelectControl(options);
    if(selectedIdentifier) {
      this.identifierControl.value = selectedIdentifier;
    }
    this.addControl('identifier', this.identifierControl);
    this.addOutput('output', output);
  }

  override data(inputs: Record<string, any>): { output: string } {
    const value = this.identifierControl.value;
    if(value === undefined) {
      throw new InvalidNodeError('Identifier must be selected', this.id);
    }
    return {
      output: value,
    };
  }
}
