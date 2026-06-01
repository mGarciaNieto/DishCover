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
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function OnboardingScreen() {
  const { contentWidthStyle, height, isSmallPhone, screenPaddingStyle, width } = useResponsiveLayout()
  const insets = useSafeAreaInsets()
  const compactHeight = height < 860
  const heroHeight = height * (compactHeight ? 0.46 : 0.5)
  const logoSize = isSmallPhone ? 44 : 52
  const buttonHeight = compactHeight ? 54 : 60
  const buttonWidth = Math.min(width * 0.86, 440)

  return (
    <View className="flex-1 bg-[#DFE0D7]">
      <StatusBar style="light" />

      <View
        className="relative w-full items-center justify-start bg-black"
        style={{ height: heroHeight, paddingTop: insets.top + (compactHeight ? 14 : 20) }}
      >
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/37336823/pexels-photo-37336823.jpeg',
          }}
          resizeMode="cover"
          style={{
            height: '100%',
            left: 0,
            position: 'absolute',
            right: 0,
            top: compactHeight ? 42 : 52,
            width: '100%',
          }}
        />

        <Text className="text-dish-green-light font-poppins z-10" style={{ fontSize: logoSize, lineHeight: logoSize + 8 }}>DishCover</Text>

        <LinearGradient
          colors={['#DCDED500', '#DFE0D7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '78%',
            zIndex: 5,
          }}
        />
      </View>
      <View
        className="z-10 flex-1 items-center justify-start bg-[#DFE0D7]"
        style={[
          screenPaddingStyle,
          contentWidthStyle,
          {
            paddingBottom: insets.bottom + (compactHeight ? 12 : 20),
            paddingTop: compactHeight ? 28 : 42,
          },
        ]}
      >
        <Text
          className={`text-dish-text font-poppins-bold text-center ${isSmallPhone ? 'text-4xl' : 'text-5xl'}`}
          style={{ lineHeight: isSmallPhone ? 40 : 46 }}
        >
          Bienvenido a{'\n'}
          <Text className="text-dish-green-dark font-poppins-medium">DishCover!</Text>
        </Text>

        <Text
          className={`${isSmallPhone ? 'text-lg' : 'text-xl'} text-dish-muted font-poppins text-center`}
          style={{
            lineHeight: isSmallPhone ? 25 : 30,
            marginTop: compactHeight ? 18 : 26,
            marginBottom: compactHeight ? 14 : 20,
          }}
        >
          Descubre, cocina y comparte recetas increíbles con la comunidad.
        </Text>
        <Pressable
          className="overflow-hidden rounded-4xl"
          style={({ pressed }) => [
            shadows.soft,
            {
              height: buttonHeight,
              marginTop: compactHeight ? 22 : 30,
              width: buttonWidth,
            },
            pressed && { opacity: 0.82, transform: [{ scale: 0.99 }] },
          ]}
          onPress={() => router.push('/(auth)/sign-up')}
        >
          <LinearGradient
            colors={['#935502', '#FD9702']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              alignItems: 'center',
              height: buttonHeight,
              justifyContent: 'center',
              width: buttonWidth,
            }}
          >
            <View className="flex-row items-center justify-center gap-3.5">
              <Text className={`${isSmallPhone ? 'text-xl' : 'text-2xl'} font-poppins font-extrabold text-white`}>Empezar</Text>
              <Ionicons name="arrow-forward" size={isSmallPhone ? 24 : 28} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </Pressable>
        <Pressable
          className="flex-row flex-wrap items-center justify-center gap-2.5"
          style={{ marginTop: compactHeight ? 14 : 20 }}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className={`${isSmallPhone ? 'text-base' : 'text-lg'} text-dish-muted`}>¿Ya tienes una cuenta?</Text>
          <Text className={`${isSmallPhone ? 'text-xl' : 'text-2xl'} text-dish-amber font-extrabold underline`}>Iniciar sesión</Text>
        </Pressable>
      </View>
    </View>
  )
}
