export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  role?: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: string;
}

