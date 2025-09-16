// services/ChecklistService.ts
import { AppDataSource } from "../config/data-source";
import { Trip } from "../models/Trip";
import { Item } from "../models/Item";
import { User } from "../models/User";

export class ChecklistService {
    /**
     * Gera checklist automático para uma Trip
     * @param trip Trip criada
     * @param user Usuário dono da trip
     * @param temperature Temperatura média prevista em °C
     * @param autoGenerate Se true, gera os itens; se false, retorna lista vazia
     */
    
    static async generateChecklist(trip: Trip, user: User, temperature: number, autoGenerate: boolean): Promise<Item[]> {
        if (!autoGenerate) return [];

        const itemRepo = AppDataSource.getRepository(Item);
        const items: Item[] = [];

        // Itens extras fixos
        const fixedItems = [
            { name: "Documentos", category: "documentos" },
            { name: "Remédios", category: "remedios" },
            { name: "Carregador", category: "eletronicos" },
            { name: "Produtos de Higiene", category: "higiene" },
        ];

        fixedItems.forEach(f => {
            const item = itemRepo.create({
                name: f.name,
                category: f.category,
                trip,
                user
            });
            items.push(item);
        });

        // Itens básicos de vestuário ajustados pela temperatura
        let clothingItems: { name: string; category: string }[] = [];

        if (temperature >= 25) { // quente
            clothingItems = [
                { name: "Camisetas", category: "roupas" },
                { name: "Shorts", category: "roupas" },
                { name: "Roupas íntimas", category: "roupas" },
                { name: "Chinelos", category: "calçados" }
            ];
        } else if (temperature >= 15) { // ameno
            clothingItems = [
                { name: "Camisetas", category: "roupas" },
                { name: "Calças leves", category: "roupas" },
                { name: "Roupas íntimas", category: "roupas" },
                { name: "Tênis ou sapatos confortáveis", category: "calçados" }
            ];
        } else { // frio
            clothingItems = [
                { name: "Camisetas de manga longa", category: "roupas" },
                { name: "Calças quentes", category: "roupas" },
                { name: "Roupas íntimas térmicas", category: "roupas" },
                { name: "Casaco", category: "roupas" },
                { name: "Luvas", category: "acessorios" },
                { name: "Cachecol", category: "acessorios" },
                { name: "Botas ou calçados fechados", category: "calçados" }
            ];
        }

        clothingItems.forEach(f => {
            const item = itemRepo.create({
                name: f.name,
                category: f.category,
                trip,
                user
            });
            items.push(item);
        });

        // Itens específicos pelo tipo de viagem
        const typeBasedItems: Record<string, { name: string; category: string }[]> = {
            praia: [
                { name: "Toalha", category: "roupas" },
                { name: "Óculos de sol", category: "acessorios" },
                { name: "Protetor solar", category: "extras" },
            ],
            negocios: [
                { name: "Notebook", category: "eletronicos" },
                { name: "Roupas formais", category: "roupas" },
                { name: "Cartões de visita", category: "extras" },
            ],
            inverno: [
                { name: "Casaco extra", category: "roupas" },
                { name: "Gorro", category: "acessorios" },
            ],
            aventura: [
                { name: "Mochila", category: "acessorios" },
                { name: "Lanterna", category: "extras" },
                { name: "Tênis confortável", category: "calçados" },
            ],
            outro: [],
        };

        (typeBasedItems[trip.type] || []).forEach(f => {
            const item = itemRepo.create({
                name: f.name,
                category: f.category,
                trip,
                user
            });
            items.push(item);
        });

        // 4️⃣ Salva itens no banco
        await itemRepo.save(items);

        return items;
    }
}
