import { Model, OrderItem } from 'sequelize/types';
import { QModel } from './query-builder';

export function __processOrder<M extends Model>(params: { m: QModel<M>; e: string[] }) {
  return (item: string): OrderItem => {
    const processed = {
      field: item,
      order: 'ASC',
    };

    switch (item[0]) {
      case '+':
        processed.field = item.substring(1);
        processed.order = 'ASC';
        break;

      case '-':
        processed.field = item.substring(1);
        processed.order = 'DESC';
        break;
    }

    // example: User.date
    // ["User", "date"]
    if (processed.field.startsWith('$')) {
      return [processed.field.substring(1), processed.order];
    } else {
      const spl = processed.field.split('.');
      if (spl.length > 5) {
        params.e.push(`to long nested 'order'`);
        return '';
      } else {
        const r = [];
        let relations = params.m.associations;
        for (let i = 0; i < spl.length - 1; i++) {
          const relation = relations[spl[i]];
          if (relation) {
            // Models= {"User": '...', ...}
            // r <- '...'
            r.push(relation.target);
            relations = relation.target.associations || {};
          } else {
            params.e.push(`Invalid model for 'order': ${spl[i]}`);
            return '';
          }
        }
        r.push(spl[spl.length - 1]);
        r.push(processed.order);
        // r = ['...', 'date', 'ASC']
        return r as OrderItem;
      }
    }
  };
}
