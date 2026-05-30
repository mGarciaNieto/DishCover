/**
 * Pruebas de la pantalla principal de eventos.
 * Verifica que se muestran los accesos principales de la sección.
 *
 * @author Manuel García Nieto
 */
import { fireEvent, render } from '@testing-library/react-native'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import EventsScreen from '@/app/(tabs)/events'

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}))

describe('EventsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined)
  })

  test('muestra la portada y los accesos de eventos', () => {
    const { getByText } = render(<EventsScreen />)

    expect(getByText('Saborea la comunidad')).toBeTruthy()
    expect(getByText('Todos los eventos')).toBeTruthy()
    expect(getByText('Mis eventos')).toBeTruthy()
  })

  test('navega al listado de todos los eventos', () => {
    const { getByText } = render(<EventsScreen />)

    fireEvent.press(getByText('Todos los eventos'))

    expect(router.push).toHaveBeenCalledWith('/event/all')
  })

  test('muestra aviso académico al pulsar mis eventos', () => {
    const { getByText } = render(<EventsScreen />)

    fireEvent.press(getByText('Mis eventos'))

    expect(Alert.alert).toHaveBeenCalledWith('Mis eventos', 'Este paso se implementará para la siguiente PEC.')
  })
})
