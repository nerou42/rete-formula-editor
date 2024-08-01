import { ClassicPreset, NodeEditor } from "rete";
import { FormulaScheme, Scope } from "../types";
import { GenericTypeParser, OperatorParser, Type, TypeDescription } from "formula-ts-helper";
import { ArgumentListExpressionNode } from "../nodes/ArgumentListExpressionNode";
import { FormulaNode } from "../nodes/FormulaNode";
import { ArrayExpressionNode } from "../nodes/ArrayExpressionNode";
import { ConstantExpressionNode } from "../nodes/ConstantExpressionNode";
import { IdentifierExpressionNode } from "../nodes/IdentifierExpressionNode";
import { MemberAccsessNode } from "../nodes/MemberAccsessNode";
import { OperatorExpressionNode } from "../nodes/OperatorExpressionNode";
import { TernaryExpressionNode } from "../nodes/TernaryExpressionNode";
import { ConstantTypeNode } from "../nodes/ConstantTypeNode";
import { ResultNode } from "../nodes/ResultNode";
import { GenericConstantValueParser } from "../ConstantValueToControl";

export interface GenericVSNodeMeta<T extends string = string, Properties extends any = {}> {
  nodeType: T;
  connected: VSNodeMeta[];
  properties: Properties;
}

export type ArgumentListExpressionMeta = GenericVSNodeMeta<"ArgumentListExpression">;
export type ArrayExpressionMeta = GenericVSNodeMeta<"ArrayExpression">;
export type BracketExpressionMeta = GenericVSNodeMeta<"BracketExpression">;
export type ConstantExpressionMeta = GenericVSNodeMeta<"ConstantExpression", { type: TypeDescription, value: string }>;
export type IdentifierExpressionMeta = GenericVSNodeMeta<"IdentifierExpression", { identifier: string }>;
export type MemberAccsessExpressionMeta = GenericVSNodeMeta<"MemberAccsessExpression", { identifier: string }>;
export type OperatorExpressionMeta = GenericVSNodeMeta<"OperatorExpression", { operator: number }>;
export type TernaryExpressionMeta = GenericVSNodeMeta<"TernaryExpression">;
export type TypeExpressionMeta = GenericVSNodeMeta<"TypeExpression", { type: TypeDescription }>;

export type VSNodeMeta = ArgumentListExpressionMeta | ArrayExpressionMeta | BracketExpressionMeta | ConstantExpressionMeta | IdentifierExpressionMeta | MemberAccsessExpressionMeta | OperatorExpressionMeta | TernaryExpressionMeta | TypeExpressionMeta;

export async function addNodeTreeToEditor(editor: NodeEditor<FormulaScheme>, resultNode: ResultNode, nodeMeta: VSNodeMeta, scope: Scope, typeParser: GenericTypeParser, controlFactory: GenericConstantValueParser) {
  const finalNode = await parseNodeTree(editor, nodeMeta, scope, typeParser, controlFactory);
  const connection = new ClassicPreset.Connection(finalNode, 'output', resultNode, 'input');
  await editor.addConnection(connection);
}

async function parseNodeTree(editor: NodeEditor<FormulaScheme>, nodeMeta: VSNodeMeta, scope: Scope, typeParser: GenericTypeParser, controlFactory: GenericConstantValueParser): Promise<FormulaNode> {
  const result = buildNode(nodeMeta, scope, typeParser, controlFactory);
  await editor.addNode(result.node);
  for (let i = 0; i < result.connected.length; i++) {
    const connectedNode = await parseNodeTree(editor, result.connected[i], scope, typeParser, controlFactory);
    const connection = new ClassicPreset.Connection(connectedNode, 'output', result.node, Object.keys(result.node.inputs)[i]);
    await editor.addConnection(connection);
  }
  return result.node;
}

function buildNode(rootNode: VSNodeMeta, scope: Scope, typeParser: GenericTypeParser, controlFactory: GenericConstantValueParser): { node: FormulaNode, connected: VSNodeMeta[] } {
  switch (rootNode.nodeType) {
    case 'ArgumentListExpression':
      return { connected: rootNode.connected, node: new ArgumentListExpressionNode() };
    case 'ArrayExpression':
      return { connected: rootNode.connected, node: new ArrayExpressionNode()};
    case 'BracketExpression':
      return buildNode(rootNode.connected[0], scope, typeParser, controlFactory);
    case 'ConstantExpression':
      return { connected: rootNode.connected, node: new ConstantExpressionNode(controlFactory, typeParser.parseType(rootNode.properties.type), rootNode.properties.value) };
    case 'IdentifierExpression':
      return { connected: rootNode.connected, node: new IdentifierExpressionNode(scope, rootNode.properties.identifier) };
    case 'MemberAccsessExpression':
      return { connected: rootNode.connected, node: new MemberAccsessNode(rootNode.properties.identifier) };
    case 'OperatorExpression':
      return { connected: rootNode.connected, node: new OperatorExpressionNode(OperatorParser.parseOperator(rootNode.properties.operator)) };
    case 'TernaryExpression':
      return { connected: rootNode.connected, node: new TernaryExpressionNode() };
    case 'TypeExpression':
      return { connected: rootNode.connected, node: new ConstantTypeNode(typeParser.parseType(rootNode.properties.type)) };
  }
}
