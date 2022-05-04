import { Model } from 'sequelize';
import { QueryBuilder } from '../../src/query-builder';
import { QueryError } from '../../src/query-error';

describe('.offset()', () => {
  describe('add valid offset to a query', () => {
    test.each`
      offset       | val
      ${0}         | ${undefined}
      ${null}      | ${undefined}
      ${undefined} | ${undefined}
      ${10}        | ${10}
      ${'10'}      | ${10}
    `('expect: $val when provide: $offset', ({ offset, val }) => {
      const query = new QueryBuilder(Model).offset(offset).build();
      expect(query.offset).toBe(val);
    });
  });

  describe('add an invalid offset', () => {
    test.each(['as', '1s', 'null', true])('expect: %p to thow ', (offset) => {
      const qb = new QueryBuilder(Model).offset(offset as unknown as number);
      expect(() => qb.build()).toThrowError(QueryError);
    });
  });
});
