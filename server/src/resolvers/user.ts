import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

import argon2 from "argon2";
import { COOKIE_NAME } from "../constants";
import { sendMail } from "../utility/sendMail";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

    @Field()
    email: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async forgotPassord(
    @Ctx() { em }: MyContext,
    @Arg("username") _username: string
  ) {
    const user = await em.findOne(User, { username: _username });

    if (!user) {
      return false;
    }   

    await sendMail(user.email, "test", "shu test");

    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    if (!req.session.userId) {
      return null;
    }

    const user = await em.findOne(User, { _id: req.session.userId });

    return user;
  }

  @Query(() => [User])
  async getUsers(@Ctx() { em }: MyContext) {
    const users = await em.find(User, {});
    return users;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    if (!req.session.userId) {
      console.log("Logout ERROR => NO ACTIVE USER FOUND");
      return false;
    }

    const response: Boolean = await new Promise((_res) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          _res(false);
          return;
        }

        _res(true);
      })
    );

    return response;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length < 3) {
      return {
        errors: [
          {
            field: "username",
            message: "username is too short",
          },
        ],
      };
    }

    if (options.email.length < 3) {
        return {
          errors: [
            {
              field: "email",
              message: "email address is too short",
            },
          ],
        };
      }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(options.email)){
        return {
            errors: [
              {
                field: "email",
                message: "invalid email address",
              },
            ],
          };
    }

    if (options.password.length < 3) {
      return {
        errors: [
          {
            field: "password",
            message: "password is too short",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = await em.create(User, {
      username: options.username,
      password: hashedPassword,
      email: options.email,
    });

    if (!user) {
      return {
        errors: [
          {
            field: "register",
            message: "cannot register",
          },
        ],
      };
    }
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      console.log(err.code);
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "user already exists",
            },
          ],
        };
      }
    }

    req.session.userId = user._id;
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "User not found",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, options.password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "wrong password",
          },
        ],
      };
    }

    req.session.userId = user._id;

    return {
      user,
    };
  }
}
