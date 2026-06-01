/**
 * Constantes visuales compartidas por el frontend.
 * Centraliza la paleta de colores y sombras reutilizables.
 *
 * @author Manuel García Nieto
 */
export const lightColors = {
  background: '#F8FAF2',
  surface: '#FFFFFF',
  surfaceWarm: '#FBF5E6',
  mutedSurface: '#E9E9DF',
  text: '#191B16',
  mutedText: '#626A5C',
  softText: '#9AA29A',
  green: '#078526',
  greenLight: '#4DB84F',
  greenDark: '#006D1D',
  amber: '#A06000',
  orange: '#FF9300',
  danger: '#C91D1D',
  border: '#D7DAD2',
}

export const darkColors = {
  background: '#10140F',
  surface: '#171D16',
  surfaceWarm: '#17190F',
  mutedSurface: '#242B23',
  text: '#F6F8EF',
  mutedText: '#C2CABD',
  softText: '#8F9A8C',
  green: '#25A842',
  greenLight: '#58D66B',
  greenDark: '#79E083',
  amber: '#FFB13B',
  orange: '#FF9300',
  danger: '#FF6B6B',
  border: '#354033',
}

export const colors = lightColors
export type AppColors = typeof lightColors

export const shadows = {
  soft: {
    boxShadow: '0px 10px 18px rgba(11, 48, 23, 0.12)',
    elevation: 8,
  },
}
