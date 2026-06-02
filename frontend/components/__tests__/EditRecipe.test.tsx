/**
 * Pruebas de la pantalla de edición de recetas.
 * Verifica que se cargan las recetas del usuario y se navega al formulario de edición.
 *
 * @author Manuel García Nieto
 */
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { router } from 'expo-router'
import EditRecipeScreen from '@/app/recipe/edit'
import { fetchMyRecipes } from '@/services/api'

jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
    push: jest.fn(),
  },
  useFocusEffect(callback: () => void | (() => void)) {
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
  fetchMyRecipes: jest.fn(),
}))

describe('EditRecipeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('muestra las recetas propias y navega al detalle de edición', async () => {
    ;(fetchMyRecipes as jest.Mock).mockResolvedValue([
      {
        id: 7,
        title: 'Crema de calabaza',
        category: 'Sopa',
        description: 'Una crema suave para cenar.',
        cookingTime: 35,
        servings: 2,
        image: { uri: 'https://example.com/crema.jpg' },
      },
    ])

    const { getByText } = render(<EditRecipeScreen />)

    await waitFor(() => {
      expect(getByText('Crema de calabaza')).toBeTruthy()
    })

    fireEvent.press(getByText('Crema de calabaza'))

    expect(fetchMyRecipes).toHaveBeenCalledWith('token-academico')
    expect(router.push).toHaveBeenCalledWith({ pathname: '/recipe/edit/[id]', params: { id: '7' } })
  })
})
