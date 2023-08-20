import prismaClient from "../../prisma";
import { hash } from "bcryptjs";
import { UserRequest } from "../../models/interfaces/user/UserRequest";

class UserService {
  static async create({ name, email, familyName, password }: UserRequest) {
    if (!email) {
      throw new Error("Email incorrect");
    }

    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userAlreadyExists) {
      throw new Error("Email already exists");
    }

    const passwordHash = await hash(password, 8);

    const user = prismaClient.user.create({
      data: {
        name: name,
        email: email,
        familyName: familyName,
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        familyName: true,
        email: true,
      },
    });

    return user;
  }

  static async findByEmail(email: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  }

  static async findUserById(id: string) {
    const user = await prismaClient.user.findFirst({
      where: {
        id, RefreshToken: {
          some: {
            revoked: false
          }
        }
      },
      select: {
        id: true,
        name: true,
        familyName: true,
        email: true,
        RefreshToken: true
      },
    });

    return user;
  }
}

export { UserService };
