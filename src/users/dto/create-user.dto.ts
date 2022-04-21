export class CreateUserDto {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  active: boolean;
}
