import type { Request, Response } from "express";
import { Category } from "../../models/Category.js";

export async function createCategory(req: Request, res: Response) {
  try {
    const { name, icon } = req.body;

  const category = await Category.create({
    name,
    icon,
  });

  res.json(category);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }

}
