import { pool, initializeDatabase } from '../config/database';
import { User, CreateUserDTO, UpdateUserDTO } from '../models/user.model';

export class UserRepository {
  async findAll(): Promise<User[]> {
    await initializeDatabase();
    const result = await pool.query<User>(
      'SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY id ASC'
    );
    return result.rows;
  }

  async findById(id: number): Promise<User | null> {
    await initializeDatabase();
    const result = await pool.query<User>(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    await initializeDatabase();
    const result = await pool.query<User>(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateUserDTO): Promise<User> {
    await initializeDatabase();
    const { name, email, role = 'user' } = data;
    const result = await pool.query<User>(
      `INSERT INTO users (name, email, role)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role, created_at, updated_at`,
      [name, email, role]
    );
    return result.rows[0];
  }

  async update(id: number, data: UpdateUserDTO): Promise<User | null> {
    await initializeDatabase();
    const result = await pool.query<User>(
      `UPDATE users
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           role = COALESCE($3, role),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, name, email, role, created_at, updated_at`,
      [data.name ?? null, data.email ?? null, data.role ?? null, id]
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    await initializeDatabase();
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
