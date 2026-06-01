/**
 * Componentes reutilizables para formularios de autenticación.
 * Centraliza campos de texto, botones principales y espaciado vertical.
 *
 * @author Manuel García Nieto
 */
import { LinearGradient } from 'expo-linear-gradient'
import type { ReactNode } from 'react'
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native'
import { shadows } from '@/constants/theme'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'

export function Field(props: TextInputProps) {
  const { isShortPhone } = useResponsiveLayout()

  return (
    <TextInput
      {...props}
      placeholderTextColor="#A3ACBA"
      className="rounded-4xl border border-dish-border bg-dish-surface px-6 text-xl text-dish-text"
      style={[{ minHeight: isShortPhone ? 58 : 64, paddingHorizontal: 0, paddingVertical: 0 }, props.style]}
    />
  )
}

type PrimaryButtonProps = {
  label: string
  onPress: () => void
  disabled?: boolean
  topSpacing?: number
}

export function PrimaryButton({ label, onPress, disabled = false, topSpacing }: PrimaryButtonProps) {
  const { isShortPhone } = useResponsiveLayout()
  const buttonHeight = isShortPhone ? 56 : 60
  const marginTop = topSpacing ?? (isShortPhone ? 36 : 48)

  return (
    <Pressable
      className="overflow-hidden rounded-4xl"
      style={({ pressed }) => [
        shadows.soft,
        { alignSelf: 'stretch', minHeight: buttonHeight, marginTop, width: '100%' },
        disabled && { opacity: 0.58 },
        pressed && !disabled && { opacity: 0.84, transform: [{ scale: 0.99 }] },
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <LinearGradient
        colors={['#935502', '#FD9702']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          alignItems: 'center',
          borderRadius: 32,
          justifyContent: 'center',
          minHeight: buttonHeight,
          paddingVertical: isShortPhone ? 16 : 18,
          width: '100%',
        }}
      >
        <Text className="text-2xl font-extrabold text-white">{label}</Text>
      </LinearGradient>
    </Pressable>
  )
}

export function FormStack({ children }: { children: ReactNode }) {
  return <View className="gap-4">{children}</View>
}
