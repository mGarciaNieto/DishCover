/**
 * Pruebas de la pantalla principal de recetas.
 * Verifica que el listado se renderiza con FlatList y permite filtrar contenido.
 *
 * @author Manuel García Nieto
 */
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { FlatList } from 'react-native'
import HomeScreen from '@/app/(tabs)/index'

let mockToken: string | null = null
const mockFetchRecipes = jest.fn()

jest.mock('expo-router', () => ({
  useFocusEffect(callback: () => void | (() => void)) {
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
  fetchRecipes: (...args: unknown[]) => mockFetchRecipes(...args),
}))

describe('HomeScreen', () => {
  beforeEach(() => {
    mockToken = null
    mockFetchRecipes.mockReset()
  })

  test('muestra varias recetas de demostración en un FlatList', () => {
    const { UNSAFE_getByType, getByText } = render(<HomeScreen />)
    const list = UNSAFE_getByType(FlatList)

    expect(list.props.data.length).toBeGreaterThanOrEqual(8)
    expect(getByText('Revuelto de tofu')).toBeTruthy()
    expect(getByText('Crema de calabaza')).toBeTruthy()
  })

  test('filtra recetas por texto de búsqueda', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<HomeScreen />)

    fireEvent.changeText(getByPlaceholderText('Buscar recetas...'), 'pesto')

    expect(getByText('Pasta al pesto')).toBeTruthy()
    expect(queryByText('Revuelto de tofu')).toBeNull()
  })

  test('filtra recetas por categoría', () => {
    const { getAllByText, getByText, queryByText } = render(<HomeScreen />)

    fireEvent.press(getAllByText('Pescado')[0])

    expect(getByText('Tacos de pescado')).toBeTruthy()
    expect(queryByText('Revuelto de tofu')).toBeNull()
  })

  test('mantiene recetas de demostración si la API devuelve una lista vacía', async () => {
    mockToken = 'token-academico'
    mockFetchRecipes.mockResolvedValue([])

    const { getByText } = render(<HomeScreen />)

    await waitFor(() => expect(mockFetchRecipes).toHaveBeenCalledWith('token-academico'))
    expect(getByText('Revuelto de tofu')).toBeTruthy()
    expect(getByText('Crema de calabaza')).toBeTruthy()
  })
})
