export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
}