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
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'

export default function LoginScreen() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const { isDarkMode } = useTheme()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert(t('login.alertMissingTitle'), t('login.alertMissingMessage'))
      return
    }

    if (password.length < 4) {
      Alert.alert(t('login.alertShortPasswordTitle'), t('login.alertShortPasswordMessage'))
      return
    }

    try {
      setLoading(true)
      await login(username.trim(), password)
      router.replace('/(tabs)')
    } catch {
      Alert.alert(t('login.alertErrorTitle'), t('login.alertErrorMessage'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreen eyebrow="" title={t('login.title')} subtitle={t('login.subtitle')}>
      <FormStack>
        <Field value={username} onChangeText={setUsername} autoCapitalize="none" placeholder={t('auth.usernamePlaceholder')} />
        <Field value={password} onChangeText={setPassword} placeholder={t('auth.passwordPlaceholder')} secureTextEntry />
      </FormStack>

      <Pressable className="mt-7 mb-7 self-end">
        <Text className="text-lg font-extrabold text-dish-muted">{t('login.forgotPassword')}</Text>
      </Pressable>

      <PrimaryButton label={loading ? t('login.submitLoading') : t('login.submit')} onPress={handleLogin} disabled={loading} />

      <View className="mt-auto flex-row flex-wrap justify-center gap-1.5">
        <Text className="text-lg text-dish-soft">{t('login.noAccount')}</Text>
        <Pressable onPress={() => router.push('/(auth)/sign-up')}>
          <Text className="text-lg font-extrabold" style={{ color: isDarkMode ? '#FFFFFF' : '#008A2E' }}>{t('auth.registerLink')}</Text>
        </Pressable>
      </View>
    </AuthScreen>
  )
}
