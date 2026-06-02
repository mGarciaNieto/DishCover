/**
 * Categorías disponibles para crear y editar recetas.
 * Mantiene alineado el selector del frontend con las categorías inicializadas en MySQL.
 *
 * @author Manuel García Nieto
 */
export const recipeCategories = ['Vegano', 'Vegetariano', 'Carne', 'Pescado', 'Pasta', 'Pizza', 'Ensalada', 'Postre', 'Bebidas', 'Desayuno', 'Sopa'] as const

export type RecipeCategory = (typeof recipeCategories)[number]
