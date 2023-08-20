import { compare } from "bcryptjs";
import { LoginRequest } from "../../models/interfaces/login/LoginRequest";
import prismaClient from "../../prisma";

class LoginService {
  static async execute({ email, password }: LoginRequest) {
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!userAlreadyExists) {
      throw new Error("Unregistered user");
    }

    const passwordHash = await compare(
      password,
      userAlreadyExists?.password as string
    );

    if (!passwordHash) {
      throw new Error("Incorrect password");
    }

    return userAlreadyExists;
  }
}

export { LoginService };
