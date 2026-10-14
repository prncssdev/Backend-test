import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class OrdersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async create(flower_name: string, price: number, category_id: number) {
    try {
      const [result] = await this.pool().execute<OkPacket>(
        'INSERT INTO orders (flower_name, price, category_id) VALUES (?, ?, ?)',
        [flower_name, price, category_id],
      );
      return { flower_id: result.insertId, flower_name, price, category_id };
    } catch (err: any) {
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new BadRequestException('category_id does not exist');
      }
      throw err;
    }
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT f.flower_id, f.flower_name, f.price, f.category_id,
              c.category_name, f.created_at, f.updated_at
       FROM orders f
       JOIN categories c ON f.category_id = c.category_id`,
    );
    return rows;
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT f.flower_id, f.flower_name, f.price, f.category_id,
              c.category_name, f.created_at, f.updated_at
       FROM orders f
       JOIN categories c ON f.category_id = c.category_id
       WHERE f.flower_id = ?`,
      [id],
    );
    if (!rows[0]) throw new NotFoundException('Flower not found');
    return rows[0];
  }

  async update(
    id: number,
    partial: { flower_name?: string; price?: number; category_id?: number },
  ) {
    const fields: string[] = [];
    const values: any[] = [];
    if (partial.flower_name !== undefined) {
      fields.push('flower_name = ?');
      values.push(partial.flower_name);
    }
    if (partial.price !== undefined) {
      fields.push('price = ?');
      values.push(partial.price);
    }
    if (partial.category_id !== undefined) {
      fields.push('category_id = ?');
      values.push(partial.category_id);
    }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    try {
      await this.pool().execute(
        `UPDATE orders SET ${fields.join(', ')} WHERE flower_id = ?`,
        values,
      );
    } catch (err: any) {
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        throw new BadRequestException('category_id does not exist');
      }
      throw err;
    }
    return this.findById(id);
  }

  async remove(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM orders WHERE flower_id = ?',
      [id],
    );
    if (res.affectedRows === 0) throw new NotFoundException('Flower not found');
    return { deleted: true };
  }
}