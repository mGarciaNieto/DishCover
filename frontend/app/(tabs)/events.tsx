/**
 * Pantalla principal de eventos culinarios.
 * Presenta el acceso visual a todos los eventos y a los eventos del usuario.
 *
 * @returns {JSX.Element} Portada de la sección de eventos.
 * @author Manuel García Nieto
 */
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Alert, ImageBackground, Pressable, Text, useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, shadows } from '@/constants/theme'

const screenBackground = colors.surfaceWarm

export default function EventsScreen() {
  const { height, width } = useWindowDimensions()
  // Tamaños calculados para que el mockup se adapte a móviles con distintas alturas.
  const heroWidth = Math.min(width * 0.74, 340)
  const heroHeight = Math.min(height * 0.34, 360)
  const contentTop = height > 850 ? 86 : 52
  const buttonTop = height > 850 ? 72 : 48

  const showPendingMessage = (title: string) => {
    Alert.alert(title, 'Este paso se implementará para la siguiente PEC.')
  }

  // El primer botón abre el listado real; el segundo queda documentado para la siguiente PEC.
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: screenBackground }}>
      <View className="flex-1 px-7 pt-6" style={{ backgroundColor: screenBackground }}>
        <View className="items-center pb-28" style={{ paddingTop: contentTop }}>
          <ImageBackground
            source={require('@/assets/dishcover/event-buffet.png')}
            resizeMode="cover"
            className="justify-end overflow-hidden rounded-4xl p-7"
            imageStyle={{ borderRadius: 32 }}
            style={{ height: heroHeight, width: heroWidth }}
          >
            <View className="absolute inset-0 bg-black/35" />
            <Text className="font-poppins-bold text-4xl text-white" style={{ lineHeight: 40 }}>
              Saborea la comunidad
            </Text>
            <Text className="font-poppins-medium mt-4 max-w-72 text-xl text-white" style={{ lineHeight: 27 }}>
              Únete a talleres culinarios exclusivos y rutas gastronómicas locales.
            </Text>
          </ImageBackground>

          <View className="gap-7" style={{ marginTop: buttonTop, width: heroWidth }}>
            <Pressable
              className="min-h-20 overflow-hidden rounded-4xl"
              onPress={() => router.push('/event/all')}
              style={({ pressed }) => [shadows.soft, pressed && { opacity: 0.86, transform: [{ scale: 0.99 }] }]}
            >
              <LinearGradient
                colors={[colors.green, colors.greenLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ alignItems: 'center', flex: 1, flexDirection: 'row', gap: 14, justifyContent: 'center' }}
              >
                <Ionicons name="compass-outline" size={27} color="#FFFFF8" />
                <Text className="font-poppins-bold text-2xl text-white">Todos los eventos</Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              className="bg-dish-muted-surface min-h-20 flex-row items-center justify-center gap-4 rounded-4xl"
              onPress={() => showPendingMessage('Mis eventos')}
              style={({ pressed }) => [pressed && { opacity: 0.86, transform: [{ scale: 0.99 }] }]}
            >
              <Ionicons name="calendar-outline" size={27} color={colors.text} />
              <Text className="font-poppins-bold text-dish-text text-2xl">Mis eventos</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
