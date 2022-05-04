import {
  Model,
  ModelStatic,
  HasManyOptions,
  HasMany,
  SetOptions,
  Attributes,
  InitOptions,
  ModelAttributes,
  Optional,
  ModelAttributeColumnOptions,
  BelongsToMany,
  BelongsToManyOptions,
} from 'sequelize';

export class FakeModel extends Model {
  public static tableName = this.name;
  static associations = {};
  public static hasMany<M extends Model<any, any>, T extends Model<any, any>>(
    this: ModelStatic<M>,
    target: ModelStatic<T>,
    options?: HasManyOptions,
  ): HasMany<M, T> {
    const name = target.name || target.tableName;
    this.associations[name] = {
      as: (options.as as string) || name,
      associationType: 'hasMany',
      foreignKey: '',
      identifier: '',
      inspect: () => '',
      isAliased: false,
      isMultiAssociation: false,
      isSelfAssociation: false,
      isSingleAssociation: false,
      source: this,
      target: target,
    };
    return {} as HasMany<M, T>;
  }

  public static belongsToMany<M extends Model<any, any>, T extends Model<any, any>>(
    this: ModelStatic<M>,
    target: ModelStatic<T>,
    options: BelongsToManyOptions,
  ): BelongsToMany<M, T> {
    const name = target.name || target.tableName;
    this.associations[name] = {
      as: (options.as as string) || name,
      associationType: 'belongsToMany',
      foreignKey: '',
      identifier: '',
      inspect: () => '',
      isAliased: false,
      isMultiAssociation: false,
      isSelfAssociation: false,
      isSingleAssociation: false,
      source: this,
      target: target,
    };
    return {} as BelongsToMany<M, T>;
  }

  public static init<MS extends ModelStatic<Model<any, any>>, M extends InstanceType<MS>>(
    this: MS,
    attributes: ModelAttributes<any>,
    options?: InitOptions<M>,
  ): MS {
    this.prototype._attr = attributes;
    return this;
  }

  public static getAttributes<M extends Model<any, any>>(
    this: ModelStatic<M>,
  ): { readonly [Key in keyof Attributes<M>]: ModelAttributeColumnOptions<Model<any, any>> } {
    return this.prototype._attr || {};
  }
}
