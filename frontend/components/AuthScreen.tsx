/**
 * Contenedor visual para las pantallas de autenticación.
 * Gestiona el espaciado superior seguro y el ajuste del teclado.
 *
 * @returns {JSX.Element} Layout de autenticación con título y formulario.
 * @author Manuel García Nieto
 */
import { PropsWithChildren } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'

type AuthScreenProps = PropsWithChildren<{
  eyebrow?: string
  title: string
  subtitle: string
}>

export function AuthScreen({ eyebrow, title, subtitle, children }: AuthScreenProps) {
  const insets = useSafeAreaInsets()
  const { contentWidthStyle, isShortPhone, isSmallPhone, screenPaddingStyle } = useResponsiveLayout()
  const headerSpacing = isShortPhone ? 26 : 46

  return (
    <View className="bg-dish-surface flex-1">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          // Ajustamos el margen superior a la zona segura del dispositivo y permitimos scroll en móviles bajos.
          contentContainerStyle={[
            screenPaddingStyle,
            contentWidthStyle,
            {
              flexGrow: 1,
              paddingBottom: insets.bottom + 22,
              paddingTop: insets.top + (isShortPhone ? 16 : 26),
            },
          ]}
        >
          {eyebrow ? <Text className="text-dish-soft text-lg font-bold">{eyebrow}</Text> : null}

          <View style={{ gap: 14, marginBottom: headerSpacing, marginTop: eyebrow ? (isShortPhone ? 22 : 36) : isShortPhone ? 12 : 22 }}>
            <Text
              className={`${isSmallPhone ? 'text-3xl' : 'text-4xl'} font-black text-dish-text`}
              style={{ lineHeight: isSmallPhone ? 38 : 48 }}
            >
              {title}
            </Text>
            <Text className={`${isSmallPhone ? 'text-xl' : 'text-2xl'} text-dish-soft`}>{subtitle}</Text>
          </View>

          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}
