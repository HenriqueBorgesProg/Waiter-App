import type { Request, Response } from 'express';
import { Order } from '../../models/Order.js';

export async function changeOrderStatus(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if(!['WAITING', 'IN_PRODUCTION', 'DONE'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido, deve ser WAITING, IN_PRODUCTION ou DONE' });
    }
    await Order.findByIdAndUpdate(orderId, { status});
    res.sendStatus(204);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }

}
