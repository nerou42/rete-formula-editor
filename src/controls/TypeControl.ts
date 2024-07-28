import { FormulaControl } from "./FormulaControl";
import { NeverType, Type } from "formula-ts-helper";

export class TypeControl extends FormulaControl<Type> {
  override getSource(value: Type): string {
    return value.toString();
  }

  protected override getDefaultValue(): Type {
    return new NeverType();
  }
}
