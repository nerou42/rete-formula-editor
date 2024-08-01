import { OuterFunctionArgument, OuterFunctionArgumentListType, Type } from 'formula-ts-helper';
import { EnumeratedNode } from './EnumeratedNode';
import { stringValidator } from '../types';
import { WrapperType } from '../WrapperType';

export class ArgumentListExpressionNode extends EnumeratedNode {

  constructor() {
    super('ArgumentListExpression');
  }

  getType(): WrapperType {
    const outerArguments = [];
    for (const type of this.argumentTypes) {
      outerArguments.push(new OuterFunctionArgument(type.type, false, false));
    }
    return new WrapperType(new OuterFunctionArgumentListType(outerArguments, false));
  }

  override data(inputs: Record<string, any>): { output: string } {
    let output = '', del = '';
    for (const key in inputs) {
      if (!Object.prototype.hasOwnProperty.call(inputs, key)) continue;
      const validated = this.validateInput(key, inputs[key], stringValidator);
      output += del + validated;
      del = ', ';
    }
    return { output };
  }
}
