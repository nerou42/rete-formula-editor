import { Control, NonUndefined, TransformTypes, TypeValidator, TypeValidators } from "../types";
import { InvalidNodeError } from "../invalidNodeError";
import { AdvancedSocket } from "rete-advanced-sockets-plugin";
import { AutoUpdateNode } from "../dead-connection-removal-plugin/AutoUpdateNode";
import { WrapperType } from "../WrapperType";
import { Type } from "formula-ts-helper";

export abstract class FormulaNode<Inputs extends {
  [key in string]?: AdvancedSocket<WrapperType>;
} = {
    [key in string]?: AdvancedSocket<WrapperType>;
  }, Outputs extends {
    [key in string]?: AdvancedSocket<WrapperType>;
  } = {
    [key in string]?: AdvancedSocket<WrapperType>;
  }, Controls extends {
    [key in string]?: Control;
  } = {
    [key in string]?: Control;
  }> extends AutoUpdateNode<Inputs, Outputs, Controls> {

  width = 250;
  height = 200;

  abstract data(inputs: Record<string, any>): Promise<Record<string, any>> | Record<string, any>;

  // abstract data(inputs: Record<string, any>): { output: string } | Promise<{ output: string }>;

  validateInputs<T extends TypeValidators>(inputs: Record<string, any>, requiredInputs: T): TransformTypes<T> {
    const validated = {} as any;
    for (const identifier in requiredInputs) {
      if (Object.prototype.hasOwnProperty.call(requiredInputs, identifier)) {
        const typeChecker = requiredInputs[identifier];
        if (inputs[identifier] === undefined) {
          throw new InvalidNodeError('Input ' + identifier + ' is required', this.id, identifier);
        }
        let checked = typeChecker(inputs[identifier][0]);
        // if (checked === '__invalid-type' && ) {
        //   checked = typeChecker(inputs[identifier][0]);
        // }
        if (checked === '__invalid-type') {
          console.log(inputs);
          throw new InvalidNodeError('Input ' + identifier + ' got invalid type', this.id, identifier);
        }
        validated[identifier] = checked;
      }
    }
    return validated;
  }

  validateInput<T extends TypeValidator<any>>(inputIdentifier: string, input: any, typeChecker: T): NonUndefined<ReturnType<T>> {
    if (input === undefined) {
      throw new InvalidNodeError('Input ' + inputIdentifier + ' is required', this.id, inputIdentifier);
    }
    const checked = typeChecker(input);
    if (checked === '__invalid-type') {
      throw new InvalidNodeError('Input ' + inputIdentifier + ' got invalid type', this.id, inputIdentifier);
    }
    return checked;
  }
}