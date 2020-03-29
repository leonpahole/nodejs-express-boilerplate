import User from '../db/models/user';
import * as argon2 from 'argon2';
import config from '../config';
import * as jwt from 'jsonwebtoken';
import { AuthPayload } from '../lib/interfaces/AuthPayload';

export default class UserService {
  public static async all(): Promise<User[]> {
    return await User.findAll();
  }

  public static async byId(id: string | number): Promise<User | null> {
    return await User.findByPk(id);
  }

  public static async create(
    name: string,
    surname: string,
    password: string
  ): Promise<User | null> {
    const passwordHashed = await argon2.hash(password);
    const user = await User.create({ name, surname, password: passwordHashed });

    if (user) {
      return await this.byId(user.id.toString());
    }

    return null;
  }

  public static async update(id: string, name: string, surname: string): Promise<User | null> {
    const [, users] = await User.update(
      { name, surname },
      {
        where: {
          id
        },
        returning: true
      }
    );

    if (users && users.length > 0) {
      return await this.byId(id);
    }

    return null;
  }

  public static async delete(id: string): Promise<number> {
    return await User.destroy({ where: { id } });
  }

  public static async login(name: string, password: string): Promise<string | null> {
    const user = await User.findOne({ where: { name }, attributes: ['password', 'id', 'surname'] });
    if (!user) {
      return null;
    } else {
      const correctPassword = await argon2.verify(user.password, password);
      if (!correctPassword) {
        return null;
      }
    }

    return this.generateToken(user);
  }

  private static generateToken(user: User): string {
    const data: AuthPayload = {
      id: user.id.toString(),
      name: user.name,
      surname: user.surname
    };

    const signature = config.jwt.secret;
    const expiration = config.jwt.expiration;

    return <any>jwt.sign({ data }, signature as jwt.Secret, { expiresIn: expiration });
  }
}
