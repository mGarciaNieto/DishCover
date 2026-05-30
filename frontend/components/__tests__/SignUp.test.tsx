/**
 * Pruebas de la pantalla de registro.
 * Comprueba validaciones y creación correcta de una cuenta.
 *
 * @author Manuel García Nieto
 */
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import SignUpScreen from '@/app/(auth)/sign-up'

const mockRegister = jest.fn()

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister,
  }),
}))

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}))

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined)
  })

  test('muestra una alerta si faltan datos obligatorios', () => {
    const { getByText } = render(<SignUpScreen />)

    fireEvent.press(getByText('Registrarme'))

    expect(Alert.alert).toHaveBeenCalledWith('Faltan datos', 'Completa todos los campos para crear tu cuenta.')
    expect(mockRegister).not.toHaveBeenCalled()
  })

  test('muestra una alerta si la contraseña tiene menos de 4 caracteres', () => {
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />)

    fireEvent.changeText(getByPlaceholderText('Introduce tu usuario'), 'nuevo')
    fireEvent.changeText(getByPlaceholderText('Introduce tu email'), 'nuevo@dishcover.local')
    fireEvent.changeText(getByPlaceholderText('Introduce tu nombre'), 'Nuevo')
    fireEvent.changeText(getByPlaceholderText('Introduce tus apellidos'), 'Usuario')
    fireEvent.changeText(getByPlaceholderText('Introduce tu contraseña'), '123')
    fireEvent.press(getByText('Registrarme'))

    expect(Alert.alert).toHaveBeenCalledWith('Contraseña demasiado corta', 'La contraseña debe tener al menos 4 caracteres.')
    expect(mockRegister).not.toHaveBeenCalled()
  })

  test('crea la cuenta y vuelve al login cuando los datos son correctos', async () => {
    mockRegister.mockResolvedValueOnce(undefined)
    const { getByPlaceholderText, getByText } = render(<SignUpScreen />)

    fireEvent.changeText(getByPlaceholderText('Introduce tu usuario'), 'nuevo')
    fireEvent.changeText(getByPlaceholderText('Introduce tu email'), 'nuevo@dishcover.local')
    fireEvent.changeText(getByPlaceholderText('Introduce tu nombre'), 'Nuevo')
    fireEvent.changeText(getByPlaceholderText('Introduce tus apellidos'), 'Usuario')
    fireEvent.changeText(getByPlaceholderText('Introduce tu contraseña'), '1234')
    fireEvent.press(getByText('Registrarme'))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'nuevo',
        email: 'nuevo@dishcover.local',
        firstName: 'Nuevo',
        lastName: 'Usuario',
        password: '1234',
      })
      expect(Alert.alert).toHaveBeenCalledWith('Cuenta creada', 'Tu cuenta se ha creado correctamente. Ya puedes iniciar sesión.')
      expect(router.replace).toHaveBeenCalledWith('/(auth)/login')
    })
  })
})
