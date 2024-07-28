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

export type VSNodeMeta = ArgumentListExpressionMeta | ArrayExpressionMeta | BracketExpressionMeta |  ConstantExpressionMeta |  IdentifierExpressionMeta | MemberAccsessExpressionMeta | OperatorExpressionMeta | TernaryExpressionMeta | TypeExpressionMeta;

export async function addNodeTreeToEditor(editor: NodeEditor<FormulaScheme>, resultNode: ResultNode, nodeMeta: VSNodeMeta, scope: Scope, typeParser: GenericTypeParser, controlFactory: GenericConstantValueParser) {
  const finalNode = await parseNodeTree(editor, nodeMeta, scope, typeParser, controlFactory);
  const connection = new ClassicPreset.Connection(finalNode, 'output', resultNode, 'input');
  editor.addConnection(connection);
  return resultNode;
}

async function parseNodeTree(editor: NodeEditor<FormulaScheme>, nodeMeta: VSNodeMeta, scope: Scope, typeParser: GenericTypeParser, controlFactory: GenericConstantValueParser): Promise<FormulaNode> {
  const node = buildNode(nodeMeta, scope, typeParser, controlFactory);
  await editor.addNode(node);
  for (let i = 0; i < nodeMeta.connected.length; i++) {
    const connectedNode = await parseNodeTree(editor, nodeMeta.connected[i], scope, typeParser, controlFactory);
    const connection = new ClassicPreset.Connection(connectedNode, 'output', node, Object.keys(node.inputs)[i]);
    await editor.addConnection(connection);
  }
  return node;
}

function buildNode(rootNode: VSNodeMeta, scope: Scope, typeParser: GenericTypeParser, controlFactory: GenericConstantValueParser): FormulaNode {
  switch(rootNode.nodeType) {
    case 'ArgumentListExpression':
      return new ArgumentListExpressionNode();
    case 'ArrayExpression':
      return new ArrayExpressionNode();
    case 'BracketExpression':
      return buildNode(rootNode.connected[0], scope, typeParser, controlFactory);
    case 'ConstantExpression':
      return new ConstantExpressionNode(controlFactory, typeParser.parseType(rootNode.properties.type), rootNode.properties.value);
    case 'IdentifierExpression':
      return new IdentifierExpressionNode(scope, rootNode.properties.identifier);
    case 'MemberAccsessExpression':
      return new MemberAccsessNode(rootNode.properties.identifier);
    case 'OperatorExpression':
      return new OperatorExpressionNode(OperatorParser.parseOperator(rootNode.properties.operator));
    case 'TernaryExpression':
      return new TernaryExpressionNode();
    case 'TypeExpression':
      return new ConstantTypeNode(typeParser.parseType(rootNode.properties.type));
  }
}
