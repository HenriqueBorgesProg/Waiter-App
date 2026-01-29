import type{Request, Response} from 'express';
import { Category } from '../../models/Category.js';

export async function deleteCategory(req: Request, res: Response) {
  const { categoryId } = req.params;

  await Category.findByIdAndDelete(categoryId);

  res.status(204).send();
}
