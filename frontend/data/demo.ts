/**
 * Datos locales de demostración para la interfaz.
 * Se usan como respaldo cuando la API no devuelve recetas o eventos.
 *
 * @author Manuel García Nieto
 */
import type { ImageSourcePropType } from 'react-native'

export type Recipe = {
  id: number
  title: string
  category: string
  description: string
  ingredients?: string
  cookingTime: number
  servings: number
  image: ImageSourcePropType
}

export type Event = {
  id: number
  title: string
  description: string
  category?: string
  date: string
  duration: string
  image: ImageSourcePropType
}

export const recipes: Recipe[] = [
  {
    id: 1,
    title: 'Revuelto de tofu',
    category: 'Vegano',
    description: 'Una opción vegana con tofu especiado, verduras y cúrcuma para arrancar el día con energía.',
    ingredients: 'Tofu firme, pimiento, cebolla, cúrcuma, sal, pimienta y aceite de oliva.',
    cookingTime: 20,
    servings: 1,
    image: require('@/assets/dishcover/tofu.png'),
  },
  {
    id: 2,
    title: 'Bowl de quinoa y verduras',
    category: 'Vegano',
    description: 'Colorido, ligero y lleno de nutrientes, con quinoa, verduras frescas y aliño suave.',
    ingredients: 'Quinoa, calabacín, tomate, aguacate, maíz, limón y aceite de oliva.',
    cookingTime: 25,
    servings: 2,
    image: require('@/assets/dishcover/quinoa.png'),
  },
  {
    id: 3,
    title: 'Pasta al pesto',
    category: 'Pasta',
    description: 'Espaguetis con pesto de albahaca, aceite de oliva y un acabado muy aromático.',
    ingredients: 'Espaguetis, albahaca, piñones, ajo, parmesano y aceite de oliva.',
    cookingTime: 15,
    servings: 2,
    image: require('@/assets/dishcover/pasta.png'),
  },
  {
    id: 4,
    title: 'Mini burgers creativas',
    category: 'Carne',
    description: 'Pequeñas hamburguesas para compartir en eventos o cenas informales.',
    ingredients: 'Panecillos, carne picada, queso, tomate, lechuga y salsa suave.',
    cookingTime: 35,
    servings: 4,
    image: require('@/assets/dishcover/sliders.png'),
  },
  {
    id: 5,
    title: 'Ensalada mediterránea',
    category: 'Vegetariano',
    description: 'Tomate, pepino, aceitunas y queso fresco con un aliño suave de aceite de oliva.',
    ingredients: 'Tomate, pepino, aceitunas, queso fresco, orégano y aceite de oliva.',
    cookingTime: 12,
    servings: 2,
    image: require('@/assets/dishcover/quinoa.png'),
  },
  {
    id: 6,
    title: 'Tostas de verduras',
    category: 'Vegetariano',
    description: 'Pan crujiente con verduras asadas, hierbas aromáticas y un toque de aceite.',
    ingredients: 'Pan rústico, berenjena, pimiento, calabacín, tomillo y aceite de oliva.',
    cookingTime: 18,
    servings: 2,
    image: require('@/assets/dishcover/onboarding-plate.png'),
  },
  {
    id: 7,
    title: 'Pasta cremosa de setas',
    category: 'Pasta',
    description: 'Pasta corta con salsa de setas, ajo y especias para una comida rápida y sabrosa.',
    ingredients: 'Pasta corta, setas, ajo, nata vegetal, perejil y pimienta negra.',
    cookingTime: 22,
    servings: 2,
    image: require('@/assets/dishcover/pasta.png'),
  },
  {
    id: 8,
    title: 'Tacos de pescado',
    category: 'Pescado',
    description: 'Tortillas suaves con pescado especiado, verduras frescas y salsa cítrica.',
    ingredients: 'Tortillas, pescado blanco, col, lima, cilantro, yogur y especias.',
    cookingTime: 28,
    servings: 3,
    image: require('@/assets/dishcover/sliders.png'),
  },
  {
    id: 9,
    title: 'Brochetas de pollo',
    category: 'Carne',
    description: 'Pollo marinado con verduras, ideal para cocinar a la plancha o compartir.',
    ingredients: 'Pollo, pimiento, cebolla, calabacín, limón, ajo y especias.',
    cookingTime: 30,
    servings: 4,
    image: require('@/assets/dishcover/event-buffet.png'),
  },
  {
    id: 10,
    title: 'Crema de calabaza',
    category: 'Vegetariano',
    description: 'Crema suave de calabaza con especias, perfecta para una cena ligera.',
    ingredients: 'Calabaza, cebolla, caldo vegetal, jengibre, pimienta y aceite de oliva.',
    cookingTime: 35,
    servings: 3,
    image: require('@/assets/dishcover/tofu.png'),
  },
]

export const events: Event[] = [
  {
    id: 1,
    title: 'Saborea la comunidad',
    description: 'Talleres culinarios exclusivos y rutas gastronómicas locales.',
    category: 'Talleres',
    date: '12/01/2025',
    duration: '120 min',
    image: require('@/assets/dishcover/event-buffet.png'),
  },
  {
    id: 2,
    title: 'Street food internacional',
    description: 'Recetas urbanas para viajar por el mundo desde la cocina.',
    category: 'Street food',
    date: '02/02/2025',
    duration: '90 min',
    image: require('@/assets/dishcover/sliders.png'),
  },
]

export const categories = ['Vegano', 'Vegetariano', 'Carne', 'Pescado', 'Pasta']
