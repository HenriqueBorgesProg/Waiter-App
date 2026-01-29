import type { Request, Response } from "express";
import { Order } from "../../models/Order.js";
import { io } from "../../../index.js";

export async function createOrder(req: Request, res: Response) {
  try {
    const { table, products } = req.body;

    const order = await Order.create({
      table,
      products,
    });
    const orderDetails = await order.populate("products.product");

    io.emit("orders@new", orderDetails);
    res.status(201).json(orderDetails);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
