import { DataTypes, Model, Op, Sequelize } from 'sequelize';
import { QueryBuilder } from '../../src/query-builder';
import { FakeModel } from '../fakers/FakeModel';

describe('add filter to a query', () => {
  class M1 extends FakeModel {}
  class M2 extends FakeModel {}
  class M3 extends FakeModel {}
  let builder: QueryBuilder<any>;
  M1.hasMany(M2);
  M1.hasMany(M2, { as: 'M12' });
  M1.belongsToMany(M3, { as: 'M13', through: 'M1_M3' });

  beforeEach(() => {
    builder = new QueryBuilder(M1);
  });

  test('[valid] simple include', () => {
    const query = builder
      .filter({
        '$M12.prop1$': {
          $like: '%other',
        },
      })
      .include([
        {
          model: M2,
          as: 'M12',
        },
        {
          model: M2,
        },
      ])
      .build();

    expect(query.include).toStrictEqual([
      {
        model: M2,
        as: 'M12',
        where: {
          prop1: {
            [Op.like]: '%other',
          },
        },
      },
      {
        model: M2,
      },
    ]);
  });

  test('[valid] nested include', () => {
    const query = builder
      .filter({
        M2: {
          prop1: '',
        },
        '$M13.prop1$': {
          $like: '%other',
        },
      })
      .include([
        {
          model: M2,
          as: 'M12',
        },
        {
          model: M2,
        },
        {
          model: M3,
          as: 'M13',
        },
      ])
      .build();

    expect(query.include).toStrictEqual([
      {
        model: M2,
        as: 'M12',
      },
      {
        model: M2,
        where: {
          prop1: '',
        },
      },
      {
        model: M3,
        as: 'M13',
        where: {
          prop1: {
            [Op.like]: '%other',
          },
        },
      },
    ]);
  });

  test('[invalid] nested include', () => {
    const query = builder
      .filter({
        M2: {
          prop3: '',
        },
      })
      .include([
        {
          model: M2,
        },
      ]);

    expect(
      jest.fn(() => {
        builder.build();
      }),
    ).toThrow();
  });
});
