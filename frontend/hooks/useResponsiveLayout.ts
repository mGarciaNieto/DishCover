/**
 * Hook de apoyo para adaptar la interfaz a diferentes tamaños de pantalla.
 * Centraliza medidas comunes calculadas con useWindowDimensions.
 *
 * @author Manuel García Nieto
 */
import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'

export function useResponsiveLayout() {
  const { height, width } = useWindowDimensions()

  return useMemo(() => {
    const isSmallPhone = width < 380
    const isShortPhone = height < 720
    const isLargePhone = width >= 430
    const isTablet = width >= 768
    const horizontalPadding = isSmallPhone ? 20 : isTablet ? 42 : 28
    const contentMaxWidth = isTablet ? 620 : 520

    return {
      contentMaxWidth,
      contentWidthStyle: {
        alignSelf: 'center' as const,
        maxWidth: contentMaxWidth,
        width: '100%' as const,
      },
      height,
      horizontalPadding,
      isLargePhone,
      isShortPhone,
      isSmallPhone,
      isTablet,
      screenPaddingStyle: {
        paddingHorizontal: horizontalPadding,
      },
      width,
    }
  }, [height, width])
}
