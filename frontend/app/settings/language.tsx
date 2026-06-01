/**
 * Pantalla de selección de idioma.
 * Permite cambiar la lengua principal de la interfaz y persistir la preferencia.
 *
 * @returns {JSX.Element} Selector de idioma de la aplicación.
 * @author Manuel García Nieto
 */
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supportedLanguages } from '@/constants/translations'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'

export default function LanguageSettingsScreen() {
  const { colors } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { contentWidthStyle, screenPaddingStyle } = useResponsiveLayout()

  return (
    <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }}>
      <View style={[screenPaddingStyle, contentWidthStyle, { flex: 1, gap: 28, paddingBottom: 32, paddingTop: 18 }]}>
        <View className="flex-row items-center gap-4">
          <Pressable className="h-12 w-12 items-center justify-center rounded-3xl" onPress={() => router.back()} style={{ backgroundColor: colors.surface }}>
            <Ionicons name="chevron-back" size={25} color={colors.text} />
          </Pressable>
          <Text className="text-3xl font-black" style={{ color: colors.text }}>{t('language.header')}</Text>
        </View>

        <View className="gap-4">
          <Text className="text-4xl font-black" style={{ color: colors.text }}>{t('language.title')}</Text>
          <Text className="text-xl" style={{ color: colors.mutedText, lineHeight: 30 }}>
            {t('language.description')}
          </Text>
        </View>

        <View style={{ gap: 16 }}>
          {supportedLanguages.map((item) => {
            const selected = language === item.code

            return (
              <Pressable
                key={item.code}
                onPress={() => setLanguage(item.code)}
                style={({ pressed }) => [
                  {
                    alignItems: 'center',
                    backgroundColor: colors.mutedSurface,
                    borderColor: selected ? colors.greenLight : colors.border,
                    borderRadius: 32,
                    borderWidth: selected ? 2 : 0,
                    flexDirection: 'row',
                    gap: 16,
                    minHeight: 72,
                    paddingHorizontal: 28,
                    width: '100%',
                  },
                  pressed && { opacity: 0.82 },
                ]}
              >
                <Ionicons name="language-outline" size={27} color={selected ? colors.greenLight : colors.text} />
                <Text className="flex-1 text-lg font-extrabold" style={{ color: colors.text }}>{item.label}</Text>
                {selected ? <Ionicons name="checkmark-circle" size={27} color={colors.greenLight} /> : null}
              </Pressable>
            )
          })}
        </View>
      </View>
    </SafeAreaView>
  )
}
