/**
 * Pruebas de la pantalla de creación de recetas.
 * Verifica las validaciones principales y el envío correcto del formulario al backend.
 *
 * @author Manuel García Nieto
 */
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import CreateRecipeScreen from '@/app/recipe/create'
import { createRecipe } from '@/services/api'

jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}))

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    token: 'token-academico',
  }),
}))

jest.mock('@/services/api', () => ({
  createRecipe: jest.fn(),
}))

describe('CreateRecipeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined)
  })

  test('muestra los campos principales del formulario', () => {
    const { getByPlaceholderText, getByText } = render(<CreateRecipeScreen />)

    expect(getByText('Nueva receta')).toBeTruthy()
    expect(getByPlaceholderText('Título')).toBeTruthy()
    expect(getByPlaceholderText('Descripción')).toBeTruthy()
    expect(getByPlaceholderText('https://ejemplo.com/imagen.jpg')).toBeTruthy()
    expect(getByPlaceholderText('Minutos')).toBeTruthy()
    expect(getByPlaceholderText('Ingredientes necesarios')).toBeTruthy()
    expect(getByText('Pizza')).toBeTruthy()
    expect(getByText('Ensalada')).toBeTruthy()
    expect(getByText('Postre')).toBeTruthy()
    expect(getByText('Bebidas')).toBeTruthy()
    expect(getByText('Desayuno')).toBeTruthy()
    expect(getByText('Sopa')).toBeTruthy()
  })

  test('muestra alerta si faltan datos obligatorios', () => {
    const { getByText } = render(<CreateRecipeScreen />)

    fireEvent.press(getByText('Publicar receta'))

    expect(Alert.alert).toHaveBeenCalledWith('Faltan datos', 'Completa todos los campos antes de publicar la receta.')
    expect(createRecipe).not.toHaveBeenCalled()
  })

  test('envía el formulario con el formato esperado por Spring Boot', async () => {
    ;(createRecipe as jest.Mock).mockResolvedValue(undefined)
    const { getByPlaceholderText, getByText } = render(<CreateRecipeScreen />)

    fireEvent.changeText(getByPlaceholderText('Título'), 'Crema de calabaza')
    fireEvent.changeText(getByPlaceholderText('Descripción'), 'Receta suave para una cena saludable.')
    fireEvent.changeText(getByPlaceholderText('https://ejemplo.com/imagen.jpg'), 'https://example.com/crema.jpg')
    fireEvent.changeText(getByPlaceholderText('Minutos'), '35')
    fireEvent.changeText(getByPlaceholderText('Ingredientes necesarios'), 'Calabaza, puerro, aceite de oliva y sal')
    fireEvent.press(getByText('Publicar receta'))

    await waitFor(() => {
      expect(createRecipe).toHaveBeenCalledWith('token-academico', {
        title: 'Crema de calabaza',
        imageUrl: 'https://example.com/crema.jpg',
        description: 'Receta suave para una cena saludable.',
        cookingTime: 35,
        numPersons: 4,
        ingredients: 'Calabaza, puerro, aceite de oliva y sal',
        recipeCategory: 'Vegano',
      })
      expect(Alert.alert).toHaveBeenCalledWith('Receta creada', 'La receta se ha publicado correctamente.')
      expect(router.back).toHaveBeenCalled()
    })
  })
})
