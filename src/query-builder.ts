import { Model, FindOptions, Attributes, ModelStatic, ModelAttributeColumnOptions, Association } from 'sequelize';
import { __replaceFilterKeys } from './filter';
import { __processOrder } from './order';
import { QueryError } from './query-error';
import { ArrayBy, Integer, TraverseAndReplace } from './utilities';

interface DefaultParams {
  limit?: number;
  offset?: number;
}

export interface QModel<M extends Model> {
  getAttributes(): {
    readonly [Key in keyof Attributes<M>]: ModelAttributeColumnOptions;
  };
  associations: {
    [key: string]: Association;
  };
}
export class QueryBuilder<M extends Model> {
  private _errors: string[] = [];
  private _forIncludes: any = {};
  constructor(
    private readonly _model: QModel<M>,
    private readonly _defaults: DefaultParams = {},
    private readonly _query: FindOptions<Attributes<M>> = {},
  ) {}

  public limit(limit: number) {
    return this._set('limit', limit);
  }

  public offset(offset: number) {
    return this._set('offset', offset);
  }

  private _set(param: keyof DefaultParams, val: number) {
    const v = Integer(val);
    if (v === undefined) {
      this._query[param] = this._defaults[param];
    } else if (!isNaN(v)) {
      this._query[param] = v != 0 ? v : undefined;
    } else {
      this._errors.push(`Invalid ${param}`);
    }
    return this;
  }

  public order(order: string | string[]) {
    this._query.order = ArrayBy(order, ',').map(__processOrder({ e: this._errors, m: this._model }));
    return this;
  }

  public filter(f: any) {
    TraverseAndReplace(f, __replaceFilterKeys({ fi: this._forIncludes, m: this._model, e: this._errors }));
    this._query.where = f;
    return this;
  }

  public logger(l = console.log) {
    this._query.logging = l;
    return this;
  }

  public subQuery(subQ = true) {
    this._query.subQuery = subQ;
    return this;
  }

  public count() {
    delete this._query.limit;
    delete this._query.offset;
    (this._query as any).distinct = true;
    return this._query;
  }

  public build() {
    if (this._errors.length > 0) {
      throw new QueryError('Invalid query', this._errors);
    } else {
      return this._query;
    }
  }
}
