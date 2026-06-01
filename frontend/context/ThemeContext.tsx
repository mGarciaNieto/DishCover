/**
 * Contexto de tema visual de DishCover.
 * Persiste la preferencia de modo oscuro mediante AsyncStorage.
 *
 * @author Manuel García Nieto
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SystemUI from 'expo-system-ui'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import { Appearance } from 'react-native'
import { darkColors, lightColors, type AppColors } from '@/constants/theme'

const THEME_STORAGE_KEY = 'dishcover.dark-mode'

type ThemeContextValue = {
  colors: AppColors
  isDarkMode: boolean
  setDarkMode: (enabled: boolean) => Promise<void>
}

const defaultThemeValue: ThemeContextValue = {
  colors: lightColors,
  isDarkMode: false,
  setDarkMode: async () => undefined,
}

const ThemeContext = createContext<ThemeContextValue>(defaultThemeValue)

export function ThemeProvider({ children }: PropsWithChildren) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadThemePreference() {
      const storedValue = await AsyncStorage.getItem(THEME_STORAGE_KEY)

      if (mounted && storedValue !== null) {
        setIsDarkMode(storedValue === 'true')
      }
    }

    loadThemePreference()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const nextScheme = isDarkMode ? 'dark' : 'light'

    // Sincronizamos la apariencia nativa para que controles como Switch reciban el modo correcto.
    Appearance.setColorScheme(nextScheme)
    SystemUI.setBackgroundColorAsync(isDarkMode ? darkColors.background : lightColors.background)
  }, [isDarkMode])

  const setDarkMode = async (enabled: boolean) => {
    setIsDarkMode(enabled)
    await AsyncStorage.setItem(THEME_STORAGE_KEY, String(enabled))
  }

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: isDarkMode ? darkColors : lightColors,
      isDarkMode,
      setDarkMode,
    }),
    [isDarkMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
