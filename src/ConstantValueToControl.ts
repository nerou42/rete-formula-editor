import { BooleanType, FloatType, IntegerType, StringType, Type } from "formula-ts-helper";
import { BooleanControl } from "./controls/BooleanControl";
import { IntegerControl } from "./controls/IntegerControl";
import { StringControl } from "./controls/StringControl";
import { FloatControl } from "./controls/FloatControl";
import { FormulaControl } from "./controls/FormulaControl";

export type SpecificConstantValueParser = (type: Type, value?: string) => FormulaControl<any> | undefined;

export class GenericConstantValueParser {

  private parsers: SpecificConstantValueParser[];

  constructor(parsers: SpecificConstantValueParser[] = []) {
    this.parsers = parsers;
  }

  parseConstantValue(type: Type, value?: string): FormulaControl<any> {
    const inbuilt = parseInbuiltConstantValue(type, value);
    if (inbuilt !== undefined) {
      return inbuilt;
    }
    for (const parser of this.parsers) {
      const result = parser(type, value);
      if (result !== undefined) {
        return result;
      }
    }
    throw new Error(`Unable to parse type ${type.toString()}. No suitable parser found`);
  }
}

function parseInbuiltConstantValue(type: Type, value?: string): FormulaControl<any> | undefined {
  let control = null;
  if (type instanceof BooleanType) {
    control = new BooleanControl();
    if (value) control.setFromSource(value);
  } else if (type instanceof IntegerType) {
    control = new IntegerControl();
    if (value) control.setFromSource(value);
  } else if (type instanceof FloatType) {
    control = new FloatControl();
    if (value) control.setFromSource(value);
  } else if (type instanceof StringType) {
    control = new StringControl();
    if (value) control.value = value;
  } else {
    return undefined;
  }
  return control;
}