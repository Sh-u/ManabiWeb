import { UserInputError } from "apollo-server-core";
import argon2 from "argon2";
import { MyContext } from "../types";
import { sendMail } from "../utility/sendMail";
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
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "../constants";
import { User } from "../entities/User";
import { v4 } from "uuid";
import { Deck } from "../entities/Deck";


@InputType()
class RegisterInput {
  @Field()
  username: string;

  @Field()
  email: string;
  @Field()
  password: string;
}



@InputType()
class LoginInput {
  @Field({nullable: true})
  username?: string;

  @Field({nullable: true})
  email?: string;
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
  async forgotPassword(
    @Ctx() { em, redis }: MyContext,
    @Arg("username") _username: string
  ) {
    const user = await em.findOne(User, { username: _username });
    
    if (!user) {
      return false;
    }

    
    
    const token = v4();

    await redis.set(FORGOT_PASSWORD_PREFIX + token, user._id as number, 'EX', 1000 * 60 * 60 * 24)

    const redirect = `<a href="localhost:3000/reset-password/${token}">Reset Password</a>`
    await sendMail(user.email, 'Manabi: Password Change Request', redirect);

    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {

   
    if (!req.session.userId) {  
      
      return null;
    }

    const user = await em.findOne(User, { _id: req.session.userId });
  
   if (!user){
     return null;
   }
    if (!user.decks.isInitialized()){
      await user.decks.init();
    }
 
    return user;
  }

  @Query(() => [User])
  async getUsers(@Ctx() { em }: MyContext) {
    const users = await em.find(User, {});
    return users;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: String,
    @Arg("newPassword")newPassword: String,
    @Ctx() {req, em, redis }: MyContext) : Promise<UserResponse> {

      if (newPassword.includes('@')){
        return {
          errors: [
            {
              field: "newPassword",
              message: "Password is invalid",
            },
          ],
      }
    }

      if (newPassword.length < 3) {
        return {
          errors: [
            {
              field: "newPassword",
              message: "Password is too short",
            },
          ],
        };
      }
      
      
      const userId = await redis.get(FORGOT_PASSWORD_PREFIX+token);

      if (!userId){
        
        return {
          errors: [
            {
              field: "newPassword",
              message: "Something went wrong, please try again later",
            },
          ],
        };
      }

      const user = await em.findOne(User, {_id: userId})
     
      if (!user){
        return {
          errors: [
            {
              field: "newPassword",
              message: "User not found",
            },
          ],
        };
      }

      const hashedPassword = await argon2.hash(newPassword as string);
      user.password = hashedPassword;

      await em.persistAndFlush(user)
    
      req.session.userId = user._id;
      return {
        user
      };
  
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
    @Arg("options") options: RegisterInput,
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

    if (options.username.includes("@"))   {
      return {
        errors: [
          {
            field: "username",
            message: "username cannot contain '@' sign",
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

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(options.email)) {
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
    @Arg("options") options: LoginInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {

    if (!options.email && !options.username){
      return {
        errors: [
          {
            field: "username",
            message: "username or email was not provided",
          },
        ],
      };
    }

   
    const user = await em.findOne(
      User,
      options.email
        ? { email: options.email }
        : { username: options.username }
    );

    
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
