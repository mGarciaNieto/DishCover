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

const managerBackground = {
  uri: 'https://images.pexels.com/photos/34463128/pexels-photo-34463128.jpeg',
}

const actions = [
  { icon: 'add-circle-outline', label: 'Crear receta', route: '/recipe/create' },
  { icon: 'create', label: 'Editar receta', route: null },
  { icon: 'trash', label: 'Eliminar receta', route: '/recipe/delete' },
] as const

const optionBorderColor = '#4DB84F'

export default function RecipesScreen() {
  const handleAction = (action: (typeof actions)[number]) => {
    if (action.route) {
      router.push(action.route)
      return
    }

    Alert.alert(action.label, 'Este paso se implementará para la siguiente PEC.')
  }

  return (
    <ImageBackground source={managerBackground} resizeMode="cover" style={{ flex: 1 }}>
      <View className="absolute inset-0 bg-black/20" />

      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 px-9 pt-8">
          <View className="mt-10 flex-row items-center gap-3">
            <MaterialCommunityIcons name="silverware-fork-knife" size={34} color={colors.greenLight} />
            <Text className="font-poppins-bold text-3xl text-white">DishCover</Text>
          </View>

          <View className="mt-28 items-center">
            <Text className="font-poppins-bold text-center text-4xl leading-10 text-white">Gestor de recetas</Text>
            <Text className="font-poppins-bold mt-2 text-center text-lg tracking-wide text-white uppercase">
              ¿Qué hay en el menú hoy?
            </Text>
          </View>

          <View className="mt-12 gap-6 px-1">
            {actions.map((action) => (
              <TouchableOpacity
                key={action.label}
                testID={action.label}
                activeOpacity={0.86}
                style={[
                  {
                    minHeight: 96,
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 30,
                    backgroundColor: '#2E3028',
                    borderColor: optionBorderColor,
                    borderRadius: 34,
                    borderWidth: 5,
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
                <Text className="font-poppins text-2xl text-white uppercase">{action.label}</Text>
                <View className="bg-dish-green-light h-12 w-12 items-center justify-center rounded-3xl">
                  <Ionicons name={action.icon} size={28} color="#1F2B1E" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}
