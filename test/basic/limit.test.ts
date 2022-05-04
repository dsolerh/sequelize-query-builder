import { Model } from 'sequelize';
import { QueryBuilder } from '../../src/query-builder';
import { QueryError } from '../../src/query-error';

describe('.limit()', () => {
  describe('add valid limit to a query', () => {
    test.each`
      limit        | val
      ${0}         | ${undefined}
      ${null}      | ${undefined}
      ${undefined} | ${undefined}
      ${10}        | ${10}
      ${'10'}      | ${10}
    `('expect: $val when provide: $limit', ({ limit, val }) => {
      const query = new QueryBuilder(Model).limit(limit).build();
      expect(query.limit).toBe(val);
    });
  });

  describe('add an invalid limit', () => {
    test.each(['as', '1s', 'null', true])('expect: %p to thow ', (limit) => {
      const qb = new QueryBuilder(Model).limit(limit as unknown as number);
      expect(() => qb.build()).toThrowError(QueryError);
    });
  });
});
