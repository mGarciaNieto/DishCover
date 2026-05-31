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
import { Alert, ImageBackground, Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, shadows } from '@/constants/theme'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'

const screenBackground = colors.surfaceWarm

export default function EventsScreen() {
  const { contentWidthStyle, height, isShortPhone, isSmallPhone, isTablet, screenPaddingStyle, width } = useResponsiveLayout()
  // Tamaños calculados para que el mockup se adapte a móviles con distintas alturas.
  const heroWidth = Math.min(width * (isSmallPhone ? 0.82 : 0.74), isTablet ? 420 : 340)
  const heroHeight = Math.min(height * (isShortPhone ? 0.3 : 0.34), isTablet ? 420 : 360)
  const contentTop = height > 850 ? 86 : isShortPhone ? 36 : 52
  const buttonTop = height > 850 ? 72 : isShortPhone ? 34 : 48

  const showPendingMessage = (title: string) => {
    Alert.alert(title, 'Este paso se implementará para la siguiente PEC.')
  }

  // El primer botón abre el listado real; el segundo queda documentado para la siguiente PEC.
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: screenBackground }}>
      <View className="flex-1 pt-6" style={[screenPaddingStyle, { backgroundColor: screenBackground }]}>
        <View className="items-center pb-28" style={[contentWidthStyle, { paddingTop: contentTop }]}>
          <ImageBackground
            source={require('@/assets/dishcover/event-buffet.png')}
            resizeMode="cover"
            className="justify-end overflow-hidden rounded-4xl"
            imageStyle={{ borderRadius: 32 }}
            style={{ height: heroHeight, padding: isSmallPhone ? 22 : 28, width: heroWidth }}
          >
            <View className="absolute inset-0 bg-black/35" />
            <Text className={`${isSmallPhone ? 'text-3xl' : 'text-4xl'} font-poppins-bold text-white`} style={{ lineHeight: isSmallPhone ? 34 : 40 }}>
              Saborea la comunidad
            </Text>
            <Text className={`${isSmallPhone ? 'text-lg' : 'text-xl'} font-poppins-medium mt-4 max-w-72 text-white`} style={{ lineHeight: isSmallPhone ? 24 : 27 }}>
              Únete a talleres culinarios exclusivos y rutas gastronómicas locales.
            </Text>
          </ImageBackground>

          <View className="gap-7" style={{ marginTop: buttonTop, width: heroWidth }}>
            <Pressable
              className="overflow-hidden rounded-4xl"
              onPress={() => router.push('/event/all')}
              style={({ pressed }) => [shadows.soft, pressed && { opacity: 0.86, transform: [{ scale: 0.99 }] }]}
            >
              <LinearGradient
                colors={[colors.green, colors.greenLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ alignItems: 'center', flex: 1, flexDirection: 'row', gap: 14, justifyContent: 'center', minHeight: isShortPhone ? 68 : 80 }}
              >
                <Ionicons name="compass-outline" size={27} color="#FFFFF8" />
                <Text className={`${isSmallPhone ? 'text-xl' : 'text-2xl'} font-poppins-bold text-white`}>
                  Todos los eventos
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              className="bg-dish-muted-surface flex-row items-center justify-center gap-4 rounded-4xl"
              onPress={() => showPendingMessage('Mis eventos')}
              style={({ pressed }) => [{ minHeight: isShortPhone ? 68 : 80 }, pressed && { opacity: 0.86, transform: [{ scale: 0.99 }] }]}
            >
              <Ionicons name="calendar-outline" size={27} color={colors.text} />
              <Text className={`${isSmallPhone ? 'text-xl' : 'text-2xl'} font-poppins-bold text-dish-text`}>Mis eventos</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
