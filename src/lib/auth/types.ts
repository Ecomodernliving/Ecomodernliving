export type SessionUser = {
  id: string;
  email: string;
  name: string;
};

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type UsersDB = {
  users: StoredUser[];
};
