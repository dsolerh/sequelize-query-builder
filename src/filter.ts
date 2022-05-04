import { Op, Model } from 'sequelize';
import { set } from 'lodash';
import { INNM_REGX, OP_REGX } from './regex';
import { HasRelation } from './utilities';
import { QModel } from './query-builder';

const _op: { [s: string]: Symbol | undefined } = {
  and: Op.and,
  or: Op.or,
  like: Op.like,
  ne: Op.ne,
  lte: Op.lte,
  lt: Op.lt,
  gte: Op.gte,
  gt: Op.gt,
  in: Op.in,
  is: Op.is,
  not: Op.not,
};

export function __replaceFilterKeys<M extends Model>(params: { fi: any; m: QModel<M>; e: string[] }) {
  const attr = params.m.getAttributes();
  return (key: string, value: any): [any, any] => {
    if (OP_REGX.test(key) && _op[key.substring(1)]) {
      // operator ex: $and, $like, $or, $eq
      return [_op[key.substring(1)], value];
    }
    if (INNM_REGX.test(key)) {
      const path = key.substring(1, key.length - 1).split('.');
      path[0] = path[0].toLowerCase();
      set(params.fi, path.join('.'), value);
      return ['', undefined];
    }
    if (HasRelation(params.m.associations, key)) {
      set(params.fi, key.toLowerCase(), value);
      return ['', undefined];
    }
    if (attr[key]) {
      return [key, value];
    }
    params.e.push(`invalid filter key: ${key}`);
    return ['', undefined];
  };
}
