import { ArrayType, BooleanType, CompoundType, DateIntervalType, DateTimeImmutableType, FloatType, IntegerType, MixedType, NeverType, NullType, StringType, Type, TypeType } from "formula-ts-helper";
import { TypeFactory, TypeMeta } from "./nodes/TypeNode";
import { ClassicPreset } from "rete";
import { TypeValidator, typeValidator } from "./types";
import { AdvancedSocket } from "rete-advanced-sockets-plugin";

const arrayFactory: TypeFactory<Record<'elementsType', TypeValidator<Type>>> = {
  inputs: { elementsType: () => new ClassicPreset.Input(new AdvancedSocket<Type>(new TypeType(new MixedType())), 'Elements type') },
  inputValidators: { elementsType: typeValidator },
  factory: (data) => new ArrayType(new IntegerType(), (data.elementsType as TypeType).getType()),
}

const typeTypeFactory: TypeFactory<Record<'type', TypeValidator<Type>>> = {
  inputs: { type: () => new ClassicPreset.Input(new AdvancedSocket<Type>(new TypeType(new MixedType())), 'Type') },
  inputValidators: { type: typeValidator },
  factory: (data) => new TypeType((data.type as TypeType).getType()),
}

const compoundTypeFactory: TypeFactory<Record<'typeA' | 'typeB', TypeValidator<Type>>> = {
  inputs: {
    typeA: () => new ClassicPreset.Input(new AdvancedSocket<Type>(new TypeType(new MixedType())), 'Type A'),
    typeB: () => new ClassicPreset.Input(new AdvancedSocket<Type>(new TypeType(new MixedType())), 'Type B'),
  },
  inputValidators: { typeA: typeValidator, typeB: typeValidator },
  factory: (data) => CompoundType.buildFromTypes([(data.typeA as TypeType).getType(), (data.typeB as TypeType).getType()]),
}

export const inbuiltTypeFactories: TypeMeta[] = [
  {
    identifier: 'String',
    factory: () => new StringType(),
  }, {
    identifier: 'boolean',
    factory: () => new BooleanType(),
  }, {
    identifier: 'never',
    factory: () => new NeverType(),
  }, {
    identifier: 'int',
    factory: () => new IntegerType(),
  }, {
    identifier: 'float',
    factory: () => new FloatType(),
  }, {
    identifier: 'array',
    factory: arrayFactory,
  }, {
    identifier: 'typeType',
    factory: typeTypeFactory,
  }, {
    identifier: 'compoundType',
    factory: compoundTypeFactory,
  }, {
    identifier: 'null',
    factory: () => new NullType(),
  }, {
    identifier: 'dateTime',
    factory: () => new DateTimeImmutableType(),
  }, {
    identifier: 'dateInterval',
    factory: () => new DateIntervalType(),
  }, {
    identifier: 'mixed',
    factory: () => new MixedType(),
  }
];