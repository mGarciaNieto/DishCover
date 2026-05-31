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
}

export function PrimaryButton({ label, onPress, disabled = false }: PrimaryButtonProps) {
  const { isShortPhone } = useResponsiveLayout()

  return (
    <Pressable
      className="overflow-hidden rounded-4xl"
      style={({ pressed }) => [
        shadows.soft,
        { marginTop: isShortPhone ? 38 : 60, minHeight: isShortPhone ? 64 : 72 },
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
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
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
