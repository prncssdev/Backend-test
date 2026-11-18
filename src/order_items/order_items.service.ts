import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class Order_itemsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async create(order_id: number, flower_id: number, quantity: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO order_items (order_id, flower_id, quantity) VALUES (?, ?, ?)',
      [order_id, flower_id, quantity],
    );
    return { order_item_id: result.insertId, order_id, flower_id, quantity };
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT oi.order_item_id, oi.order_id, oi.flower_id, oi.quantity,
              f.flower_name, f.price
       FROM order_items oi
       LEFT JOIN flowers f ON oi.flower_id = f.flower_id`,
    );
    return rows;
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      `SELECT oi.order_item_id, oi.order_id, oi.flower_id, oi.quantity,
              f.flower_name, f.price
       FROM order_items oi
       LEFT JOIN flowers f ON oi.flower_id = f.flower_id
       WHERE oi.order_item_id = ?`,
      [id],
    );
    if (!rows[0]) throw new NotFoundException('Order item not found');
    return rows[0];
  }

  async update(
    id: number,
    partial: { order_id?: number; flower_id?: number; quantity?: number },
  ) {
    const fields: string[] = [];
    const values: any[] = [];
    if (partial.order_id !== undefined) {
      fields.push('order_id = ?');
      values.push(partial.order_id);
    }
    if (partial.flower_id !== undefined) {
      fields.push('flower_id = ?');
      values.push(partial.flower_id);
    }
    if (partial.quantity !== undefined) {
      fields.push('quantity = ?');
      values.push(partial.quantity);
    }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    await this.pool().execute(
      `UPDATE order_items SET ${fields.join(', ')} WHERE order_item_id = ?`,
      values,
    );
    return this.findById(id);
  }

  async remove(id: number) {
    const [res] = await this.pool().execute<OkPacket>(
      'DELETE FROM order_items WHERE order_item_id = ?',
      [id],
    );
    if (res.affectedRows === 0) throw new NotFoundException('Order item not found');
    return { deleted: true };
  }
}
