import { NodeEditor } from 'rete';
import { FormulaScheme, Scope } from './types';
import {
  BooleanType,
  DateIntervalType,
  DateTimeImmutableType,
  FloatType,
  GenericTypeParser,
  IntegerType,
  MixedType,
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
import { WrapperType } from './WrapperType';

interface CustomType {
  type: Type;
  typeParser: SpecificTypeParser;
  constantControl?: SpecificConstantValueParser;
  typeMeta: TypeMeta;
}

interface Props {
  scope?: Scope;
  customTypes?: CustomType[];
  specificReturnTypes?: SpecificReturnTypeParser[];
  resultType?: Type;
}

type FormulaChangeListener = (formula: string) => void;

export class FormulaEditor<
  Scheme extends FormulaScheme
> extends NodeEditor<Scheme> {
  private scope: Scope;
  private typeParser: GenericTypeParser;
  private controlFactory: GenericConstantValueParser;
  private engine: DataflowEngine<Scheme>;
  private typeMetas: TypeMeta[];
  private readonly resultNode: ResultNode;
  private readonly props: Props;

  // private readonly formulaChangeListeners: FormulaChangeListener[] = [];

  constructor(props: Props) {
    super();
    this.props = props;
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
    this.engine = new DataflowEngine<Scheme>();
    const typesPlugin = new AdvancedSocketsPlugin<WrapperType, Scheme>();
    this.use(new DeadConnectionRemovalPlugin<Scheme>());
    this.use(this.engine);
    this.use(typesPlugin);
    this.resultNode = new ResultNode(props.resultType ?? new MixedType());
  }

  // addFormulaChangeListener(listener: FormulaChangeListener): void {
  //   this.formulaChangeListeners.push(listener);
  // }

  getContectMenuItems(): ItemDefinition<Scheme>[] {
    const constants: ItemDefinition<Scheme>[] = [
      [
        'Integer',
        () =>
          new ConstantExpressionNode(this.controlFactory, new IntegerType()),
      ],
      [
        'String',
        () => new ConstantExpressionNode(this.controlFactory, new StringType()),
      ],
      [
        'Boolean',
        () =>
          new ConstantExpressionNode(this.controlFactory, new BooleanType()),
      ],
      [
        'Float',
        () => new ConstantExpressionNode(this.controlFactory, new FloatType()),
      ],
      [
        'DateTime',
        () => new ConstantExpressionNode(this.controlFactory, new DateTimeImmutableType()),
      ],
      [
        'DateInterval',
        () => new ConstantExpressionNode(this.controlFactory, new DateIntervalType()),
      ],
    ];
    if (this.props.customTypes) {
      for (const customType of this.props.customTypes) {
        if (customType.constantControl) {
          constants.push([
            customType.type.toString(),
            () =>
              new ConstantExpressionNode(this.controlFactory, customType.type),
          ]);
        }
      }
    }
    const items: ItemDefinition<Scheme>[] = [
      ['Identifier', () => new IdentifierExpressionNode(this.scope)],
      ['Operator', () => new OperatorExpressionNode()],
      ['ArgumentList', () => new ArgumentListExpressionNode()],
      ['Array', () => new ArrayExpressionNode()],
      ['MemberAccess', () => new MemberAccsessNode()],
      ['Ternary', () => new TernaryExpressionNode()],
      ['Type', () => new TypeNode(this.typeMetas, this.engine)],
      ['Constants', constants],
    ];
    return items;
  }

  async computeFormula(): Promise<string> {
    this.engine.reset();
    const result = await this.engine.fetch(this.resultNode.id);
    return result['output'];
  }

  async clear(): Promise<boolean> {
    const cleared = await super.clear();
    if(cleared) {
      this.addNode(this.resultNode);
    }
    return cleared;
  }

  async loadNodeTree(nodeTree: VSNodeMeta) {
    await this.clear();
    await addNodeTreeToEditor(
      this,
      this.resultNode,
      nodeTree,
      this.scope,
      this.typeParser,
      this.controlFactory
    );
  }
}
