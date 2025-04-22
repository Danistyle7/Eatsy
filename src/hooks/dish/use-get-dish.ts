import { useQuery } from "@tanstack/react-query";

import { getAllDishes, getDishById } from "@/api/dish";
import { DishParams, DishResponse } from "@/schemas/dish";

/**
 * Recupera todos los platos con soporte para filtrado y paginación.
 *
 * @param {?DishParams} params - Parámetros opcionales:
 *   - `category`: Filtra por categoría (ej: "Postres").
 *   - `page`: Número de página (para paginación).
 *
 * @returns {QueryResult<DishResponse[], Error>} - Lista de platos.
 *
 * @example
 * // Filtra platos por categoría
 * const { data: dishes } = useGetAllDishes({ category: "Postres" });
 *
 * @see DishParams para más opciones de filtrado.
 */
export const useGetAllDishes = (params?: DishParams) => {
  return useQuery<DishResponse[], Error>({
    queryKey: ["dishes", params],
    queryFn: () => getAllDishes(params),
  });
};

/**
 * Obtiene un plato específico por ID con manejo de caché automático.
 *
 * @param {number} id - ID del plato a recuperar.
 * @param {?Object} options - Opciones adicionales de React Query.
 * @param {?boolean} options.enabled - Si es `false`, pausa la consulta (útil para dependencias).
 *
 * @returns {QueryResult<DishResponse, Error>} - Objeto con:
 *   - `data`: Plato recuperado (undefined si está cargando o no existe).
 *   - `isLoading`: Estado de carga inicial.
 *   - `isError`: True si falló la petición.
 *   - `error`: Objeto de error (si `isError` es true).
 *
 * @throws {Error} - Si el plato no existe (status 404).
 *
 * @example
 * const { data: dish, isLoading } = useGetDishById(1);
 * if (isLoading) return <Spinner />;
 * return <DishDetail dish={dish} />;
 */
export const useGetDishById = (id: number, options = {}) => {
  return useQuery<DishResponse, Error>({
    queryKey: ["dish", id],
    queryFn: () => getDishById(id),
    enabled: !!id, // Solo ejecuta si el ID existe
    ...options,
  });
};
