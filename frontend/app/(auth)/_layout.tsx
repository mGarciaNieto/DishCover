/**
 * Configuración de navegación para las pantallas de autenticación.
 * Agrupa login y registro sin cabecera nativa.
 *
 * @returns {JSX.Element} Stack de autenticación.
 * @author Manuel García Nieto
 */
import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="sign-up" />
    </Stack>
  )
}
