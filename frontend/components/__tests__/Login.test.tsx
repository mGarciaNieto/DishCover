/**
 * Pruebas de la pantalla de login.
 * Verifica validaciones de formulario y navegación tras un acceso correcto.
 *
 * @author Manuel García Nieto
 */
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import LoginScreen from '@/app/(auth)/login'

const mockLogin = jest.fn()

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}))

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}))

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined)
  })

  test('muestra una alerta si los campos están vacíos', () => {
    const { getByText } = render(<LoginScreen />)

    fireEvent.press(getByText('Iniciar sesión'))

    expect(Alert.alert).toHaveBeenCalledWith('Faltan datos', 'Introduce tu usuario y contraseña.')
    expect(mockLogin).not.toHaveBeenCalled()
  })

  test('muestra una alerta si la contraseña tiene menos de 4 caracteres', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />)

    fireEvent.changeText(getByPlaceholderText('Introduce tu usuario'), 'demo')
    fireEvent.changeText(getByPlaceholderText('Introduce tu contraseña'), '123')
    fireEvent.press(getByText('Iniciar sesión'))

    expect(Alert.alert).toHaveBeenCalledWith('Contraseña demasiado corta', 'La contraseña debe tener al menos 4 caracteres.')
    expect(mockLogin).not.toHaveBeenCalled()
  })

  test('navega a las pestañas cuando el login es correcto', async () => {
    mockLogin.mockResolvedValueOnce(undefined)
    const { getByPlaceholderText, getByText } = render(<LoginScreen />)

    fireEvent.changeText(getByPlaceholderText('Introduce tu usuario'), 'demo')
    fireEvent.changeText(getByPlaceholderText('Introduce tu contraseña'), '1234')
    fireEvent.press(getByText('Iniciar sesión'))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('demo', '1234')
      expect(router.replace).toHaveBeenCalledWith('/(tabs)')
    })
  })
})
