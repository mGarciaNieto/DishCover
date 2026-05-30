/**
 * Contenedor visual para las pantallas de autenticación.
 * Gestiona el espaciado superior seguro y el ajuste del teclado.
 *
 * @returns {JSX.Element} Layout de autenticación con título y formulario.
 * @author Manuel García Nieto
 */
import { PropsWithChildren } from 'react'
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type AuthScreenProps = PropsWithChildren<{
  eyebrow: string
  title: string
  subtitle: string
}>

export function AuthScreen({ eyebrow, title, subtitle, children }: AuthScreenProps) {
  const insets = useSafeAreaInsets()

  return (
    <View className="bg-dish-surface flex-1">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <View
          className="flex-1 px-8 pb-8"
          // Ajustamos el margen superior a la zona segura del dispositivo.
          style={{ paddingTop: insets.top + 20 }}
        >
          <Text className="text-dish-soft text-lg font-bold">{eyebrow}</Text>

          <View className="mb-22 mt-10 gap-4">
            <Text className="text-4xl font-black leading-12 text-dish-text">{title}</Text>
            <Text className="text-2xl text-dish-soft">{subtitle}</Text>
          </View>

          {children}
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}
