/**
 * Pantalla de inicio de sesión.
 * Permite validar credenciales y acceder a las pantallas privadas de DishCover.
 *
 * @returns {JSX.Element} Formulario de acceso de usuario.
 * @author Manuel García Nieto
 */
import { Alert, Pressable, Text, View } from 'react-native'
import { router } from 'expo-router'
import { useState } from 'react'
import { AuthScreen } from '@/components/AuthScreen'
import { Field, FormStack, PrimaryButton } from '@/components/FormControls'
import { useAuth } from '@/context/AuthContext'
import { StatusBar } from 'expo-status-bar'

export default function LoginScreen() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Faltan datos', 'Introduce tu usuario y contraseña.')
      return
    }

    if (password.length < 4) {
      Alert.alert('Contraseña demasiado corta', 'La contraseña debe tener al menos 4 caracteres.')
      return
    }

    try {
      setLoading(true)
      await login(username.trim(), password)
      router.replace('/(tabs)')
    } catch {
      Alert.alert('No se pudo iniciar sesión', 'Revisa tu usuario y contraseña e inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <StatusBar style="dark" />
      <AuthScreen eyebrow="" title={'Hola,\nqué gusto verte'} subtitle="Accede para continuar">
        <FormStack>
          <Field value={username} onChangeText={setUsername} autoCapitalize="none" placeholder="Introduce tu usuario" />
          <Field value={password} onChangeText={setPassword} placeholder="Introduce tu contraseña" secureTextEntry />
        </FormStack>

        <Pressable className="mt-7 mb-7 self-end">
          <Text className="text-lg font-extrabold text-dish-muted">¿Has olvidado la contraseña?</Text>
        </Pressable>

        <PrimaryButton label={loading ? 'Entrando...' : 'Iniciar sesión'} onPress={handleLogin} disabled={loading} />

        <View className="mt-auto flex-row flex-wrap justify-center gap-1.5">
          <Text className="text-lg text-dish-soft">¿No tienes cuenta?</Text>
          <Pressable onPress={() => router.push('/(auth)/sign-up')}>
            <Text className="text-dish-green text-lg font-extrabold">Regístrate</Text>
          </Pressable>
        </View>
      </AuthScreen>
    </>
  )
}
