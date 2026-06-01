/**
 * Pantalla de registro de usuario.
 * Recoge los datos básicos necesarios para crear una cuenta en DishCover.
 *
 * @returns {JSX.Element} Formulario de creación de cuenta.
 * @author Manuel García Nieto
 */
import { Alert, Pressable, Text, View } from 'react-native'
import { router } from 'expo-router'
import { useState } from 'react'
import { AuthScreen } from '@/components/AuthScreen'
import { Field, FormStack, PrimaryButton } from '@/components/FormControls'
import { useAuth } from '@/context/AuthContext'

export default function SignUpScreen() {
  const { register } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    if (!username || !email || !firstName || !lastName || !password) {
      Alert.alert('Faltan datos', 'Completa todos los campos para crear tu cuenta.')
      return
    }

    if (password.length < 4) {
      Alert.alert('Contraseña demasiado corta', 'La contraseña debe tener al menos 4 caracteres.')
      return
    }

    try {
      setLoading(true)
      await register({ username, email, firstName, lastName, password })
      Alert.alert('Cuenta creada', 'Tu cuenta se ha creado correctamente. Ya puedes iniciar sesión.')
      router.replace('/(auth)/login')
    } catch {
      Alert.alert('No se pudo crear la cuenta', 'Revisa los datos o prueba con otro usuario/email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreen title="Vamos a empezar" subtitle="Completa tus datos para crear una cuenta">
      <FormStack>
        <Field value={username} onChangeText={setUsername} autoCapitalize="none" placeholder="Introduce tu usuario" />
        <Field value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Introduce tu email" />
        <Field value={firstName} onChangeText={setFirstName} placeholder="Introduce tu nombre" />
        <Field value={lastName} onChangeText={setLastName} placeholder="Introduce tus apellidos" />
        <Field value={password} onChangeText={setPassword} placeholder="Introduce tu contraseña" secureTextEntry />
      </FormStack>

      <View className="mt-12">
        <PrimaryButton label={loading ? 'Creando...' : 'Registrarme'} onPress={handleSignUp} disabled={loading}/>
      </View>

      <View className="mt-auto flex-row flex-wrap justify-center gap-1.5">
        <Text className="text-lg text-dish-soft">¿Ya tienes cuenta?</Text>
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <Text className="font-extrabold text-lg text-dish-green">Inicia sesión</Text>
        </Pressable>
      </View>
    </AuthScreen>
  )
}
