/**
 * Contexto de idioma de DishCover.
 * Guarda la preferencia lingüística del usuario con AsyncStorage.
 *
 * @author Manuel García Nieto
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import { LanguageCode, TranslationKey, translations } from '@/constants/translations'

const LANGUAGE_STORAGE_KEY = 'dishcover.language'

type LanguageContextValue = {
  language: LanguageCode
  setLanguage: (language: LanguageCode) => Promise<void>
  t: (key: TranslationKey) => string
}

const defaultLanguageValue: LanguageContextValue = {
  language: 'es',
  setLanguage: async () => undefined,
  t: (key) => translations.es[key],
}

const LanguageContext = createContext<LanguageContextValue>(defaultLanguageValue)

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<LanguageCode>('es')

  useEffect(() => {
    let mounted = true

    async function loadLanguagePreference() {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)

      if (mounted && (storedLanguage === 'es' || storedLanguage === 'ca' || storedLanguage === 'en')) {
        setLanguageState(storedLanguage)
      }
    }

    loadLanguagePreference()

    return () => {
      mounted = false
    }
  }, [])

  const setLanguage = async (nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage)
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
  }

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => translations[language][key] ?? translations.es[key],
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
