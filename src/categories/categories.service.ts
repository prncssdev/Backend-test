import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class CategoriesService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async create(category_name: string, descriptionx?: string) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO categories (category_name, descriptionx) VALUES (?, ?)',
      [category_name, descriptionx ?? null],
    );
    return { category_id: result.insertId, category_name, descriptionx };
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT category_id, category_name, descriptionx, created_at, updated_at FROM categories',
    );
    return rows;
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT category_id, category_name, descriptionx, created_at, updated_at FROM categories WHERE category_id = ?',
      [id],
    );
    if (!rows[0]) throw new NotFoundException('Category not found');
    return rows[0];
  }

  async update(id: number, partial: { category_name?: string; descriptionx?: string }) {
    const fields: string[] = [];
    const values: any[] = [];
    if (partial.category_name) {
      fields.push('category_name = ?');
      values.push(partial.category_name);
    }
    if (partial.descriptionx !== undefined) {
      fields.push('descriptionx = ?');
      values.push(partial.descriptionx);
    }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    await this.pool().execute(
      `UPDATE categories SET ${fields.join(', ')} WHERE category_id = ?`,
      values,
    );
    return this.findById(id);
  }

  async remove(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM categories WHERE category_id = ?',
      [id],
    );
    if (res.affectedRows === 0) throw new NotFoundException('Category not found');
    return { deleted: true };
  }
}