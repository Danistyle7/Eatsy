import { isAxiosError } from "axios";
import { z } from "zod";

import api from "@/lib/api";
import {
  DishCreate,
  dishCreateSchema,
  DishParams,
  dishParamsSchema,
  DishResponse,
  dishResponseSchema,
  DishUpdate,
  dishUpdateSchema,
} from "@/schemas/dish";

/**
 * Obtiene un plato por ID. Lanza error 404 si no existe.
 * @throws {Error} Si el plato no se encuentra.
 */
export const getDishById = async (id: number): Promise<DishResponse> => {
  try {
    const response = await api.get(`/dish/only/${id}`);
    return dishResponseSchema.parse(response.data);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      throw new Error("Plato no encontrado");
    }
    throw error;
  }
};

/**
 * Obtiene todos los platos, con filtros opcionales.
 */
export const getAllDishes = async (
  params?: DishParams
): Promise<DishResponse[]> => {
  const validatedParams = dishParamsSchema.parse(params || {});
  const response = await api.get("/dish/all", { params: validatedParams });
  return z.array(dishResponseSchema).parse(response.data);
};

/**
 * Crea un nuevo plato.
 */
export const createDish = async (dish: DishCreate): Promise<DishResponse> => {
  const validatedData = dishCreateSchema.parse(dish);
  const response = await api.post("/dish/create", validatedData);
  return dishResponseSchema.parse(response.data);
};

/**
 * Actualiza un plato existente.
 */
export const updateDishById = async (
  id: number,
  dish: DishUpdate
): Promise<DishResponse> => {
  const validatedData = dishUpdateSchema.parse(dish);
  const response = await api.put(`/dish/update/${id}`, validatedData);
  return dishResponseSchema.parse(response.data);
};

/**
 * Elimina un plato por ID.
 */
export const deleteDishById = async (id: number): Promise<void> => {
  try {
    await api.delete(`/dish/delete/${id}`);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404)
      throw new Error("No se pudo eliminar: Plato no encontrado");
    throw error;
  }
};
