import User from '../db/models/user';
import logger from '../lib/logger';

export default class UserService {
  public static async all(): Promise<User[]> {
    return await User.findAll();
  }

  public static async byId(id: string): Promise<User | null> {
    return await User.findByPk(id);
  }

  public static async create(name: string, surname: string): Promise<User | null> {
    return await User.create({ name, surname });
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

    logger.info(users);
    if (users && users.length > 0) {
      return users[0];
    }

    return null;
  }

  public static async delete(id: string): Promise<number> {
    return await User.destroy({ where: { id } });
  }
}
