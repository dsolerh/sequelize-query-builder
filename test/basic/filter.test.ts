import { Op } from 'sequelize';
import { QueryBuilder } from '../../src/query-builder';
import { QueryError } from '../../src/query-error';
import { FakeModel } from '../fakers/FakeModel';

describe('.filter()', () => {
  describe('add valid filter', () => {
    class M1 extends FakeModel {}
    class M2 extends FakeModel {}
    let builder: QueryBuilder<any>;
    beforeEach(() => {
      M1.init({ prop1: 'string', prop2: 'boolean' });
      M2.init({ prop1: 'string', prop2: 'boolean' });
      M1.hasMany(M2);
      builder = new QueryBuilder(M1);
    });

    test('simple filter', () => {
      const query = builder
        .filter({
          $and: {
            prop1: {
              $like: '%algo',
            },
            prop2: true,
          },
          $or: {
            prop1: 'line',
            prop2: false,
          },
        })
        .build();

      expect(query.where).toStrictEqual({
        [Op.and]: {
          prop1: { [Op.like]: '%algo' },
          prop2: true,
        },
        [Op.or]: {
          prop1: 'line',
          prop2: false,
        },
      });
    });

    test('nested filter', () => {
      const query = builder
        .filter({
          '$M2.prop1$': {
            $like: '%algo',
          },
          prop2: true,
        })
        .build();

      expect(query.where).toStrictEqual({
        prop2: true,
      });
    });
  });

  describe('add invalid filter', () => {
    class M1 extends FakeModel {}
    let builder: QueryBuilder<any>;
    beforeEach(() => {
      builder = new QueryBuilder(M1);
    });
    test.each`
      op                 | reason
      ${'$nozassas'}     | ${'is not operator'}
      ${'$noOperator'}   | ${'is not operator'}
      ${'$novalidpath$'} | ${'is not nested path'}
    `('operator $op should throw \t\t| $reason', ({ op }) => {
      const qb = builder.filter({
        [op]: {
          prop2: true,
        },
      });

      expect(() => qb.build()).toThrowError(QueryError);
    });
  });
});
