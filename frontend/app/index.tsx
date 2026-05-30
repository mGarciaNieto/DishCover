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

export default function OnboardingScreen() {
  return (
    <View className="flex-1 bg-[#DFE0D7]">
      <StatusBar style="light" />

      <View className="relative h-[60%] w-full items-center justify-start bg-[#F4F7ED] pt-16">
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/37336823/pexels-photo-37336823.jpeg',
          }}
          resizeMode="cover"
          className="absolute inset-0 h-full w-full"
        />

        <Text className="text-dish-green-light font-poppins z-10 text-[54px]">DishCover</Text>

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
      <View className="z-10 -mt-5 flex-1 items-center justify-start gap-6 bg-[#DFE0D7] px-7 pb-11">
        <Text
          className="text-dish-text font-poppins-bold text-center text-5xl leading-11.5"
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          Bienvenido a{'\n'}
          <Text className="text-dish-green-dark font-poppins-medium">DishCover!</Text>
        </Text>

        <Text className="text-dish-muted font-poppins text-center text-xl leading-7.5">
          Descubre, cocina y comparte recetas increíbles con la comunidad.
        </Text>
        <Pressable
          className="mt-3 min-h-18 w-full overflow-hidden rounded-[36px]"
          style={({ pressed }) => [shadows.soft, pressed && { opacity: 0.82, transform: [{ scale: 0.99 }] }]}
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
              <Text className="font-poppins text-2xl font-extrabold text-white">Empezar</Text>
              <Ionicons name="arrow-forward" size={28} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </Pressable>
        <Pressable
          className="mt-2 flex-row flex-wrap items-center justify-center gap-2.5"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-dish-muted text-lg">¿Ya tienes una cuenta?</Text>
          <Text className="text-dish-amber text-2xl font-extrabold underline">Iniciar sesión</Text>
        </Pressable>
      </View>
    </View>
  )
}
