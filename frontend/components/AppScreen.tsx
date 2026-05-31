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

type AppScreenProps = PropsWithChildren<{
  title?: string
  scroll?: boolean
  background?: string
}>

export function AppScreen({ title, scroll = true, background = colors.background, children }: AppScreenProps) {
  const { contentWidthStyle, screenPaddingStyle } = useResponsiveLayout()

  const content = (
    <View style={[screenPaddingStyle, contentWidthStyle, { paddingTop: 32 }, scroll ? undefined : { flex: 1 }]}>
      {title ? <Text className="mb-5 font-black text-3xl text-dish-green-dark">{title}</Text> : null}
      {children}
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      {scroll ? (
        <ScrollView style={{ flex: 1 }} contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  )
}
