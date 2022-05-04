import { QueryBuilder } from '../../src/query-builder';
import { QueryError } from '../../src/query-error';
import { FakeModel } from '../fakers/FakeModel';

describe('.order()', () => {
  class M1 extends FakeModel {}
  class M2 extends FakeModel {}

  describe('add valid order to a query', () => {
    let builder: QueryBuilder<any>;
    beforeAll(() => {
      M1.hasMany(M2);
      builder = new QueryBuilder(M1);
    });

    test('simple order', () => {
      const order = '+prop1,-id';
      const query = builder.order(order).build();
      expect(query.order).toBeDefined();
      expect(query.order).toStrictEqual([
        ['prop1', 'ASC'],
        ['id', 'DESC'],
      ]);
    });

    test('nested order', () => {
      const order = '+M2.prop1,-id';
      const query = builder.order(order).build();
      expect(query.order).toBeDefined();
      expect(query.order).toStrictEqual([
        [M2, 'prop1', 'ASC'],
        ['id', 'DESC'],
      ]);
    });
  });

  describe('add invalid order to a query', () => {
    let builder: QueryBuilder<any>;
    beforeAll(() => {
      M1.hasMany(M2);
      builder = new QueryBuilder(M1);
    });

    test('invalid nested model', () => {
      const order = '+M3.prop1,-id';
      const qb = builder.order(order);
      expect(() => qb.build()).toThrowError(QueryError);
    });
  });
});
