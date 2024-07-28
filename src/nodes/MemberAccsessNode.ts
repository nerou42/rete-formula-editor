import { ClassicPreset } from 'rete';
import { StringControl } from '../controls/StringControl';
import { MemberAccsessType, Type } from 'formula-ts-helper';
import { FormulaNode } from './FormulaNode';
import { AdvancedSocket } from 'rete-advanced-sockets-plugin';

export class MemberAccsessNode extends FormulaNode {

  private memberControl: StringControl;

  constructor(member: string = '') {
    super('MemberAccsess');
    this.memberControl = new StringControl(member);
    this.addControl('member', this.memberControl);
    const socket = new AdvancedSocket<Type>(new MemberAccsessType(this.memberControl.value));
    const output = new ClassicPreset.Output(socket);
    this.addOutput('output', output);
  }

  override data(inputs: Record<string, any>): { output: string } {
    return {
      output: this.memberControl.value
    };
  }
}
