import { ArrayType, CompoundType, IntegerType, OuterFunctionArgument, OuterFunctionArgumentListType, Type } from 'formula-ts-helper';
import { EnumeratedNode } from './EnumeratedNode';
import { InvalidNodeError } from '../invalidNodeError';
import { stringValidator } from '../types';
import { WrapperType } from '../WrapperType';

export class ArrayExpressionNode extends EnumeratedNode {

  constructor() {
    super('ArrayExpression');
  }

  getType(): WrapperType {
    return new WrapperType(new ArrayType(new IntegerType(), CompoundType.buildFromTypes(this.argumentTypes.map(t => t.type))));
  }

  override data(inputs: Record<string, any>): { output: string } {
    let output = '', del = '';
    let i = 0;
    for (const key in inputs) {
      if (!Object.prototype.hasOwnProperty.call(inputs, key)) continue;
      const validated = this.validateInput(key, inputs[key], stringValidator);
      output += del + validated;
      del = ', ';
      i++;
    }
    if(i !== this.argumentTypes.length) {
      throw new InvalidNodeError('Array doesn\'t have all inputs connected', this.id);
    }
    return {
      output: '{' + output + '}',
    };
  }
}
