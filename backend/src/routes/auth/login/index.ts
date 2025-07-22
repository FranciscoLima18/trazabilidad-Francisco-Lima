// loginRoute.ts
import { UCUError } from "../../../utils/index.js";
import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { SignOptions } from "@fastify/jwt";
import { LoginParams, LoginType } from "../../../types/schemas/user.js";
import { userRepository } from "../../../services/user.repository.js";
import bcrypt from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";

const loginRoute: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.post("/", {
    schema: {
      tags: ["Auth"],
      summary: "Usuario Login",
      description: "Endpoint para iniciar sesión de usuario",
      body: LoginParams,
      security: [],
      response: {
        200: Type.Object({
          token: Type.String({ description: "JWT generado para autenticación" })
        })
      },
    },
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, password }: LoginType = request.body as LoginType;

      if (!email || !password) {
        throw new UCUError("Email y contraseña son obligatorios");
      }

      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        throw new UCUError("Usuario no encontrado");
      }

      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        throw new UCUError("Credenciales inválidas");
      }

      const payload = {
        user: user.email,
        roles: [user.rols_id]
      };

      const signOptions: SignOptions = {
        expiresIn: "1h",
        notBefore: "0"
      };

      const token = fastify.jwt.sign(payload, signOptions);
      return { token };
    },
  });
};

export default loginRoute;