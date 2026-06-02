/**
 * Pantalla de listado de todos los eventos.
 * Obtiene eventos desde el backend y permite filtrarlos por texto.
 *
 * @returns {JSX.Element} Listado de eventos disponibles.
 * @author Manuel García Nieto
 */
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, ImageBackground, Pressable, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { categoryTranslationKeys } from '@/constants/translations'
import { shadows } from '@/constants/theme'
import { Event, events as demoEvents } from '@/data/demo'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { fetchEvents } from '@/services/api'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'

function EventCard({ event }: { event: Event }) {
  const { isSmallPhone } = useResponsiveLayout()
  const { colors, isDarkMode } = useTheme()
  const { t } = useLanguage()
  const categoryKey = event.category ? categoryTranslationKeys[event.category] : undefined
  const categoryLabel = categoryKey ? t(categoryKey) : event.category ?? t('category.event')
  const categoryBadgeBackground = isDarkMode ? '#58D66B' : '#4DB84F'
  const categoryBadgeText = isDarkMode ? '#0B3213' : '#163D18'

  // Imagen superior de la tarjeta para mantener continuidad visual con el mockup de eventos.
  return (
    <View className="overflow-hidden rounded-4xl" style={[shadows.soft, { backgroundColor: colors.surface }]}>
      <ImageBackground
        source={event.image}
        resizeMode="cover"
        className="justify-end p-5"
        imageStyle={{ borderTopLeftRadius: 32, borderTopRightRadius: 32 }}
        style={{ height: isSmallPhone ? 152 : 176 }}
      >
        <View className="absolute inset-0 bg-black/30" />
        <View className="self-start rounded-3xl px-4 py-2" style={{ backgroundColor: categoryBadgeBackground }}>
          <Text className="font-poppins-bold text-xs uppercase" style={{ color: categoryBadgeText }}>{categoryLabel}</Text>
        </View>
      </ImageBackground>

      <View className="gap-4 p-5">
        <Text className={`${isSmallPhone ? 'text-xl' : 'text-2xl'} font-poppins-bold`} style={{ color: colors.text }}>{event.title}</Text>
        <Text className="font-poppins-medium text-base leading-6" style={{ color: colors.mutedText }}>{event.description}</Text>

        <View className="flex-row flex-wrap gap-3">
          <View className="flex-row items-center gap-2 rounded-3xl px-4 py-3" style={{ backgroundColor: colors.surfaceWarm }}>
            <Ionicons name="calendar-outline" size={19} color={colors.greenDark} />
            <Text className="font-poppins-bold text-sm" style={{ color: colors.greenDark }}>{event.date}</Text>
          </View>
          <View className="flex-row items-center gap-2 rounded-3xl px-4 py-3" style={{ backgroundColor: colors.surfaceWarm }}>
            <Ionicons name="timer-outline" size={19} color={colors.greenDark} />
            <Text className="font-poppins-bold text-sm" style={{ color: colors.greenDark }}>{event.duration}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default function AllEventsScreen() {
  const { contentWidthStyle, horizontalPadding, isSmallPhone, screenPaddingStyle } = useResponsiveLayout()
  const { token } = useAuth()
  const { colors } = useTheme()
  const { t } = useLanguage()
  const [remoteEvents, setRemoteEvents] = useState<Event[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const visibleEvents = remoteEvents && remoteEvents.length > 0 ? remoteEvents : demoEvents

  useEffect(() => {
    let active = true

    if (!token) {
      setRemoteEvents(null)
      return
    }

    setLoading(true)
    fetchEvents(token)
      .then((data) => {
        if (active) {
          setRemoteEvents(data.length > 0 ? data : null)
        }
      })
      .catch(() => {
        if (active) {
          setRemoteEvents(null)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [token])

  const filteredEvents = useMemo(() => {
    // La búsqueda combina título, descripción y categoría para que el filtrado sea más flexible.
    const query = search.trim().toLowerCase()

    if (!query) {
      return visibleEvents
    }

    return visibleEvents.filter((event) => {
      const searchableText = `${event.title} ${event.description} ${event.category ?? ''}`.toLowerCase()
      return searchableText.includes(query)
    })
  }, [search, visibleEvents])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surfaceWarm }}>
      <View style={[screenPaddingStyle, contentWidthStyle, { backgroundColor: colors.surfaceWarm, paddingTop: 24 }]}>
        <View className="flex-row items-center gap-4">
          <Pressable accessibilityLabel={t('common.back')} className="h-11 w-11 items-center justify-center rounded-3xl" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={27} color={colors.greenDark} />
          </Pressable>
          <View className="flex-1">
            <Text className={`${isSmallPhone ? 'text-2xl' : 'text-3xl'} font-poppins-bold`} style={{ color: colors.greenDark }}>{t('events.all.title')}</Text>
            <Text className="font-poppins-medium mt-1 text-base" style={{ color: colors.mutedText }}>{t('events.all.subtitle')}</Text>
          </View>
        </View>

        <View className="mt-7 h-16 flex-row items-center gap-3 rounded-4xl px-5" style={[shadows.soft, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={22} color={colors.mutedText} />
          <TextInput
            className="font-poppins-medium flex-1 text-base"
            onChangeText={setSearch}
            placeholder={t('events.all.search')}
            placeholderTextColor={colors.mutedText}
            style={{ color: colors.text }}
            value={search}
          />
        </View>

        {loading ? (
          <View className="mt-5 flex-row items-center gap-3">
            <ActivityIndicator color={colors.greenDark} />
            <Text className="font-poppins-medium" style={{ color: colors.mutedText }}>{t('events.all.updating')}</Text>
          </View>
        ) : null}
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EventCard event={item} />}
        ItemSeparatorComponent={() => <View className="h-5" />}
        contentContainerStyle={[
          contentWidthStyle,
          { paddingBottom: 130, paddingHorizontal: horizontalPadding, paddingTop: 26 },
        ]}
        ListEmptyComponent={
          <Text className="rounded-4xl p-5 text-center font-poppins-bold" style={{ backgroundColor: colors.surface, color: colors.mutedText }}>{t('events.all.empty')}</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}
