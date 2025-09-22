import { Request, Response } from "express";
import { TripRepository } from "../repositories/TripRepository";
import { UserRepository } from "../repositories/UserRepository";

const tripRepository = new TripRepository();
const userRepository = new UserRepository();

export class PostController {
  async list(req: Request, res: Response) {
    try {
      const posts = await tripRepository.findAllWithUser();
      return res.json(posts);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const trip = await tripRepository.findByIdWithUser(Number(id));
      if (!trip) return res.status(404).json({ message: "Trip not found" });

      return res.json(trip);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, destination, startDate, endDate } = req.body;
      const userId = req.user.id;

      if (!name || !destination || !startDate || !endDate) {
        return res
          .status(400)
          .json({ message: "Name, destination, startDate and endDate are required" });
      }

      const user = await userRepository.findById(Number(userId));
      if (!user) return res.status(404).json({ message: "User not found" });

      const post = await tripRepository.createAndSave({ name, destination, startDate, endDate, user });
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
      const { name, destination, startDate, endDate } = req.body;

      const trip = await tripRepository.findById(Number(id));
      if (!trip) return res.status(404).json({ message: "Post not found" });

      // Permite apenas autor ou admin editar
      if (req.user.role !== "admin" && trip.user?.id !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (name) trip.name = name;
      if (destination) trip.destination = destination;
      if (startDate) trip.startDate = startDate;
      if (endDate) trip.endDate = startDate;

      const updatedTrip = await tripRepository.save(trip);
      return res.json(updatedTrip);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const trip = await tripRepository.findById(Number(id));
      if (!trip) return res.status(404).json({ message: "Trip not found" });

      // Permite apenas autor ou admin deletar
      if (req.user.role !== "admin" && trip.user?.id !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await tripRepository.removePost(trip);
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}