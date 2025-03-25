import { Server } from "@hapi/hapi";
import { ItemService } from "./services/itemService";
import { validateItem } from "./validation/itemValidation";

export const defineRoutes = (server: Server) => {
  const itemService = new ItemService();

  // Ping route (already defined)
  server.route({
    method: "GET",
    path: "/ping",
    handler: async (request, h) => {
      return {
        ok: true,
      };
    },
  });

  // Get all items
  server.route({
    method: "GET",
    path: "/items",
    handler: async (request, h) => {
      return await itemService.getAllItems();
    },
  });

  // Get item by id
  server.route({
    method: "GET",
    path: "/items/{id}",
    handler: async (request, h) => {
      const id = parseInt(request.params.id);
      const item = await itemService.getItemById(id);

      if (!item) {
        return h.response().code(404);
      }

      return item;
    },
  });

  // Create new item
  server.route({
    method: "POST",
    path: "/items",
    handler: async (request, h) => {
      const payload = request.payload as any;
      const validationErrors = validateItem(payload);

      if (validationErrors.length > 0) {
        return h.response({ errors: validationErrors }).code(400);
      }

      const item = await itemService.createItem(payload);
      return h.response(item).code(201);
    },
  });

  // Update item
  server.route({
    method: "PUT",
    path: "/items/{id}",
    handler: async (request, h) => {
      const id = parseInt(request.params.id);
      const payload = request.payload as any;

      const validationErrors = validateItem(payload);
      if (validationErrors.length > 0) {
        return h.response({ errors: validationErrors }).code(400);
      }

      const item = await itemService.updateItem(id, payload);

      if (!item) {
        return h.response().code(404);
      }

      return item;
    },
  });

  // Delete item
  server.route({
    method: "DELETE",
    path: "/items/{id}",
    handler: async (request, h) => {
      const id = parseInt(request.params.id);
      const item = await itemService.getItemById(id);

      if (!item) {
        return h.response().code(404);
      }

      await itemService.deleteItem(id);
      return h.response().code(204);
    },
  });
};
