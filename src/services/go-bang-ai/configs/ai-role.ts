import { Role } from '../interfaces/open-pants.interface';

export const aiRole = {
  com: Role.com,
  hum: Role.hum,
  empty: Role.empty,
  reverse: (r: Role) => {
    return r === Role.com ? Role.hum : Role.com;
  }
};
