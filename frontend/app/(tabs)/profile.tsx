/**
 * Pantalla de perfil de usuario.
 * Muestra la información básica de la cuenta y acciones de configuración.
 *
 * @returns {JSX.Element} Vista de perfil y opciones de usuario.
 * @author Manuel García Nieto
 */
import { Image, Pressable, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { AppScreen } from '@/components/AppScreen'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { colors, shadows } from '@/constants/theme'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'
import { useTheme } from '@/context/ThemeContext'

export default function ProfileScreen() {
  const { isShortPhone, isSmallPhone } = useResponsiveLayout()
  const { colors: themeColors, isDarkMode } = useTheme()
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const profileActionColor = isDarkMode ? colors.text : themeColors.text
  const profileMutedButtonBackground = isDarkMode ? colors.mutedSurface : themeColors.mutedSurface
  const profileSurfaceButtonBackground = isDarkMode ? colors.surface : themeColors.surface

  const handleLogout = () => {
    // Al cerrar sesión se limpia el contexto y se vuelve al flujo de autenticación.
    logout()
    router.replace('/(auth)/login')
  }

  // La acción principal del perfil usa el mismo degradado que los botones destacados de la app.
  return (
    <AppScreen background={themeColors.surfaceWarm}>
      <View className="items-center" style={{ paddingTop: isShortPhone ? 8 : 20 }}>
        <Image
          source={{ uri: 'https://thispersondoesnotexist.com/' }}
          className="mb-7 rounded-full border-4 border-dish-surface"
          style={{ borderColor: themeColors.surface, height: isSmallPhone ? 116 : 136, width: isSmallPhone ? 116 : 136 }}
        />
        <Text className={`${isSmallPhone ? 'text-2xl' : 'text-3xl'} text-center font-black`} style={{ color: themeColors.text }}>
          {`${user.firstName} ${user.lastName}`.trim() || user.username}
        </Text>
        <Text className="mt-2 text-lg font-bold" style={{ color: themeColors.mutedText }}>{user.email}</Text>
      </View>

      <View className="flex-row" style={{ gap: isSmallPhone ? 12 : 20, marginTop: isShortPhone ? 28 : 40 }}>
        <View className="min-h-24 flex-1 items-center justify-center rounded-3xl" style={{ backgroundColor: themeColors.mutedSurface }}>
          <Text className="text-2xl font-black text-dish-green">24</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} className="text-sm font-extrabold uppercase" style={{ color: themeColors.mutedText }}>{t('profile.recipes')}</Text>
        </View>
        <View className="min-h-24 flex-1 items-center justify-center rounded-3xl" style={{ backgroundColor: themeColors.mutedSurface }}>
          <Text className="text-2xl font-black text-dish-amber">152</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} className="text-sm font-extrabold uppercase" style={{ color: themeColors.mutedText }}>{t('profile.favorites')}</Text>
        </View>
      </View>

      <View style={{ gap: 16, marginTop: isShortPhone ? 30 : 44 }}>
        <Pressable
          className="min-h-16 overflow-hidden rounded-4xl"
          style={({ pressed }) => [shadows.soft, pressed && { opacity: 0.82 }]}
        >
          <LinearGradient
            colors={[colors.green, colors.greenLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ alignItems: 'center', flex: 1, flexDirection: 'row', gap: 16, paddingHorizontal: 28 }}
          >
            <Ionicons name="pencil" size={24} color="#FFFFFF" />
            <Text className="flex-1 text-xl font-extrabold text-white">{t('profile.edit')}</Text>
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>

        <Pressable
          className="min-h-16 flex-row items-center gap-4 rounded-4xl bg-dish-muted-surface px-7"
          style={({ pressed }) => [{ backgroundColor: profileMutedButtonBackground }, pressed && { opacity: 0.82 }]}
        >
          <Ionicons name="refresh-circle-outline" size={27} color={profileActionColor} />
          <Text className="flex-1 text-lg font-extrabold" style={{ color: profileActionColor }}>{t('profile.resetPassword')}</Text>
          <Ionicons name="chevron-forward" size={24} color={profileActionColor} />
        </Pressable>

        <Pressable
          className="min-h-16 flex-row items-center gap-4 rounded-4xl bg-dish-muted-surface px-7"
          style={({ pressed }) => [{ backgroundColor: profileMutedButtonBackground }, pressed && { opacity: 0.82 }]}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={26} color={profileActionColor} />
          <Text className="flex-1 text-lg font-extrabold" style={{ color: profileActionColor }}>{t('profile.settings')}</Text>
          <Ionicons name="chevron-forward" size={24} color={profileActionColor} />
        </Pressable>

        <View className="my-1 h-px" style={{ backgroundColor: themeColors.border }} />

        <Pressable
          className="min-h-16 flex-row items-center gap-4 rounded-4xl bg-dish-surface px-7"
          style={({ pressed }) => [{ backgroundColor: profileSurfaceButtonBackground }, pressed && { opacity: 0.82 }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={27} color={profileActionColor} />
          <Text className="flex-1 text-lg font-extrabold" style={{ color: profileActionColor }}>{t('profile.logout')}</Text>
        </Pressable>

        <Pressable
          className="min-h-16 flex-row items-center gap-4 px-9"
          style={({ pressed }) => [pressed && { opacity: 0.82 }]}
        >
          <Ionicons name="trash-outline" size={24} color={colors.danger} />
          <Text className="text-lg font-extrabold text-dish-danger">{t('profile.delete')}</Text>
        </Pressable>
      </View>
    </AppScreen>
  )
}
