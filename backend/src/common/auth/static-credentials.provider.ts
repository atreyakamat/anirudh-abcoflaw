import { Injectable } from '@nestjs/common';
import { Roles, Role } from '@crm/shared';

export interface AuthenticatedIdentity {
  id: string;
  username: string;
  displayName: string;
  role: Role;
}

@Injectable()
export class StaticCredentialsProvider {
  private readonly accounts = [
    { id: 'admin-user', username: 'admin', displayName: 'Practice Admin', role: Roles.ADMIN, password: 'admin123' },
    { id: 'receptionist-user', username: 'receptionist', displayName: 'Receptionist', role: Roles.RECEPTIONIST, password: 'admin123' },
    { id: 'lawyer-user', username: 'lawyer', displayName: 'Lead Lawyer', role: Roles.LAWYER, password: 'admin123' },
  ] satisfies Array<AuthenticatedIdentity & { password: string }>;

  verify(username: string, password: string): AuthenticatedIdentity | null {
    const account = this.accounts.find((entry) => entry.username === username && entry.password === password);
    if (!account) {
      return null;
    }

    return {
      id: account.id,
      username: account.username,
      displayName: account.displayName,
      role: account.role,
    };
  }
}