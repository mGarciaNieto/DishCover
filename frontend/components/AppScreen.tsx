/**
 * Contenedor base para las pantallas principales de la aplicación.
 * Aplica fondo, zona segura, scroll opcional y título de sección.
 *
 * @returns {JSX.Element} Pantalla base con contenido renderizado.
 * @author Manuel García Nieto
 */
import { PropsWithChildren } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/theme'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'
import { useTheme } from '@/context/ThemeContext'

type AppScreenProps = PropsWithChildren<{
  title?: string
  scroll?: boolean
  background?: string
}>

export function AppScreen({ title, scroll = true, background = colors.background, children }: AppScreenProps) {
  const { colors: themeColors } = useTheme()
  const { contentWidthStyle, screenPaddingStyle } = useResponsiveLayout()
  const screenBackground = background === colors.background ? themeColors.background : background

  const content = (
    <View style={[screenPaddingStyle, contentWidthStyle, { paddingTop: 32 }, scroll ? undefined : { flex: 1 }]}>
      {title ? <Text className="mb-5 font-black text-3xl" style={{ color: themeColors.greenDark }}>{title}</Text> : null}
      {children}
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: screenBackground }}>
      {scroll ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 132 }}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  )
}
