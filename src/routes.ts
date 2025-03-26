import { Server } from "@hapi/hapi";
import { ItemService } from "./services/itemService";
import { validateItem } from "./validation/itemValidation";
import Joi from "joi";

export const defineRoutes = (server: Server) => {
  const itemService = new ItemService();

  // Ping route
  server.route({
    method: "GET",
    path: "/ping",
    options: {
      tags: ["api"],
      description: "Health check endpoint",
      response: {
        schema: Joi.object({
          ok: Joi.boolean().required(),
        }),
      },
    },
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
    options: {
      tags: ["api", "items"],
      description: "Get all items",
      response: {
        schema: Joi.array().items(
          Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
            price: Joi.number().required(),
          })
        ),
      },
    },
    handler: async (request, h) => {
      return await itemService.getAllItems();
    },
  });

  // Get item by id
  server.route({
    method: "GET",
    path: "/items/{id}",
    options: {
      tags: ["api", "items"],
      description: "Get item by ID",
      validate: {
        params: Joi.object({
          id: Joi.number().required().description("Item ID"),
        }),
      },
      response: {
        schema: Joi.object({
          id: Joi.number().required(),
          name: Joi.string().required(),
          price: Joi.number().required(),
        }).description("Item details"),
        failAction: "log",
      },
    },
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
    options: {
      tags: ["api", "items"],
      description: "Create a new item",
      validate: {
        payload: Joi.object({
          name: Joi.string().required().description("Item name"),
          price: Joi.number().description("Item price (must be non-negative)"),
        }),
        failAction: (request, h, err) => {
          // Allows our custom validation to handle the error
          return h.continue;
        },
      },
      response: {
        schema: Joi.object({
          id: Joi.number().required(),
          name: Joi.string().required(),
          price: Joi.number().required(),
        }).description("Created item"),
        failAction: "log",
        status: {
          400: Joi.object({
            errors: Joi.array()
              .items(
                Joi.object({
                  field: Joi.string().required(),
                  message: Joi.string().required(),
                })
              )
              .required(),
          }).description("Validation Error Response"),
        },
      },
    },
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
    options: {
      tags: ["api", "items"],
      description: "Update an existing item",
      validate: {
        params: Joi.object({
          id: Joi.number().required().description("Item ID"),
        }),
        payload: Joi.object({
          name: Joi.string().required().description("Item name"),
          price: Joi.number().description("Item price (must be non-negative)"),
        }),
        failAction: (request, h, err) => {
          // Allows our custom validation to handle the error
          return h.continue;
        },
      },
      response: {
        schema: Joi.object({
          id: Joi.number().required(),
          name: Joi.string().required(),
          price: Joi.number().required(),
        }).description("Updated item"),
        failAction: "log",
        status: {
          400: Joi.object({
            errors: Joi.array()
              .items(
                Joi.object({
                  field: Joi.string().required(),
                  message: Joi.string().required(),
                })
              )
              .required(),
          }).description("Validation Error Response"),
          404: Joi.any().description("Item not found"),
        },
      },
    },
    handler: async (request, h) => {
      try {
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
      } catch (error) {
        console.error("Error updating item:", error);
        return h.response({ error: "Internal Server Error" }).code(500);
      }
    },
  });

  // Delete item
  server.route({
    method: "DELETE",
    path: "/items/{id}",
    options: {
      tags: ["api", "items"],
      description: "Delete an item",
      validate: {
        params: Joi.object({
          id: Joi.number().required().description("Item ID"),
        }),
      },
      response: {
        schema: Joi.object().description("No content"),
        failAction: "log",
      },
    },
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
