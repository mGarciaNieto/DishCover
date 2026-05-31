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
import { colors, shadows } from '@/constants/theme'
import { Event, events as demoEvents } from '@/data/demo'
import { useAuth } from '@/context/AuthContext'
import { fetchEvents } from '@/services/api'
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout'

const screenBackground = colors.surfaceWarm

function EventCard({ event }: { event: Event }) {
  const { isSmallPhone } = useResponsiveLayout()

  // Imagen superior de la tarjeta para mantener continuidad visual con el mockup de eventos.
  return (
    <View className="overflow-hidden rounded-4xl bg-white" style={shadows.soft}>
      <ImageBackground
        source={event.image}
        resizeMode="cover"
        className="justify-end p-5"
        imageStyle={{ borderTopLeftRadius: 32, borderTopRightRadius: 32 }}
        style={{ height: isSmallPhone ? 152 : 176 }}
      >
        <View className="absolute inset-0 bg-black/30" />
        <View className="self-start rounded-3xl bg-dish-green-light px-4 py-2">
          <Text className="font-poppins-bold text-xs uppercase text-dish-green-dark">{event.category ?? 'Evento'}</Text>
        </View>
      </ImageBackground>

      <View className="gap-4 p-5">
        <Text className={`${isSmallPhone ? 'text-xl' : 'text-2xl'} font-poppins-bold text-dish-text`}>{event.title}</Text>
        <Text className="font-poppins-medium text-base leading-6 text-dish-muted">{event.description}</Text>

        <View className="flex-row flex-wrap gap-3">
          <View className="flex-row items-center gap-2 rounded-3xl bg-dish-surface-warm px-4 py-3">
            <Ionicons name="calendar-outline" size={19} color={colors.greenDark} />
            <Text className="font-poppins-bold text-sm text-dish-green-dark">{event.date}</Text>
          </View>
          <View className="flex-row items-center gap-2 rounded-3xl bg-dish-surface-warm px-4 py-3">
            <Ionicons name="timer-outline" size={19} color={colors.greenDark} />
            <Text className="font-poppins-bold text-sm text-dish-green-dark">{event.duration}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default function AllEventsScreen() {
  const { contentWidthStyle, horizontalPadding, isSmallPhone, screenPaddingStyle } = useResponsiveLayout()
  const { token } = useAuth()
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
    <SafeAreaView style={{ flex: 1, backgroundColor: screenBackground }}>
      <View style={[screenPaddingStyle, contentWidthStyle, { backgroundColor: screenBackground, paddingTop: 24 }]}>
        <View className="flex-row items-center gap-4">
          <Pressable accessibilityLabel="Volver" className="h-11 w-11 items-center justify-center rounded-3xl" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={27} color={colors.greenDark} />
          </Pressable>
          <View className="flex-1">
            <Text className={`${isSmallPhone ? 'text-2xl' : 'text-3xl'} font-poppins-bold text-dish-green-dark`}>Todos los eventos</Text>
            <Text className="font-poppins-medium mt-1 text-base text-dish-muted">Descubre actividades culinarias disponibles.</Text>
          </View>
        </View>

        <View className="mt-7 h-16 flex-row items-center gap-3 rounded-4xl bg-white px-5" style={shadows.soft}>
          <Ionicons name="search" size={22} color={colors.mutedText} />
          <TextInput
            className="font-poppins-medium flex-1 text-base text-dish-text"
            onChangeText={setSearch}
            placeholder="Buscar eventos..."
            placeholderTextColor="#8B9286"
            value={search}
          />
        </View>

        {loading ? (
          <View className="mt-5 flex-row items-center gap-3">
            <ActivityIndicator color={colors.greenDark} />
            <Text className="font-poppins-medium text-dish-muted">Actualizando eventos...</Text>
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
          <Text className="rounded-4xl bg-white p-5 text-center font-poppins-bold text-dish-muted">No se han encontrado eventos.</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}
