/**
 * Configuración de navegación inferior de DishCover.
 * Define las pestañas principales y sus iconos.
 *
 * @returns {JSX.Element} Navegación por pestañas de la aplicación.
 * @author Manuel García Nieto
 */
import { Tabs } from 'expo-router'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { colors } from '@/constants/theme'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'

type TabIconContentProps = {
  children: ReactNode
  focused: boolean
  label: string
}

function TabIconContent({ children, focused, label }: TabIconContentProps) {
  const { isSmallPhone: compact } = useResponsiveLayout()
  const focusedWidth = compact ? 70 : 80
  const idleWidth = compact ? 56 : 64

  // La cápsula activa se mantiene compacta para no desbordar en las pestañas laterales.
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: focused ? colors.greenLight : 'transparent',
        borderRadius: 999,
        gap: 2,
        height: compact ? 46 : 50,
        justifyContent: 'center',
        width: focused ? focusedWidth : idleWidth,
      }}
    >
      {children}
      <Text
        adjustsFontSizeToFit
        minimumFontScale={0.72}
        numberOfLines={1}
        style={{
          color: focused ? '#FFFFF8' : '#6C6A64',
          fontFamily: focused ? 'Poppins-Bold' : 'Poppins-Medium',
          fontSize: compact ? 10 : 11,
          includeFontPadding: false,
          letterSpacing: 0,
          textAlign: 'center',
          textTransform: 'uppercase',
          width: focused ? focusedWidth - 10 : idleWidth - 6,
        }}
      >
        {label}
      </Text>
    </View>
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.greenLight,
        tabBarInactiveTintColor: '#6C6A64',
        sceneStyle: {
          backgroundColor: colors.surfaceWarm,
        },
        tabBarItemStyle: {
          alignItems: 'center',
          height: 62,
          justifyContent: 'center',
          overflow: 'visible',
        },
        tabBarStyle: {
          minHeight: 78,
          paddingTop: 9,
          paddingBottom: 11,
          borderTopWidth: 0,
          backgroundColor: '#FFFFF8',
          position: 'absolute',
          marginHorizontal: 18,
          marginBottom: 12,
          borderRadius: 28,
          boxShadow: '0px 10px 22px rgba(11, 48, 23, 0.12)',
          elevation: 10,
          overflow: 'visible',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => (
            <TabIconContent focused={focused} label="Inicio">
              <Ionicons name={focused ? 'home' : 'home-outline'} size={23} color={focused ? '#FFFFF8' : '#6C6A64'} />
            </TabIconContent>
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recetas',
          tabBarIcon: ({ focused }) => (
            <TabIconContent focused={focused} label="Recetas">
              <MaterialCommunityIcons name="silverware-fork-knife" size={24} color={focused ? '#FFFFF8' : '#6C6A64'} />
            </TabIconContent>
          ),
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ focused }) => (
            <TabIconContent focused={focused} label="Favoritos">
              <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={focused ? '#FFFFF8' : '#6C6A64'} />
            </TabIconContent>
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ focused }) => (
            <TabIconContent focused={focused} label="Eventos">
              <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={23} color={focused ? '#FFFFF8' : '#6C6A64'} />
            </TabIconContent>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <TabIconContent focused={focused} label="Perfil">
              <Ionicons name={focused ? 'person' : 'person-outline'} size={23} color={focused ? '#FFFFF8' : '#6C6A64'} />
            </TabIconContent>
          ),
        }}
      />
    </Tabs>
  )
}
