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
import { useLanguage } from '@/context/LanguageContext'

export default function SignUpScreen() {
  const { register } = useAuth()
  const { t } = useLanguage()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    if (!username || !email || !firstName || !lastName || !password) {
      Alert.alert(t('signUp.alertMissingTitle'), t('signUp.alertMissingMessage'))
      return
    }

    if (password.length < 4) {
      Alert.alert(t('signUp.alertShortPasswordTitle'), t('signUp.alertShortPasswordMessage'))
      return
    }

    try {
      setLoading(true)
      await register({ username, email, firstName, lastName, password })
      Alert.alert(t('signUp.alertSuccessTitle'), t('signUp.alertSuccessMessage'))
      router.replace('/(auth)/login')
    } catch {
      Alert.alert(t('signUp.alertErrorTitle'), t('signUp.alertErrorMessage'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreen title={t('signUp.title')} subtitle={t('signUp.subtitle')}>
      <FormStack>
        <Field value={username} onChangeText={setUsername} autoCapitalize="none" placeholder={t('auth.usernamePlaceholder')} />
        <Field value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder={t('auth.emailPlaceholder')} />
        <Field value={firstName} onChangeText={setFirstName} placeholder={t('auth.firstNamePlaceholder')} />
        <Field value={lastName} onChangeText={setLastName} placeholder={t('auth.lastNamePlaceholder')} />
        <Field value={password} onChangeText={setPassword} placeholder={t('auth.passwordPlaceholder')} secureTextEntry />
      </FormStack>

      <View className="mt-12">
        <PrimaryButton label={loading ? t('signUp.submitLoading') : t('signUp.submit')} onPress={handleSignUp} disabled={loading}/>
      </View>

      <View className="mt-auto flex-row flex-wrap justify-center gap-1.5">
        <Text className="text-lg text-dish-soft">{t('signUp.accountExists')}</Text>
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <Text className="font-extrabold text-lg text-dish-green">{t('auth.loginLink')}</Text>
        </Pressable>
      </View>
    </AuthScreen>
  )
}
