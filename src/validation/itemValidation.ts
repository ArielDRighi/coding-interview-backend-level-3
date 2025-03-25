import Joi from "joi";

export interface ValidationError {
  field: string;
  message: string;
}

export const validateItem = (data: any): ValidationError[] => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(0),
  });

  const { error } = schema.validate(data, { abortEarly: false });

  if (!error) return [];

  return error.details.map((detail) => {
    const field = detail.path[0].toString();

    if (field === "price" && !data.price && data.price !== 0) {
      return {
        field,
        message: `Field "${field}" is required`,
      };
    }

    if (field === "price" && data.price < 0) {
      return {
        field,
        message: `Field "${field}" cannot be negative`,
      };
    }

    return {
      field,
      message: `Field "${field}" is required`,
    };
  });
};
