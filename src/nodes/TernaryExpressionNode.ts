import { BooleanType, CompoundType, MixedType, NeverType, Type } from 'formula-ts-helper';
import { stringValidator } from '../types';
import { ClassicPreset } from 'rete';
import { FormulaNode } from './FormulaNode';
import { AdvancedSocket } from 'rete-advanced-sockets-plugin';

export class TernaryExpressionNode extends FormulaNode {

  constructor() {
    super('TernaryExpression');
    const outputSocket = new AdvancedSocket<Type>(new NeverType());
    const conditionSocket = new AdvancedSocket<Type>(new BooleanType());
    const thenSocket = new AdvancedSocket<Type>(new MixedType());
    const elseSocket = new AdvancedSocket<Type>(new MixedType());

    const updateOutputType = () => {
      const types: Type[] = [];
      if (thenSocket.connectionInfo?.otherSocket) {
        types.push(thenSocket.connectionInfo.otherSocket.type as Type);
      }
      if (elseSocket.connectionInfo?.otherSocket) {
        types.push(elseSocket.connectionInfo.otherSocket.type as Type);
      }
      outputSocket.type = CompoundType.buildFromTypes(types);
    }

    thenSocket.addListener('onConnectionChanged', updateOutputType);
    elseSocket.addListener('onConnectionChanged', updateOutputType);

    const conditionInput = new ClassicPreset.Input(conditionSocket, 'Condition');
    const thenInput = new ClassicPreset.Input(thenSocket, 'Then');
    const elseInput = new ClassicPreset.Input(elseSocket, 'Else');
    const output = new ClassicPreset.Output(outputSocket);

    this.addInput('condition', conditionInput);
    this.addInput('then', thenInput);
    this.addInput('else', elseInput);
    this.addOutput('output', output);
  }

  override data(inputs: Record<string, string>): { output: string } {
    const validated = this.validateInputs(inputs, { condition: stringValidator, then: stringValidator, else: stringValidator });
    return {
      output: validated.condition + '?' + validated.then + ':' + validated.else,
    };
  }
}
