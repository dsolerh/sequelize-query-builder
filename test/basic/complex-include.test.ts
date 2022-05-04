import { DataTypes, Model, Op, Sequelize } from 'sequelize';
import { QueryBuilder } from '../../src/query-builder';

describe('add filter to a query', () => {
  let builder: QueryBuilder<Model<any, any>>;
  const sequelize = new Sequelize('test', 'test', 'testdbpass', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false,
  });
  const M1 = sequelize.define('m1', { prop11: DataTypes.STRING }, { freezeTableName: true });
  const M2 = sequelize.define('m2', { prop21: DataTypes.STRING }, { freezeTableName: true });
  const M3 = sequelize.define('m3', { prop31: DataTypes.STRING }, { freezeTableName: true });
  M1.hasMany(M2, { as: 'M12' });
  M2.hasMany(M3, { as: 'M23' });

  beforeEach(() => {
    builder = new QueryBuilder(M1);
  });

  test('[valid] complex include', () => {
    const query = builder
      .filter({
        '$M12.M23.prop31$': {
          $like: '%',
        },
        M12: {
          M23: {
            prop31: {
              $ne: '',
            },
          },
        },
      })
      .include([
        {
          model: M2,
          as: 'M12',
          include: [
            {
              model: M3,
              as: 'M23',
            },
          ],
        },
      ])
      .build();

    expect(query.include).toStrictEqual([
      {
        model: M2,
        as: 'M12',
        include: [
          {
            model: M3,
            as: 'M23',
            where: {
              prop31: {
                [Op.like]: '%',
              },
              prop31: {
                [Op.ne]: '',
              },
            },
          },
        ],
      },
    ]);
  });
});
