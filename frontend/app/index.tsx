/**
 * Pantalla de onboarding de DishCover.
 * Presenta la experiencia inicial y permite navegar a registro o login.
 *
 * @returns {JSX.Element} Pantalla inicial de bienvenida.
 * @author Manuel García Nieto
 */
import { Pressable, Text, View, Image } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { shadows } from '@/constants/theme'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'

export default function OnboardingScreen() {
  const { height, isShortPhone, isSmallPhone, screenPaddingStyle } = useResponsiveLayout()
  const heroHeight = Math.max(height * (isShortPhone ? 0.52 : 0.58), 330)
  const titleSize = isSmallPhone ? 46 : 54

  return (
    <View className="flex-1 bg-[#DFE0D7]">
      <StatusBar style="light" />

      <View className="relative w-full items-center justify-start bg-[#F4F7ED]" style={{ height: heroHeight, paddingTop: isShortPhone ? 46 : 64 }}>
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/37336823/pexels-photo-37336823.jpeg',
          }}
          resizeMode="cover"
          className="absolute inset-0 h-full w-full"
        />

        <Text className="text-dish-green-light font-poppins z-10" style={{ fontSize: titleSize }}>DishCover</Text>

        <LinearGradient
          colors={['#DCDED500', '#DFE0D7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80%',
            zIndex: 5,
          }}
        />
      </View>
      <View
        className="z-10 -mt-5 flex-1 items-center justify-start bg-[#DFE0D7] pb-11"
        style={[screenPaddingStyle, { gap: isShortPhone ? 16 : 24 }]}
      >
        <Text
          className={`text-dish-text font-poppins-bold text-center ${isSmallPhone ? 'text-4xl' : 'text-5xl'}`}
          style={{ lineHeight: isSmallPhone ? 40 : 46 }}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          Bienvenido a{'\n'}
          <Text className="text-dish-green-dark font-poppins-medium">DishCover!</Text>
        </Text>

        <Text className={`${isSmallPhone ? 'text-lg' : 'text-xl'} text-dish-muted font-poppins text-center`} style={{ lineHeight: isSmallPhone ? 25 : 30 }}>
          Descubre, cocina y comparte recetas increíbles con la comunidad.
        </Text>
        <Pressable
          className="w-full overflow-hidden rounded-4xl"
          style={({ pressed }) => [
            shadows.soft,
            { minHeight: isShortPhone ? 62 : 72 },
            pressed && { opacity: 0.82, transform: [{ scale: 0.99 }] },
          ]}
          onPress={() => router.push('/(auth)/sign-up')}
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
            <View className="flex-row items-center justify-center gap-3.5 py-4">
              <Text className={`${isSmallPhone ? 'text-xl' : 'text-2xl'} font-poppins font-extrabold text-white`}>Empezar</Text>
              <Ionicons name="arrow-forward" size={isSmallPhone ? 24 : 28} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </Pressable>
        <Pressable
          className="flex-row flex-wrap items-center justify-center gap-2.5"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-dish-muted text-lg">¿Ya tienes una cuenta?</Text>
          <Text className="text-dish-amber text-2xl font-extrabold underline">Iniciar sesión</Text>
        </Pressable>
      </View>
    </View>
  )
}
