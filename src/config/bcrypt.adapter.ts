import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const bcryptAdapter = {
  hash: (passowrd: string) => {
    const salt = genSaltSync();
    return hashSync(passowrd, salt);
  },

  compare: (password: string, hashed: string) => {
    return compareSync(password, hashed);
  },
};
