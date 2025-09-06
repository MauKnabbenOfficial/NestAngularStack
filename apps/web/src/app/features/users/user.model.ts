export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CreateUser {
  name: string;
  email: string;
}

export interface UpdateUser {
  name?: string;
  email?: string;
}
