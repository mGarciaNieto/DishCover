/**
 * Pantalla de ajustes de DishCover.
 * Agrupa las preferencias y enlaces informativos de la aplicación.
 *
 * @returns {JSX.Element} Listado de opciones de configuración.
 * @author Manuel García Nieto
 */
import { Alert, Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'

type SettingsItemProps = {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress: () => void
}

function SettingsItem({ icon, label, onPress }: SettingsItemProps) {
  const { colors } = useTheme()

  return (
    <Pressable
      style={({ pressed }) => [
        {
          alignItems: 'center',
          backgroundColor: colors.mutedSurface,
          borderRadius: 32,
          flexDirection: 'row',
          gap: 16,
          minHeight: 72,
          paddingHorizontal: 28,
          width: '100%',
        },
        pressed && { opacity: 0.82 },
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={27} color={colors.text} />
      <Text className="flex-1 text-lg font-extrabold" style={{ color: colors.text }}>{label}</Text>
      <Ionicons name="chevron-forward" size={24} color={colors.text} />
    </Pressable>
  )
}

export default function SettingsScreen() {
  const { colors } = useTheme()
  const { t } = useLanguage()
  const { contentWidthStyle, screenPaddingStyle } = useResponsiveLayout()

  const showPendingAlert = () => {
    Alert.alert(t('alerts.pendingTitle'), t('alerts.pendingMessage'))
  }

  return (
    <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }}>
      <View style={[screenPaddingStyle, contentWidthStyle, { flex: 1, gap: 26, paddingBottom: 32, paddingTop: 18 }]}>
        <View className="flex-row items-center gap-4">
          <Pressable className="h-12 w-12 items-center justify-center rounded-3xl" onPress={() => router.back()} style={{ backgroundColor: colors.surface }}>
            <Ionicons name="chevron-back" size={25} color={colors.text} />
          </Pressable>
          <Text className="text-3xl font-black" style={{ color: colors.text }}>{t('settings.title')}</Text>
        </View>

        <View style={{ gap: 16 }}>
          <SettingsItem icon="color-palette-outline" label={t('settings.theme')} onPress={() => router.push('/settings/theme')} />
          <SettingsItem icon="language-outline" label={t('settings.language')} onPress={() => router.push('/settings/language')} />
          <SettingsItem icon="shield-checkmark-outline" label={t('settings.privacy')} onPress={showPendingAlert} />
          <SettingsItem icon="document-text-outline" label={t('settings.terms')} onPress={showPendingAlert} />
          <SettingsItem icon="information-circle-outline" label={t('settings.about')} onPress={showPendingAlert} />
        </View>
      </View>
    </SafeAreaView>
  )
}
