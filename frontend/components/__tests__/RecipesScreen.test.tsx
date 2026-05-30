/**
 * Pruebas de la pantalla de gestión de recetas.
 * Verifica que se muestran las opciones principales de crear, editar y eliminar recetas.
 *
 * @author Manuel García Nieto
 */
import { fireEvent, render } from '@testing-library/react-native'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import RecipesScreen from '@/app/(tabs)/recipes'

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}))

describe('RecipesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined)
  })

  test('muestra las acciones principales de gestión de recetas', () => {
    const { getAllByText, getByText } = render(<RecipesScreen />)

    expect(getAllByText('Gestor de recetas')).toHaveLength(1)
    expect(getByText('Crear receta')).toBeTruthy()
    expect(getByText('Editar receta')).toBeTruthy()
    expect(getByText('Eliminar receta')).toBeTruthy()
  })

  test('navega a la pantalla de creación de recetas', () => {
    const { getByText } = render(<RecipesScreen />)

    fireEvent.press(getByText('Crear receta'))

    expect(router.push).toHaveBeenCalledWith('/recipe/create')
  })

  test('navega a la pantalla de eliminación de recetas', () => {
    const { getByText } = render(<RecipesScreen />)

    fireEvent.press(getByText('Eliminar receta'))

    expect(router.push).toHaveBeenCalledWith('/recipe/delete')
  })
})
