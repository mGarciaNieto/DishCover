/**
 * Pruebas de la pestaña de favoritos.
 * Verifica que la pantalla muestra únicamente las recetas favoritas del usuario activo.
 *
 * @author Manuel García Nieto
 */
import { render, waitFor } from '@testing-library/react-native'
import LikesScreen from '@/app/(tabs)/likes'
import { fetchFavoriteRecipeIds, fetchRecipeById } from '@/services/api'

let mockToken: string | null = null

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = jest.requireActual<typeof import('react')>('react')
    React.useEffect(() => callback(), [callback])
  },
}))

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    token: mockToken,
  }),
}))

jest.mock('@/services/api', () => ({
  fetchFavoriteRecipeIds: jest.fn(),
  fetchRecipeById: jest.fn(),
}))

describe('LikesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockToken = null
  })

  test('no muestra recetas predeterminadas si el usuario no tiene sesión', () => {
    const { getByText, queryByText } = render(<LikesScreen />)

    expect(getByText('Todavía no has guardado ninguna receta como favorita.')).toBeTruthy()
    expect(queryByText('Revuelto de tofu')).toBeNull()
  })

  test('carga y muestra solo las recetas favoritas del usuario', async () => {
    mockToken = 'token-academico'
    ;(fetchFavoriteRecipeIds as jest.Mock).mockResolvedValue([3])
    ;(fetchRecipeById as jest.Mock).mockResolvedValue({
      id: 3,
      title: 'Pasta favorita',
      category: 'Pasta',
      description: 'Receta marcada por el usuario.',
      cookingTime: 15,
      servings: 2,
      image: require('@/assets/dishcover/pasta.png'),
    })

    const { getByText, queryByText } = render(<LikesScreen />)

    await waitFor(() => expect(getByText('Pasta favorita')).toBeTruthy())
    expect(queryByText('Revuelto de tofu')).toBeNull()
    expect(fetchFavoriteRecipeIds).toHaveBeenCalledWith('token-academico')
    expect(fetchRecipeById).toHaveBeenCalledWith('token-academico', 3)
  })
})
