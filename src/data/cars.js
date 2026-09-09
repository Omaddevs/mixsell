import { seedEngagement } from './properties'

const CAR_OWNERS = ['ibragimov_86', 'murodov_24', 'niyazova', 'karimov_07', 'saidova_n', 'tursunov', 'aliyeva', 'rahimov_12']

const CAR_IMAGES = [
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=900&q=80',
]

const CITIES = ['Toshkent', 'Samarqand', 'Namangan', 'Andijon', 'Farg‘ona', 'Buxoro', 'Nukus', 'Qo‘qon']

const CATALOG = [
  ['Chevrolet', 'Cobalt', 'sedan', 'benzin', 'mexanika'],
  ['Chevrolet', 'Tracker', 'suv', 'benzin', 'avtomat'],
  ['Chevrolet', 'Malibu 2', 'sedan', 'benzin', 'avtomat'],
  ['Kia', 'K5', 'sedan', 'benzin', 'avtomat'],
  ['Kia', 'Sportage', 'suv', 'benzin', 'avtomat'],
  ['Hyundai', 'Sonata', 'sedan', 'gaz', 'avtomat'],
  ['Hyundai', 'Tucson', 'suv', 'benzin', 'avtomat'],
  ['BYD', 'Song Plus', 'electro', 'elektro', 'avtomat'],
  ['BYD', 'Chazor', 'sedan', 'elektro', 'avtomat'],
  ['Toyota', 'Camry', 'sedan', 'benzin', 'avtomat'],
  ['Toyota', 'RAV4', 'suv', 'benzin', 'avtomat'],
  ['BMW', '530i', 'sedan', 'benzin', 'avtomat'],
  ['Mercedes-Benz', 'E 200', 'sedan', 'benzin', 'avtomat'],
  ['Tesla', 'Model 3', 'electro', 'elektro', 'avtomat'],
  ['Daewoo', 'Nexia 3', 'sedan', 'benzin', 'mexanika'],
  ['Chevrolet', 'Onix', 'sedan', 'benzin', 'avtomat'],
  ['Kia', 'Carnival', 'minivan', 'benzin', 'avtomat'],
  ['Hyundai', 'Staria', 'minivan', 'dizel', 'avtomat'],
  ['Chevrolet', 'Equinox', 'suv', 'benzin', 'avtomat'],
  ['BYD', 'Han', 'electro', 'elektro', 'avtomat'],
  ['Lexus', 'RX 350', 'suv', 'benzin', 'avtomat'],
  ['Volkswagen', 'Passat', 'sedan', 'dizel', 'avtomat'],
  ['Chevrolet', 'Captiva', 'suv', 'gaz', 'avtomat'],
  ['Kia', 'Seltos', 'suv', 'benzin', 'avtomat'],
]

function postedLabel(index) {
  if (index % 7 === 0) return '2 soat oldin'
  if (index % 5 === 0) return '1 kun oldin'
  if (index % 4 === 0) return '3 kun oldin'
  return `${(index % 12) + 2} kun oldin`
}

function makeCar(index, vip) {
  const [make, model, type, fuel, transmission] = CATALOG[index % CATALOG.length]
  const year = 2016 + (index % 10)
  const id = vip ? `v${index + 1}` : `c${index + 1}`
  const deal = index % 9 === 0 ? 'rent' : 'sale'
  const salePrice = type === 'electro' ? 28000 + index * 2100 : 7800 + index * 1450
  const title = `${year} ${make} ${model}`

  return {
    id,
    title,
    make,
    model,
    year,
    type,
    fuel,
    transmission,
    mileage: 18000 + index * 7300,
    price: deal === 'rent' ? 180 + index * 15 : salePrice,
    image: CAR_IMAGES[index % CAR_IMAGES.length],
    city: CITIES[index % CITIES.length],
    posted: postedLabel(index),
    createdAt: Date.parse(`2026-09-0${(index % 7) + 1}T12:00:00`),
    owner: index % 3 !== 1,
    ownerName: CAR_OWNERS[index % CAR_OWNERS.length],
    deal,
    isTop: !vip && index % 4 === 0,
    vip,
    ...seedEngagement(id, { vip }),
  }
}

export const vipCars = Array.from({ length: 12 }, (_, index) => makeCar(index, true))
export const regularCars = Array.from({ length: 48 }, (_, index) => makeCar(index + 4, false))
