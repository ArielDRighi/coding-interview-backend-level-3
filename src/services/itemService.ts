import prisma from "../database/client";

export interface ItemInput {
  name: string;
  price: number;
}

export interface Item {
  id: number;
  name: string;
  price: number;
}

export class ItemService {
  async getAllItems(): Promise<Item[]> {
    return prisma.item.findMany();
  }

  async getItemById(id: number): Promise<Item | null> {
    return prisma.item.findUnique({
      where: { id },
    });
  }

  async createItem(data: ItemInput): Promise<Item> {
    return prisma.item.create({
      data,
    });
  }

  async updateItem(id: number, data: ItemInput): Promise<Item | null> {
    return prisma.item.update({
      where: { id },
      data,
    });
  }

  async deleteItem(id: number): Promise<void> {
    await prisma.item.delete({
      where: { id },
    });
  }
}
