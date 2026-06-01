/**
 * Pantalla de selección de tema.
 * Permite activar o desactivar el modo oscuro y persistir la preferencia.
 *
 * @returns {JSX.Element} Selector de modo oscuro.
 * @author Manuel García Nieto
 */
import { Pressable, Switch, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/context/ThemeContext'
import { shadows } from '@/constants/theme'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'

export default function ThemeSettingsScreen() {
  const { colors, isDarkMode, setDarkMode } = useTheme()
  const { contentWidthStyle, screenPaddingStyle } = useResponsiveLayout()

  return (
    <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }}>
      <View style={[screenPaddingStyle, contentWidthStyle, { flex: 1, gap: 28, paddingBottom: 32, paddingTop: 18 }]}>
        <View className="flex-row items-center gap-4">
          <Pressable className="h-12 w-12 items-center justify-center rounded-3xl" onPress={() => router.back()} style={{ backgroundColor: colors.surface }}>
            <Ionicons name="chevron-back" size={25} color={colors.text} />
          </Pressable>
          <Text className="text-3xl font-black" style={{ color: colors.text }}>Tema</Text>
        </View>

        <View className="gap-4">
          <Text className="text-4xl font-black" style={{ color: colors.text }}>Tema de la aplicación</Text>
          <Text className="text-xl" style={{ color: colors.mutedText, lineHeight: 30 }}>
            Activa el modo oscuro para reducir el brillo de la interfaz y guardar la preferencia en este dispositivo.
          </Text>
        </View>

        <View
          className="min-h-24 flex-row items-center gap-4 rounded-4xl px-6"
          style={[shadows.soft, { backgroundColor: colors.surface }]}
        >
          <View className="h-12 w-12 items-center justify-center rounded-3xl" style={{ backgroundColor: colors.mutedSurface }}>
            <Ionicons name={isDarkMode ? 'moon' : 'sunny'} size={25} color={colors.green} />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-extrabold" style={{ color: colors.text }}>Modo oscuro</Text>
            <Text className="mt-1 text-base" style={{ color: colors.mutedText }}>
              {isDarkMode ? 'Activado' : 'Desactivado'}
            </Text>
          </View>
          <Switch
            ios_backgroundColor={colors.border}
            onValueChange={setDarkMode}
            thumbColor="#FFFFF8"
            trackColor={{ false: colors.border, true: colors.greenLight }}
            value={isDarkMode}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
