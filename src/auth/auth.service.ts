import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthedUserDto } from 'src/auth/dto/authed-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<AuthedUserDto | null> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return {
        id: user.id,
        username: user.username,
      };
    }
    return null;
  }

  async login(user: AuthedUserDto) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createUser(username: string, password: string): Promise<AuthedUserDto> {
    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.usersService.create({
      username,
      hashedPassword,
    });

    return {
      id: newUser.id,
      username: newUser.username,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    console.log('bcrypt.hash', bcrypt.hash.toString())
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('hashedPassword', hashedPassword)
    return hashedPassword;
  }
}
