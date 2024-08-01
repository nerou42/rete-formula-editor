import { Type, TypeType } from 'formula-ts-helper';
import { ClassicPreset } from 'rete';
import { FormulaNode } from './FormulaNode';
import { AdvancedSocket } from 'rete-advanced-sockets-plugin';
import { WrapperType } from '../WrapperType';

export class ConstantTypeNode extends FormulaNode {

  private readonly type: Type;

  constructor(type: Type) {
    super(type.toString());
    this.type = type;
    const outputSocket = new AdvancedSocket<WrapperType>(new WrapperType(type));
    const output = new ClassicPreset.Output(outputSocket);
    this.addOutput('output', output);
  }

  override async data(inputs: Record<string, any>): Promise<{ output: TypeType }> {
    return { output: new TypeType(this.type) };
  }
}
