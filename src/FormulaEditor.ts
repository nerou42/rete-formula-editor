import { NodeEditor } from 'rete';
import { FormulaScheme, Scope } from './types';
import {
  BooleanType,
  FloatType,
  GenericTypeParser,
  IntegerType,
  SpecificReturnTypeParser,
  SpecificTypeParser,
  StringType,
  Type,
} from 'formula-ts-helper';
import {
  GenericConstantValueParser,
  SpecificConstantValueParser,
} from './ConstantValueToControl';
import {
  VSNodeMeta,
  addNodeTreeToEditor,
} from './input-parsing/ExpressionToNode';
import { ResultNode } from './nodes/ResultNode';
import { DataflowEngine } from 'rete-engine';
import { ItemDefinition } from 'rete-context-menu-plugin/_types/presets/classic/types';
import { IdentifierExpressionNode } from './nodes/IdentifierExpressionNode';
import { OperatorExpressionNode } from './nodes/OperatorExpressionNode';
import { ArgumentListExpressionNode } from './nodes/ArgumentListExpressionNode';
import { ArrayExpressionNode } from './nodes/ArrayExpressionNode';
import { MemberAccsessNode } from './nodes/MemberAccsessNode';
import { TernaryExpressionNode } from './nodes/TernaryExpressionNode';
import { ConstantExpressionNode } from './nodes/ConstantExpressionNode';
import { TypeMeta, TypeNode } from './nodes/TypeNode';
import { inbuiltTypeFactories } from './InbuiltTypeFactories';
import { AdvancedSocketsPlugin } from 'rete-advanced-sockets-plugin';
import { DeadConnectionRemovalPlugin } from './dead-connection-removal-plugin/DeadConnectionRemovalPlugin';

interface CustomType {
  typeParser: SpecificTypeParser;
  constantControl?: SpecificConstantValueParser;
  typeMeta: TypeMeta;
}

interface Props {
  scope?: Scope;
  customTypes?: CustomType[];
  resultType: Type;
  specificReturnTypes?: SpecificReturnTypeParser[];
}

export class FormulaEditor<
  Scheme extends FormulaScheme
> extends NodeEditor<Scheme> {
  private scope: Scope;
  private typeParser: GenericTypeParser;
  private controlFactory: GenericConstantValueParser;
  private resultNode: ResultNode;
  private engine: DataflowEngine<Scheme>;
  private typeMetas: TypeMeta[];

  constructor(props: Props) {
    super();
    this.typeParser = new GenericTypeParser(
      props.customTypes?.map((t) => t.typeParser),
      props.specificReturnTypes
    );
    this.scope = props.scope ?? {};
    this.controlFactory = new GenericConstantValueParser(
      props.customTypes
        ?.map((t) => t.constantControl)
        .filter((t): t is SpecificConstantValueParser => t !== undefined)
    );
    this.typeMetas = inbuiltTypeFactories.concat(
      props.customTypes?.map((t) => t.typeMeta) ?? []
    );
    this.resultNode = new ResultNode(props.resultType);
    this.engine = new DataflowEngine<Scheme>();
    const typesPlugin = new AdvancedSocketsPlugin<Type, Scheme>();
    this.use(new DeadConnectionRemovalPlugin<Scheme>());
    this.use(this.engine);
    this.use(typesPlugin);
    this.addNode(this.resultNode);
  }

  getContectMenuItems(): ItemDefinition<Scheme>[] {
    const items: ItemDefinition<Scheme>[] = [
      ['Identifier', () => new IdentifierExpressionNode(this.scope)],
      ['Operator', () => new OperatorExpressionNode()],
      ['ArgumentList', () => new ArgumentListExpressionNode()],
      ['Array', () => new ArrayExpressionNode()],
      ['MemberAccess', () => new MemberAccsessNode()],
      ['Ternary', () => new TernaryExpressionNode()],
      ['Type', () => new TypeNode(this.typeMetas, this.engine)],
      [
        'Constants',
        [
          [
            'Integer',
            () =>
              new ConstantExpressionNode(
                this.controlFactory,
                new IntegerType()
              ),
          ],
          [
            'String',
            () =>
              new ConstantExpressionNode(this.controlFactory, new StringType()),
          ],
          [
            'Boolean',
            () =>
              new ConstantExpressionNode(
                this.controlFactory,
                new BooleanType()
              ),
          ],
          [
            'Float',
            () =>
              new ConstantExpressionNode(this.controlFactory, new FloatType()),
          ],
        ],
      ],
    ];
    return items;
  }

  loadNodeTree(nodeTree: VSNodeMeta): void {
    this.clear();
    this.addNode(this.resultNode);
    addNodeTreeToEditor(
      this,
      this.resultNode,
      nodeTree,
      this.scope,
      this.typeParser,
      this.controlFactory
    );
  }
}
