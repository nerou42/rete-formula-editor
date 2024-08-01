import { NeverType, Type, TypeType } from 'formula-ts-helper';
import { FormulaScheme, TransformTypes, TypeValidators } from '../types';
import { ClassicPreset } from 'rete';
import { Option, SelectControl } from '../controls/SelectControl';
import { DataflowEngine } from 'rete-engine';
import { FormulaNode } from './FormulaNode';
import { AdvancedSocket } from 'rete-advanced-sockets-plugin';
import { WrapperType } from '../WrapperType';

export type TypeFactory<T extends TypeValidators> = {
  inputs: Record<keyof T, () => ClassicPreset.Input<any>>;
  inputValidators: T,
  factory: (inputs: TransformTypes<T>) => Type,
};

export interface TypeMeta {
  identifier: string;
  factory: TypeFactory<any> | (() => Type),
}

export class TypeNode extends FormulaNode {

  private addedStuff: string[] = [];
  private selectedType: TypeMeta;
  private readonly availableTypes: TypeMeta[];
  private readonly engine: DataflowEngine<FormulaScheme>;
  private readonly outputSocket: AdvancedSocket<WrapperType>;

  constructor(availableTypes: TypeMeta[], engine: DataflowEngine<FormulaScheme>) {
    super('Type');
    if (availableTypes.length === 0) {
      throw new Error('Expected at least one type');
    }
    this.engine = engine;
    this.availableTypes = availableTypes;
    this.selectedType = availableTypes[0];
    const options: Option<string>[] = [];
    for (const typeMeta of availableTypes) {
      options.push({ label: typeMeta.identifier, value: typeMeta.identifier });
    }
    const selectControl = new SelectControl(options);
    selectControl.addChangeListener((identifier: string | undefined) => {
      if(identifier === undefined) {
        return;
      }
      const typeMeta = this.findTypeMeta(identifier);
      this.selectedType = typeMeta;
      this.removeStuff();
      if (typeof typeMeta.factory === 'object') this.addStuff(typeMeta.factory.inputs);
      window.setTimeout(() => this.update()); // delay call to uipdate until node is initilized
    })
    this.addControl('type', selectControl);
    this.outputSocket = new AdvancedSocket<WrapperType>(new WrapperType(new TypeType(new NeverType()), false));
    const output = new ClassicPreset.Output(this.outputSocket);
    this.addOutput('output', output);
  }

  private findTypeMeta(identifier: string): TypeMeta {
    for (const type of this.availableTypes) {
      if (type.identifier === identifier) {
        return type;
      }
    }
    throw new Error('Invalid type ' + identifier);
  }

  private addStuff(stuff: Record<string, () => ClassicPreset.Input<any>>): void {
    for (const identifier in stuff) {
      if (Object.prototype.hasOwnProperty.call(stuff, identifier)) {
        const input = stuff[identifier]();
        this.addInput(identifier, input);
        if (input.socket instanceof AdvancedSocket) {
          input.socket.addListener('onConnectionChanged', () => this.update());
        }
        this.addedStuff.push(identifier);
      }
    }
  }

  private removeStuff(): void {
    for (const stuff of this.addedStuff) {
      if (this.hasInput(stuff)) {
        this.removeInput(stuff);
      }
    }
    this.addedStuff = [];
  }

  private buildType(inputs: Record<string, any>): Type {
    if (typeof this.selectedType.factory === 'object') {
      const validated = this.validateInputs(inputs, this.selectedType.factory.inputValidators);
      return new TypeType(this.selectedType.factory.factory(validated));
    } else {
      return new TypeType(this.selectedType.factory())
    }
  }

  private async update() {
    try {
      this.engine.reset();
      const inputs = await this.engine.fetchInputs(this.id);
      this.outputSocket.type = new WrapperType(this.buildType(inputs))
    } catch (e) {
      this.outputSocket.type = new WrapperType(new TypeType(new NeverType()));
    }
  }

  override async data(inputs: Record<string, any>): Promise<{ output: any }> {
    const ret = { output: this.buildType(inputs) };
    return ret;
  }
}
