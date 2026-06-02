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
import { shadows } from '@/constants/theme'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'

export default function EventsScreen() {
  const { t } = useLanguage()
  const { colors: themeColors, isDarkMode } = useTheme()
  const { contentWidthStyle, height, isShortPhone, isSmallPhone, isTablet, screenPaddingStyle, width } = useResponsiveLayout()
  // Tamaños calculados para que el mockup se adapte a móviles con distintas alturas.
  const heroWidth = Math.min(width * (isSmallPhone ? 0.82 : 0.74), isTablet ? 420 : 340)
  const heroHeight = Math.min(height * (isShortPhone ? 0.3 : 0.34), isTablet ? 420 : 360)
  const contentTop = height > 850 ? 86 : isShortPhone ? 36 : 52
  const buttonTop = height > 850 ? 72 : isShortPhone ? 34 : 48
  const buttonHeight = isShortPhone ? 50 : 65
  const screenBackground = themeColors.surfaceWarm
  const myEventsBackground = isDarkMode ? '#3A4438' : '#D8D8CC'

  const showPendingMessage = (title: string) => {
    Alert.alert(title, t('alerts.pendingMessage'))
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
              {t('events.hero.title')}
            </Text>
            <Text className={`${isSmallPhone ? 'text-lg' : 'text-xl'} font-poppins-medium mt-4 max-w-72 text-white`} style={{ lineHeight: isSmallPhone ? 24 : 27 }}>
              {t('events.hero.subtitle')}
            </Text>
          </ImageBackground>

          <View className="gap-7" style={{ marginTop: buttonTop, width: heroWidth }}>
            <Pressable
              className="overflow-hidden rounded-4xl"
              onPress={() => router.push('/event/all')}
              style={({ pressed }) => [
                shadows.soft,
                { height: buttonHeight, minHeight: buttonHeight, width: '100%' },
                pressed && { opacity: 0.86, transform: [{ scale: 0.99 }] },
              ]}
            >
              <LinearGradient
                colors={[themeColors.green, themeColors.greenLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ alignItems: 'center', flexDirection: 'row', gap: 14, height: buttonHeight, justifyContent: 'center', width: '100%' }}
              >
                <Ionicons name="compass-outline" size={27} color="#FFFFF8" />
                <Text className={`${isSmallPhone ? 'text-xl' : 'text-2xl'} font-poppins-bold text-white`}>
                  {t('events.hero.allEvents')}
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              className="overflow-hidden rounded-4xl"
              onPress={() => showPendingMessage(t('events.hero.myEvents'))}
              style={({ pressed }) => [
                shadows.soft,
                { height: buttonHeight, minHeight: buttonHeight, width: '100%' },
                pressed && { opacity: 0.86, transform: [{ scale: 0.99 }] },
              ]}
            >
              <View
                className="flex-row items-center justify-center gap-4"
                style={{
                  backgroundColor: myEventsBackground,
                  borderRadius: 32,
                  height: buttonHeight,
                  width: '100%',
                }}
              >
                <Ionicons name="calendar-outline" size={27} color={themeColors.text} />
                <Text className={`${isSmallPhone ? 'text-xl' : 'text-2xl'} font-poppins-bold`} style={{ color: themeColors.text }}>{t('events.hero.myEvents')}</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
