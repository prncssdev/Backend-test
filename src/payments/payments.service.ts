import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class PaymentsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async create(order_id: number, amount: number, payment_status: string = 'Paid', payment_date?: string) {
    const date = payment_date || new Date().toISOString().slice(0, 10);
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO payments (order_id, amount, payment_status, payment_date) VALUES (?, ?, ?, ?)',
      [order_id, amount, payment_status, date],
    );
    return { payment_id: result.insertId, order_id, amount, payment_status, payment_date: date };
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT payment_id, order_id, amount, payment_status, payment_date FROM payments',
    );
    return rows;
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT payment_id, order_id, amount, payment_status, payment_date FROM payments WHERE payment_id = ?',
      [id],
    );
    if (!rows[0]) throw new NotFoundException('Payment not found');
    return rows[0];
  }

  async update(id: number, partial: { amount?: number; payment_status?: string; payment_date?: string }) {
    const fields: string[] = [];
    const values: any[] = [];
    if (partial.amount !== undefined) {
      fields.push('amount = ?');
      values.push(partial.amount);
    }
    if (partial.payment_status !== undefined) {
      fields.push('payment_status = ?');
      values.push(partial.payment_status);
    }
    if (partial.payment_date !== undefined) {
      fields.push('payment_date = ?');
      values.push(partial.payment_date);
    }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    await this.pool().execute(`UPDATE payments SET ${fields.join(', ')} WHERE payment_id = ?`, values);
    return this.findById(id);
  }

  async remove(id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM payments WHERE payment_id = ?', [id]);
    if (res.affectedRows === 0) throw new NotFoundException('Payment not found');
    return { deleted: true };
  }
}
