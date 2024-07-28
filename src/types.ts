import { Type } from "formula-ts-helper";
import { ClassicPreset, GetSchemes } from "rete";
import { FormulaNode } from "./nodes/FormulaNode";

export type TypeValidator<T> = (data: any) => T | '__invalid-type';

export type TypeValidators = Record<string, TypeValidator<any>>;

export type NonUndefined<T> = T extends '__invalid-type' ? never : T;

export type TransformTypes<T extends TypeValidators> = {
  [K in keyof T]: NonUndefined<ReturnType<T[K]>>;
};

export const stringValidator: TypeValidator<string> = (data: any) => {
  if (typeof data === 'string') {
    return data;
  } else {
    return '__invalid-type';
  }
}

export const optionalStringValidator: TypeValidator<string | undefined> = (data: any) => {
  if (data === undefined || typeof data === 'string') {
    return data;
  } else {
    return '__invalid-type';
  }
}

export const typeValidator: TypeValidator<Type> = (data: any) => {
  if (typeof data === 'object' && data['equals'] !== undefined && data['assignableBy'] !== undefined && data['getImplementedOperators'] !== undefined) {
    return data;
  } else {
    return '__invalid-type';
  }
}

export const optionalTypeValidator: TypeValidator<Type | undefined> = (data: any) => {
  console.log(data);
  if(data === undefined) return data;
  if (typeof data === 'object' && data['equals'] !== undefined && data['assignableBy'] !== undefined && data['getImplementedOperators'] !== undefined) {
    return data;
  } else {
    return '__invalid-type';
  }
}

export type Control = ClassicPreset.Control & { getValue(): any };

// export type Node = TypedNode<{
//   [key in string]?: TypedSocket;
// }, {
//     [key in string]?: TypedSocket;
//   }, {
//     [key in string]?: Control;
//   }> & DataflowNode & { width: number, height: number } & {
//     addIOChangedListener(listener: IOChangedListener): void;
//     removeIOChangedListener(listener: IOChangedListener): void;
//   };

export type Node = FormulaNode;

export type Scope = { [key: string]: Type }

export class Connection<A extends Node = Node, B extends Node = Node> extends ClassicPreset.Connection<A, B> { }

export type FormulaScheme = GetSchemes<Node, Connection>;
// export type FormulaScheme = TypedScheme<Type, FormulaNode, ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>>;