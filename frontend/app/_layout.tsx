/**
 * Layout raíz de la aplicación.
 * Carga estilos globales, fuentes y proveedores compartidos.
 *
 * @returns {JSX.Element | null} Estructura principal de navegación.
 * @author Manuel García Nieto
 */
import { Stack } from 'expo-router'
import '@/global.css'
import { AuthProvider } from '@/context/AuthContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { ThemeProvider, useTheme } from '@/context/ThemeContext'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins'
import { StatusBar } from 'expo-status-bar'

function AppStack() {
  const { isDarkMode } = useTheme()

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="recipe/[id]" />
        <Stack.Screen name="recipe/create" />
        <Stack.Screen name="recipe/delete" />
        <Stack.Screen name="event/all" />
        <Stack.Screen name="settings/index" />
        <Stack.Screen name="settings/theme" />
        <Stack.Screen name="settings/language" />
      </Stack>
    </>
  )
}

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-Bold': Poppins_700Bold,
  })

  if (!fontsLoaded && !error) {
    return null
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppStack />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
