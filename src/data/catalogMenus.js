import { regularCars, vipCars } from './cars'
import { homeListings, regularListings } from './properties'

export const HOME_KINDS = [
  { id: 'all', label: "Barcha E'lonlar", hint: 'Sotuv, ijara va barcha turlar', tone: 'brand', mark: 'B' },
  { id: 'ijara', label: 'Ijara', hint: 'Oylik ijaraga uylar', tone: 'mint', mark: 'I' },
  { id: 'hovli', label: 'Hovli', hint: 'Hovli va tomorqa', tone: 'sand', mark: 'H' },
  { id: 'kvartira', label: 'Kvartira', hint: 'Xonadonlar', tone: 'brand', mark: 'K' },
  { id: 'dacha', label: 'Dacha', hint: 'Dacha va dam olish', tone: 'forest', mark: 'D' },
  { id: 'mehmonxona', label: 'Mehmonxona', hint: 'Mehmonxona va mehmon uylari', tone: 'grape', mark: 'M' },
  { id: 'yer', label: 'Quruq yer', hint: 'Yer uchastkalari', tone: 'clay', mark: 'Y' },
]

export const CAR_KINDS = [
  { id: 'all', label: "Barcha E'lonlar", hint: 'Sotuv va ijaradagi mashinalar', tone: 'brand', mark: 'B' },
  { id: 'sale', label: 'Sotuvdagi Avtolar', hint: 'Sotuvdagi mashinalar', tone: 'ink', mark: 'S' },
  { id: 'rent', label: 'Arenda avtolar', hint: 'Kunlik va oylik ijaraga', tone: 'mint', mark: 'A' },
  { id: 'models', label: 'Modellar', hint: 'Marka va modellar katalogi', tone: 'ink', mark: 'M' },
]

const allHomes = [...homeListings, ...regularListings]
const allCars = [...vipCars, ...regularCars]

export function matchesHomeKind(item, kind) {
  if (!kind || kind === 'all') return true
  if (kind === 'ijara') return item.deal === 'rent' || item.deal === 'daily'
  if (kind === 'hovli') return item.category === 'house'
  if (kind === 'kvartira') return item.category === 'apartment'
  if (kind === 'dacha') return item.category === 'dacha'
  if (kind === 'mehmonxona') return item.category === 'hotel'
  if (kind === 'yer') return item.category === 'land'
  return true
}

export function homeKindCount(kind) {
  return allHomes.filter((item) => matchesHomeKind(item, kind)).length
}

export function carKindCount(kind) {
  if (kind === 'all' || !kind) return allCars.length
  if (kind === 'models') return new Set(allCars.map((item) => item.make)).size
  if (kind === 'sale' || kind === 'rent') return allCars.filter((item) => item.deal === kind).length
  return allCars.length
}

export function formatCount(value, word = 'e’lon') {
  return `${value.toLocaleString('uz-UZ')} ta ${word}`
}

export function carMakes() {
  const map = new Map()
  allCars.forEach((car) => {
    const current = map.get(car.make) || { name: car.make, count: 0, image: car.image }
    current.count += 1
    map.set(car.make, current)
  })
  return [...map.values()].sort((a, b) => b.count - a.count)
}
