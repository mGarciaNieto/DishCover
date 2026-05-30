/**
 * Pruebas de la pantalla de todos los eventos.
 * Verifica la carga desde backend, el respaldo local y el filtrado por búsqueda.
 *
 * @author Manuel García Nieto
 */
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import AllEventsScreen from '@/app/event/all'
import { fetchEvents } from '@/services/api'

let mockToken: string | null = null

jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}))

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    token: mockToken,
  }),
}))

jest.mock('@/services/api', () => ({
  fetchEvents: jest.fn(),
}))

describe('AllEventsScreen', () => {
  beforeEach(() => {
    mockToken = null
    jest.clearAllMocks()
  })

  test('muestra eventos locales si no hay token activo', () => {
    const { getByText } = render(<AllEventsScreen />)

    expect(getByText('Todos los eventos')).toBeTruthy()
    expect(getByText('Saborea la comunidad')).toBeTruthy()
    expect(fetchEvents).not.toHaveBeenCalled()
  })

  test('carga eventos desde el backend cuando hay token', async () => {
    mockToken = 'token-academico'
    ;(fetchEvents as jest.Mock).mockResolvedValue([
      {
        id: 10,
        title: 'Ruta de tapas',
        description: 'Recorrido gastronómico por mercados locales.',
        category: 'Street food',
        date: '20/06/2026',
        duration: '90 min',
        image: require('@/assets/dishcover/event-buffet.png'),
      },
    ])

    const { getByText } = render(<AllEventsScreen />)

    await waitFor(() => expect(fetchEvents).toHaveBeenCalledWith('token-academico'))
    expect(getByText('Ruta de tapas')).toBeTruthy()
  })

  test('filtra eventos por búsqueda', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<AllEventsScreen />)

    fireEvent.changeText(getByPlaceholderText('Buscar eventos...'), 'street')

    expect(getByText('Street food internacional')).toBeTruthy()
    expect(queryByText('Saborea la comunidad')).toBeNull()
  })
})
