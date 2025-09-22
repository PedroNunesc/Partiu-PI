import { AppDataSource } from './config/data-source';
import { User } from "./models/User";

async function createAdmin() {
    await AppDataSource.initialize();

    const user = new User("Admin", "admin@gmail.com", "root");
    user.role = "admin"; // Para poder usar as rotas protegidas
    await AppDataSource.manager.save(user);

    console.log("Admin criado com sucesso!");
    process.exit(0);
}

createAdmin().catch(console.error);
