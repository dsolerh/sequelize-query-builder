import { isNil } from 'lodash';
import { Association } from 'sequelize';

export function Integer(n: any): number | undefined {
  if (/^\d*$/.test(n)) {
    return Number(n);
  } else if (isNil(n)) {
    return undefined;
  } else {
    return NaN;
  }
}

export function ArrayBy(val: string | string[], sep: string): string[] {
  return typeof val == 'string' && val !== '' ? val.split(sep) : Array.isArray(val) ? val : [];
}

export function TraverseAndReplace(obj: any, cb: (k: string, v: any) => [string, any]) {
  Object.keys(_Obj(obj)).forEach((k) => {
    const [nk, nv] = cb(k, obj[k]);
    if (nv !== undefined) {
      obj[nk] = nv;
      TraverseAndReplace(obj[nk], cb);
    }
    if (k !== nk) {
      delete obj[k];
    }
  });
}

export function HasRelation(
  relations: {
    [key: string]: Association;
  },
  key: string,
) {
  for (const id of Object.keys(relations)) {
    const { target } = relations[id];
    if (id.toLowerCase() === key.toLowerCase() || target.tableName.toLowerCase() === key.toLowerCase()) {
      return true;
    }
  }
  return false;
}

function _Obj(o: any) {
  if (o === Object(o) && !Array.isArray(o) && typeof o !== 'function') {
    return o;
  } else {
    return 0;
  }
}
