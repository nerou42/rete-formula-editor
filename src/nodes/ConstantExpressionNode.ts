import { Type } from 'formula-ts-helper';
import { GenericConstantValueParser } from '../ConstantValueToControl';
import { ClassicPreset } from 'rete';
import { FormulaControl } from '../controls/FormulaControl';
import { FormulaNode } from './FormulaNode';
import { AdvancedSocket } from 'rete-advanced-sockets-plugin';
import { WrapperType } from '../WrapperType';

export class ConstantExpressionNode extends FormulaNode {

  private readonly control: FormulaControl<any>;

  constructor(controlFactory: GenericConstantValueParser, type: Type, value?: string) {
    super(type.toString() + ' Constant');
    this.control = controlFactory.parseConstantValue(type, value);
    this.addControl('', this.control);
    const socket = new AdvancedSocket<WrapperType>(new WrapperType(type));
    this.addOutput('output', new ClassicPreset.Output(socket, 'value'));
  }

  get value(): string {
    return this.control.value;
  }

  set value(value: string) {
    this.control.value = value;
  }

  override data(inputs: Record<string, any>): { output: string } {
    return {
      output: this.control.getStringSource(),
    };
  }
}