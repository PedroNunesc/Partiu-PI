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

        if (temperature >= 23) { // quente
            clothingItems = [
                { name: "Blusas", category: "roupas" },
                { name: "Bermudas", category: "roupas" },
                { name: "Calças", category: "roupas"},
                { name: "Roupas íntimas", category: "roupas" },
                { name: "Tênis", category: "calçados"},
                { name: "Chinelos", category: "calçados" }
            ];
        } else if (temperature >= 13) { // ameno
            clothingItems = [
                { name: "Blusas", category: "roupas" },
                { name: "Blusas de manga longa", category: "roupas" },
                { name: "Bermudas", category: "roupas" },
                { name: "Calças", category: "roupas" },
                { name: "Roupas íntimas", category: "roupas" },
                { name: "Tênis", category: "calçados" },
                { name: "Chinelos", category: "calçados" }
            ];
        } else {
            clothingItems = [
                { name: "Camisetas de manga longa", category: "roupas" },
                { name: "Calças ", category: "roupas" },
                { name: "Roupas íntimas", category: "roupas" },
                { name: "Tênis", category: "roupas" },
                { name: "Casaco", category: "roupas" }
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
                { name: "Roupas de Banho", category: "roupas"},
                { name: "Toalha", category: "outros" },
                { name: "Óculos de sol", category: "acessorios" },
                { name: "Protetor solar", category: "outros" },
            ],
            negocios: [
                { name: "Notebook", category: "eletronicos" },
                { name: "Roupas formais", category: "roupas" },
                { name: "Cartões de visita", category: "outros" },
            ],
            inverno: [
                { name: "Gorro", category: "acessorios" },
                { name: "Luvas", category: "acessorios" },
                { name: "Cachecol", category: "acessorios" },
                { name: "Botas", category: "calçados" }
            ],
            trilha: [
                { name: "Mochila", category: "acessorios" },
                { name: "Repelente", category: "extras" },
                { name: "Protetor Solar", category: "extras" },
                { name: "Boné", category: "acessorios"}
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

        // Salva itens no banco
        await itemRepo.save(items);

        return items;
    }
}
