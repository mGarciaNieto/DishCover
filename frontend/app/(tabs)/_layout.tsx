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
import { useLanguage } from '@/context/LanguageContext'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'
import { useTheme } from '@/context/ThemeContext'

type TabIconContentProps = {
  children: ReactNode
  focused: boolean
  label: string
}

function TabIconContent({ children, focused, label }: TabIconContentProps) {
  const { isSmallPhone: compact } = useResponsiveLayout()
  const { colors } = useTheme()
  const focusedWidth = compact ? 52 : 58
  const idleWidth = compact ? 44 : 48

  // La cápsula activa se mantiene compacta para no desbordar en las pestañas laterales.
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: focused ? colors.greenLight : 'transparent',
        borderRadius: 999,
        gap: 2,
        height: compact ? 38 : 40,
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
          color: focused ? '#FFFFF8' : colors.mutedText,
          fontFamily: focused ? 'Poppins-Bold' : 'Poppins-Medium',
          fontSize: 9,
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
  const { colors } = useTheme()
  const { t } = useLanguage()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.greenLight,
        tabBarInactiveTintColor: colors.mutedText,
        sceneStyle: {
          backgroundColor: colors.surfaceWarm,
        },
        tabBarItemStyle: {
          alignItems: 'center',
          height: 46,
          justifyContent: 'center',
          overflow: 'visible',
        },
        tabBarStyle: {
          height: 58,
          minHeight: 58,
          paddingTop: 4,
          paddingBottom: 5,
          borderTopWidth: 0,
          backgroundColor: colors.surface,
          position: 'absolute',
          marginHorizontal: 24,
          marginBottom: 9,
          borderRadius: 22,
          boxShadow: '0px 10px 22px rgba(11, 48, 23, 0.12)',
          elevation: 10,
          overflow: 'visible',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ focused }) => (
            <TabIconContent focused={focused} label={t('tabs.home')}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={21} color={focused ? '#FFFFF8' : colors.mutedText} />
            </TabIconContent>
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: t('tabs.recipes'),
          tabBarIcon: ({ focused }) => (
            <TabIconContent focused={focused} label={t('tabs.recipes')}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={21} color={focused ? '#FFFFF8' : colors.mutedText} />
            </TabIconContent>
          ),
        }}
      />
      <Tabs.Screen
        name="likes"
        options={{
          title: t('tabs.favorites'),
          tabBarIcon: ({ focused }) => (
            <TabIconContent focused={focused} label={t('tabs.favorites')}>
              <Ionicons name={focused ? 'heart' : 'heart-outline'} size={21} color={focused ? '#FFFFF8' : colors.mutedText} />
            </TabIconContent>
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: t('tabs.events'),
          tabBarIcon: ({ focused }) => (
            <TabIconContent focused={focused} label={t('tabs.events')}>
              <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={21} color={focused ? '#FFFFF8' : colors.mutedText} />
            </TabIconContent>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ focused }) => (
            <TabIconContent focused={focused} label={t('tabs.profile')}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={21} color={focused ? '#FFFFF8' : colors.mutedText} />
            </TabIconContent>
          ),
        }}
      />
    </Tabs>
  )
}
