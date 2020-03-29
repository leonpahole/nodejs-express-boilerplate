import {
  Table,
  Column,
  Model,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  AutoIncrement,
  DefaultScope
} from 'sequelize-typescript';

@DefaultScope(() => ({
  attributes: { exclude: ['password'] }
}))
@Table
export default class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  surname!: string;

  @Column
  password!: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
