import { Request, Response } from "express";
import { ItemRepository } from "../repositories/ItemRepository";
import { UserRepository } from "../repositories/UserRepository";

const itemRepository = new ItemRepository();
const userRepository = new UserRepository();

export class ItemController {
  async list(req: Request, res: Response) {
    try {
      const posts = await itemRepository.findAllWithUser();
      return res.json(posts);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro no servidor interno" });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const trip = await itemRepository.findByIdWithUser(Number(id));
      if (!trip) return res.status(404).json({ message: "Item não encontrado" });

      return res.json(trip);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro no servidor interno" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, category } = req.body;
      const userId = req.user.id;

      if (!name || !category ) {
        return res
          .status(400)
          .json({ message: "Name and category are required" });
      }

      const user = await userRepository.findById(Number(userId));
      if (!user) return res.status(404).json({ message: "User not found" });

      const post = await itemRepository.createAndSave({ name, category, user });
      return res.status(201).json(post);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { name, category } = req.body;

      const item = await itemRepository.findById(Number(id));
      if (!item) return res.status(404).json({ message: "Post not found" });

      // Permite apenas autor ou admin editar
      if (req.user.role !== "admin" && item.user?.id !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (name) item.name = name;
      if (category) item.category = category;

      const updatedItem = await itemRepository.save(item);
      return res.json(updatedItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const item = await itemRepository.findById(Number(id));
      if (!item) return res.status(404).json({ message: "Trip not found" });

      // Permite apenas autor ou admin deletar
      if (req.user.role !== "admin" && item.user?.id !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await itemRepository.removePost(item);
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
