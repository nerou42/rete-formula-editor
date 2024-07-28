import { GenericTypeParser, TypeDescription } from "formula-ts-helper";
import { Scope } from "../types";

export type ScopeDescription = { [key: string]: TypeDescription }

export function parseScope(typeParser: GenericTypeParser, scopeDescription: ScopeDescription): Scope {
  const scope: Scope = {};
  for (const identifier in scopeDescription) {
    if (Object.prototype.hasOwnProperty.call(scopeDescription, identifier)) {
      const typeDescription = scopeDescription[identifier];
      scope[identifier] = typeParser.parseType(typeDescription);
    }
  }
  return scope;
}