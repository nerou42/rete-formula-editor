import { BooleanType, CompoundType, MixedType, NeverType, Type } from 'formula-ts-helper';
import { stringValidator } from '../types';
import { ClassicPreset } from 'rete';
import { FormulaNode } from './FormulaNode';
import { AdvancedSocket } from 'rete-advanced-sockets-plugin';
import { WrapperType } from '../WrapperType';

export class TernaryExpressionNode extends FormulaNode {

  constructor() {
    super('TernaryExpression');
    const outputSocket = new AdvancedSocket<WrapperType>(new WrapperType(new NeverType()));
    const conditionSocket = new AdvancedSocket<WrapperType>(new WrapperType(new BooleanType()));
    const thenSocket = new AdvancedSocket<WrapperType>(new WrapperType(new MixedType()));
    const elseSocket = new AdvancedSocket<WrapperType>(new WrapperType(new MixedType()));

    const updateOutputType = () => {
      const types: Type[] = [];
      if (thenSocket.connectionInfo?.otherSocket) {
        types.push(thenSocket.connectionInfo.otherSocket.type.type);
      }
      if (elseSocket.connectionInfo?.otherSocket) {
        types.push(elseSocket.connectionInfo.otherSocket.type.type);
      }
      outputSocket.type = new WrapperType(CompoundType.buildFromTypes(types));
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
