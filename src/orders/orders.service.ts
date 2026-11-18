import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class OrdersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async create(user_id: number, total_amount: number, order_date?: string) {
    const date = order_date || new Date().toISOString().slice(0, 10);
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO orders (id, total_amount, order_date) VALUES (?, ?, ?)',
      [user_id, total_amount, date],
    );
    return { order_id: result.insertId, id: user_id, total_amount, order_date: date };
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT o.order_id, o.order_date, o.total_amount, o.id AS user_id, u.username, o.created_at, o.updated_at
       FROM orders o
       LEFT JOIN users u ON o.id = u.id`,
    );
    return rows;
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT o.order_id, o.order_date, o.total_amount, o.id AS user_id, u.username, o.created_at, o.updated_at
       FROM orders o
       LEFT JOIN users u ON o.id = u.id
       WHERE o.order_id = ?`,
      [id],
    );
    if (!rows[0]) throw new NotFoundException('Order not found');
    return rows[0];
  }

  async update(
    id: number,
    partial: { total_amount?: number; order_date?: string; user_id?: number },
  ) {
    const fields: string[] = [];
    const values: any[] = [];
    if (partial.total_amount !== undefined) {
      fields.push('total_amount = ?');
      values.push(partial.total_amount);
    }
    if (partial.order_date !== undefined) {
      fields.push('order_date = ?');
      values.push(partial.order_date);
    }
    if (partial.user_id !== undefined) {
      fields.push('id = ?');
      values.push(partial.user_id);
    }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    await this.pool().execute(
      `UPDATE orders SET ${fields.join(', ')} WHERE order_id = ?`,
      values,
    );
    return this.findById(id);
  }

  async remove(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM orders WHERE order_id = ?',
      [id],
    );
    if (res.affectedRows === 0) throw new NotFoundException('Order not found');
    return { deleted: true };
  }
}
