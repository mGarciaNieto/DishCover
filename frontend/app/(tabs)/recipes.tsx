/**
 * Pantalla de gestión de recetas.
 * Ofrece accesos a crear, editar y eliminar recetas dentro del flujo académico.
 *
 * @returns {JSX.Element} Vista de opciones de gestión de recetas.
 * @author Manuel García Nieto
 */
import { Alert, ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, shadows } from '@/constants/theme'
import type { TranslationKey } from '@/constants/translations'
import { useLanguage } from '@/context/LanguageContext'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'

const managerBackground = {
  uri: 'https://images.pexels.com/photos/34463128/pexels-photo-34463128.jpeg',
}

const actions = [
  { icon: 'add-circle-outline', labelKey: 'recipesManager.create', route: '/recipe/create' },
  { icon: 'create', labelKey: 'recipesManager.edit', route: '/recipe/edit' },
  { icon: 'trash', labelKey: 'recipesManager.delete', route: '/recipe/delete' },
] as const

const optionBorderColor = '#4DB84F'

export default function RecipesScreen() {
  const { t } = useLanguage()
  const { contentWidthStyle, isShortPhone, isSmallPhone, screenPaddingStyle } = useResponsiveLayout()
  const titleTop = isShortPhone ? 72 : 112
  const actionHeight = isShortPhone ? 76 : 96
  const actionGap = isShortPhone ? 16 : 24

  const handleAction = (action: (typeof actions)[number]) => {
    if (action.route) {
      router.push(action.route)
      return
    }

    Alert.alert(t(action.labelKey as TranslationKey), t('alerts.pendingMessage'))
  }

  return (
    <ImageBackground source={managerBackground} resizeMode="cover" style={{ flex: 1 }}>
      <View className="absolute inset-0 bg-black/20" />

      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1" style={[screenPaddingStyle, contentWidthStyle, { paddingTop: isShortPhone ? 20 : 32 }]}>
          <View className="flex-row items-center gap-3" style={{ marginTop: isShortPhone ? 22 : 40 }}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={isSmallPhone ? 30 : 34} color={colors.greenLight} />
            <Text className={`${isSmallPhone ? 'text-2xl' : 'text-3xl'} font-poppins-bold text-white`}>DishCover</Text>
          </View>

          <View className="items-center" style={{ marginTop: titleTop }}>
            <Text className={`${isSmallPhone ? 'text-3xl' : 'text-4xl'} font-poppins-bold text-center text-white`} style={{ lineHeight: isSmallPhone ? 36 : 40 }}>
              {t('recipesManager.title')}
            </Text>
            <Text className="font-poppins-bold mt-2 text-center text-lg tracking-wide text-white uppercase">
              {t('recipesManager.subtitle')}
            </Text>
          </View>

          <View className="px-1" style={{ gap: actionGap, marginTop: isShortPhone ? 34 : 48 }}>
            {actions.map((action) => {
              const label = t(action.labelKey as TranslationKey)

              return (
                <TouchableOpacity
                  key={action.labelKey}
                  testID={label}
                  activeOpacity={0.86}
                  style={[
                    {
                      minHeight: actionHeight,
                      width: '100%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: isSmallPhone ? 22 : 30,
                      backgroundColor: '#2E3028',
                      borderColor: optionBorderColor,
                      borderRadius: isSmallPhone ? 28 : 34,
                      borderWidth: isSmallPhone ? 4 : 5,
                      shadowColor: optionBorderColor,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.45,
                      shadowRadius: 5,
                      elevation: 8,
                    },
                    shadows.soft,
                  ]}
                  onPress={() => handleAction(action)}
                >
                  <Text className={`${isSmallPhone ? 'text-xl' : 'text-2xl'} font-poppins text-white uppercase`}>
                    {label}
                  </Text>
                  <View className="bg-dish-green-light items-center justify-center rounded-3xl" style={{ height: isSmallPhone ? 44 : 48, width: isSmallPhone ? 44 : 48 }}>
                    <Ionicons name={action.icon} size={isSmallPhone ? 25 : 28} color="#1F2B1E" />
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}
