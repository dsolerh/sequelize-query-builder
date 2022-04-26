import { Op, Model } from 'sequelize';
import { set } from 'lodash';
import { INNM_REGX, OP_REGX } from './regex';
import { HasRelation } from './utilities';

const _op = Op as unknown as { [s: string]: Symbol };

export function __replaceFilterKeys(params: { fi: any; m: typeof Model; e: string[] }) {
  return (key: string, value: any): [any, any] => {
    if (OP_REGX.test(key)) {
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
    if (params.m.rawAttributes[key]) {
      return [key, value];
    }
    params.e.push(`invalid filter key: ${key}`);
    return ['', undefined];
  };
}
