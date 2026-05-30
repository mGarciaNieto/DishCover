/**
 * Pruebas de la pantalla de eliminación de recetas.
 * Comprueba la carga de recetas y la eliminación confirmada por el usuario.
 *
 * @author Manuel García Nieto
 */
import { act, fireEvent, render, waitFor } from '@testing-library/react-native'
import { Alert } from 'react-native'
import DeleteRecipeScreen from '@/app/recipe/delete'
import { deleteRecipe, fetchRecipes } from '@/services/api'

jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = jest.requireActual<typeof import('react')>('react')
    React.useEffect(() => callback(), [callback])
  },
}))

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    token: 'token-academico',
  }),
}))

jest.mock('@/services/api', () => ({
  deleteRecipe: jest.fn(),
  fetchRecipes: jest.fn(),
}))

describe('DeleteRecipeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined)
  })

  test('muestra las recetas disponibles para eliminar', async () => {
    ;(fetchRecipes as jest.Mock).mockResolvedValue([
      {
        id: 1,
        title: 'Receta eliminable',
        category: 'Vegano',
        description: 'Receta disponible en backend.',
        cookingTime: 20,
        servings: 1,
        image: require('@/assets/dishcover/tofu.png'),
      },
    ])

    const { getByText } = render(<DeleteRecipeScreen />)

    await waitFor(() => expect(getByText('Receta eliminable')).toBeTruthy())
    expect(fetchRecipes).toHaveBeenCalledWith('token-academico')
  })

  test('elimina una receta tras confirmar la alerta', async () => {
    ;(fetchRecipes as jest.Mock).mockResolvedValue([
      {
        id: 1,
        title: 'Receta eliminable',
        category: 'Vegano',
        description: 'Receta disponible en backend.',
        cookingTime: 20,
        servings: 1,
        image: require('@/assets/dishcover/tofu.png'),
      },
    ])
    ;(deleteRecipe as jest.Mock).mockResolvedValue(undefined)

    const { getByText, queryByText } = render(<DeleteRecipeScreen />)

    await waitFor(() => expect(getByText('Receta eliminable')).toBeTruthy())
    fireEvent.press(getByText('Eliminar'))

    const [, , buttons] = (Alert.alert as jest.Mock).mock.calls[0]
    await act(async () => {
      await buttons[1].onPress()
    })

    await waitFor(() => {
      expect(deleteRecipe).toHaveBeenCalledWith('token-academico', 1)
      expect(queryByText('Receta eliminable')).toBeNull()
    })
  })
})
