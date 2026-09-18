import villa from '../assets/properties/villa.jpg'
import apartment from '../assets/properties/apartment.jpg'
import waterfront from '../assets/properties/waterfront.jpg'
import condo from '../assets/properties/condo.jpg'
import family from '../assets/properties/family.jpg'
import skyline from '../assets/properties/skyline.jpg'
import modern from '../assets/properties/modern.jpg'
import featured from '../assets/properties/featured.jpg'
import visit1 from '../assets/properties/visit-1.jpg'
import visit2 from '../assets/properties/visit-2.jpg'
import defaultAvatar from '../assets/default-avatar.png'

export const featuredProperty = {
  id: 'featured',
  title: 'Sunset Glass Villa',
  location: 'Malibu Coast',
  image: featured,
  alt: 'Modern luxury villa with floor-to-ceiling glass and a swimming pool',
}

export const avatarImage = defaultAvatar

const listingRecords = [
  {
    id: 'h1',
    street: '12 Amir Temur shoh ko‘chasi',
    city: 'Mirzo Ulug‘bek tumani, Toshkent',
    price: 142900,
    image: family,
    sqft: 1520,
    beds: 3,
    baths: 2,
    posted: '16H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T19:00:00'),
    lat: 41.3273,
    lng: 69.288,
    vip: true,
  },
  {
    id: 'h2',
    street: '45 Bunyodkor shoh ko‘chasi',
    city: 'Chilonzor tumani, Toshkent',
    price: 149000,
    image: villa,
    sqft: 1640,
    beds: 3,
    baths: 2,
    posted: '16H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T18:30:00'),
    lat: 41.282,
    lng: 69.205,
  },
  {
    id: 'h3',
    street: '7 Nukus ko‘chasi',
    city: 'Yakkasaroy tumani, Toshkent',
    price: 128700,
    image: modern,
    sqft: 1380,
    beds: 3,
    baths: 1,
    posted: '18H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T16:00:00'),
    lat: 41.289,
    lng: 69.261,
  },
  {
    id: 'h4',
    street: '23 Shahrisabz ko‘chasi',
    city: 'Shayxontohur tumani, Toshkent',
    price: 185000,
    image: waterfront,
    sqft: 1890,
    beds: 4,
    baths: 2,
    posted: '1D ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T10:00:00'),
    lat: 41.3225,
    lng: 69.2295,
  },
  {
    id: 'h5',
    street: '9 Bog‘ishamol ko‘chasi',
    city: 'Sergeli tumani, Toshkent',
    price: 172000,
    image: featured,
    sqft: 1760,
    beds: 3,
    baths: 2,
    posted: '1D ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-06T21:00:00'),
    lat: 41.2075,
    lng: 69.234,
  },
  {
    id: 'h6',
    street: '15 Farobiy ko‘chasi',
    city: 'Yunusobod tumani, Toshkent',
    price: 220000,
    image: skyline,
    sqft: 1520,
    beds: 3,
    baths: 2,
    posted: '2D ago',
    perfectFit: false,
    type: 'House',
    createdAt: Date.parse('2026-09-06T12:00:00'),
    lat: 41.36,
    lng: 69.285,
  },
  {
    id: 'h7',
    street: '31 Guliston ko‘chasi',
    city: 'Uchtepa tumani, Toshkent',
    price: 310000,
    image: apartment,
    sqft: 980,
    beds: 3,
    baths: 2,
    posted: '3D ago',
    perfectFit: false,
    type: 'Apartment',
    createdAt: Date.parse('2026-09-05T09:00:00'),
    lat: 41.295,
    lng: 69.163,
  },
  {
    id: 'h8',
    street: '3 Universitet ko‘chasi',
    city: 'Olmazor tumani, Toshkent',
    price: 265000,
    image: condo,
    sqft: 1120,
    beds: 3,
    baths: 1,
    posted: '4D ago',
    perfectFit: false,
    type: 'Condo',
    createdAt: Date.parse('2026-09-04T15:00:00'),
    lat: 41.342,
    lng: 69.2,
  },
  {
    id: 'h9',
    street: '18 Zarafshon ko‘chasi',
    city: 'Yashnobod tumani, Toshkent',
    price: 198500,
    image: visit2,
    sqft: 2100,
    beds: 4,
    baths: 3,
    posted: '5D ago',
    perfectFit: true,
    type: 'Villa',
    createdAt: Date.parse('2026-09-03T11:00:00'),
    lat: 41.29,
    lng: 69.34,
    vip: true,
  },
  {
    id: 'h10',
    street: '27 Oybek ko‘chasi',
    city: 'Bektemir tumani, Toshkent',
    price: 156400,
    image: villa,
    sqft: 1680,
    beds: 3,
    baths: 2,
    posted: '6H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-08T06:00:00'),
    lat: 41.2255,
    lng: 69.348,
    vip: true,
  },
  {
    id: 'h11',
    street: '52 Chilonzor ko‘chasi',
    city: 'Chilonzor tumani, Toshkent',
    price: 174900,
    image: family,
    sqft: 1820,
    beds: 4,
    baths: 2,
    posted: '8H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-08T04:00:00'),
    lat: 41.2705,
    lng: 69.198,
    vip: true,
  },
  {
    id: 'h12',
    street: '11 Qo‘yliq ko‘chasi',
    city: 'Yunusobod tumani, Toshkent',
    price: 239000,
    image: modern,
    sqft: 1960,
    beds: 3,
    baths: 2,
    posted: '9H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-08T03:00:00'),
    lat: 41.351,
    lng: 69.301,
    vip: true,
  },
  {
    id: 'h13',
    street: '6 Sag‘bon ko‘chasi',
    city: 'Mirobod tumani, Toshkent',
    price: 189500,
    image: condo,
    sqft: 1440,
    beds: 3,
    baths: 2,
    posted: '11H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-08T01:00:00'),
    lat: 41.294,
    lng: 69.287,
    vip: true,
  },
  {
    id: 'h14',
    street: '40 Qatortol ko‘chasi',
    city: 'Yashnobod tumani, Toshkent',
    price: 162750,
    image: waterfront,
    sqft: 1710,
    beds: 3,
    baths: 2,
    posted: '12H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T23:00:00'),
    lat: 41.283,
    lng: 69.323,
    vip: true,
  },
  {
    id: 'h15',
    street: '17 Bobur ko‘chasi',
    city: 'Mirzo Ulug‘bek tumani, Toshkent',
    price: 205000,
    image: featured,
    sqft: 1880,
    beds: 4,
    baths: 3,
    posted: '14H ago',
    perfectFit: true,
    type: 'Villa',
    createdAt: Date.parse('2026-09-07T21:00:00'),
    lat: 41.33,
    lng: 69.32,
    vip: true,
  },
  {
    id: 'h16',
    street: '2 Amir Temur shoh ko‘chasi',
    city: 'Yunusobod tumani, Toshkent',
    price: 147800,
    image: skyline,
    sqft: 1390,
    beds: 3,
    baths: 1,
    posted: '15H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T20:00:00'),
    lat: 41.345,
    lng: 69.279,
    vip: true,
  },
  {
    id: 'h17',
    street: '29 Yusuf Xos Hojib ko‘chasi',
    city: 'Shayxontohur tumani, Toshkent',
    price: 228900,
    image: apartment,
    sqft: 1610,
    beds: 3,
    baths: 2,
    posted: '20H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T15:00:00'),
    lat: 41.318,
    lng: 69.24,
    vip: true,
  },
  {
    id: 'h18',
    street: '8 Novza ko‘chasi',
    city: 'Olmazor tumani, Toshkent',
    price: 193400,
    image: visit1,
    sqft: 2040,
    beds: 4,
    baths: 2,
    posted: '22H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T13:00:00'),
    lat: 41.339,
    lng: 69.211,
    vip: true,
  },
  {
    id: 'h19',
    street: '14 Yakkasaroy ko‘chasi',
    city: 'Yakkasaroy tumani, Toshkent',
    price: 176250,
    image: modern,
    sqft: 1575,
    beds: 3,
    baths: 2,
    posted: '1D ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T08:00:00'),
    lat: 41.283,
    lng: 69.27,
    vip: true,
  },
  {
    id: 'h20',
    street: '5 Qatortol shoh ko‘chasi',
    city: 'Uchtepa tumani, Toshkent',
    price: 214000,
    image: family,
    sqft: 1980,
    beds: 4,
    baths: 3,
    posted: '1D ago',
    perfectFit: true,
    type: 'Villa',
    createdAt: Date.parse('2026-09-06T18:00:00'),
    lat: 41.29,
    lng: 69.15,
    vip: true,
  },
]

const OWNERS = [
  'ibragimov_86',
  'murodov_24',
  'niyazova',
  'karimov_07',
  'saidova_n',
  'tursunov',
  'aliyeva',
  'rahimov_12',
]

const COMMENT_TEXTS = [
  'Narxi kelishiladimi?',
  'Ipoteka olish mumkinmi?',
  'Joyini ko‘rib chiqsam bo‘ladimi?',
  'Rasmlar yangimi?',
  'Yaxshi variant ekan',
  'Necha kishi yashaydi hozir?',
]

const REPLY_TEXTS = ['Ha, savdolashamiz', 'Albatta, yozing', 'Ertalab ko‘rsataman', 'Ipoteka bor, yordam beramiz']

function hashCode(id) {
  let n = 0
  for (let i = 0; i < id.length; i += 1) n = (n * 33 + id.charCodeAt(i)) >>> 0
  return n
}

export function seedEngagement(id, { vip = false } = {}) {
  const n = hashCode(id)
  const likes = (vip ? 180 : 24) + (n % (vip ? 820 : 260))
  const shares = (vip ? 8 : 2) + (n % (vip ? 64 : 28))
  const views = likes * (7 + (n % 11)) + 120 + (n % 400)
  const count = 1 + (n % 6)
  const comments = Array.from({ length: count }, (_, i) => ({
    id: `${id}-c${i + 1}`,
    author: OWNERS[(n + i) % OWNERS.length],
    text: COMMENT_TEXTS[(n + i) % COMMENT_TEXTS.length],
    time: i === 0 ? '2 soat oldin' : i === 1 ? '1 kun oldin' : `${i + 2} kun oldin`,
    parentId: null,
    replyTo: null,
  }))
  if (comments[0] && n % 2 === 0) {
    comments.push({
      id: `${id}-c1-r1`,
      author: OWNERS[(n + 4) % OWNERS.length],
      text: REPLY_TEXTS[n % REPLY_TEXTS.length],
      time: '1 soat oldin',
      parentId: comments[0].id,
      replyTo: comments[0].author,
    })
  }
  if (comments[0] && n % 3 === 0) {
    comments.push({
      id: `${id}-c1-r2`,
      author: OWNERS[(n + 5) % OWNERS.length],
      text: REPLY_TEXTS[(n + 1) % REPLY_TEXTS.length],
      time: '40 daqiqa oldin',
      parentId: comments[0].id,
      replyTo: comments[0].author,
    })
  }
  return { likes, shares, views, comments }
}

function listingCategory(item) {
  if (item.id === 'h16') return 'hotel'
  if (item.id === 'h20') return 'land'
  if (item.id === 'h7' || item.id === 'h14') return 'dacha'
  if (item.type === 'Apartment' || item.type === 'Condo') return 'apartment'
  return 'house'
}

function listingDeal(item, index) {
  if (item.id === 'h16' || item.id === 'h20') return 'sale'
  if (index >= 16) return 'daily'
  if (index >= 13) return 'rent'
  return 'sale'
}

export const homeListings = listingRecords.map((item, index) => {
  const deal = listingDeal(item, index)
  const rentPrice = 950 + index * 70
  const dailyPrice = 55 + index * 6
  return {
    ...item,
    deal,
    category: listingCategory(item),
    owner: index % 3 !== 1,
    ownerName: OWNERS[index % OWNERS.length],
    mortgage: deal === 'sale' && index % 2 === 0,
    price: deal === 'rent' ? rentPrice : deal === 'daily' ? dailyPrice : item.price,
    createdAt:
      index >= 17
        ? Date.parse('2026-08-18T12:00:00')
        : item.createdAt,
    ...seedEngagement(item.id, { vip: true }),
  }
})

export const visitThumbnails = {
  mathew: visit1,
  jonas: visit2,
}

const CATALOG_IMAGES = [family, villa, modern, waterfront, featured, skyline, apartment, condo, visit1, visit2]
const CATALOG_CITIES = [
  ['Chilonzor', 'Toshkent'],
  ['Yunusobod', 'Toshkent'],
  ['Mirzo Ulug‘bek', 'Toshkent'],
  ['Sergeli', 'Toshkent'],
  ['Shayxontohur', 'Toshkent'],
  ['Uchtepa', 'Toshkent'],
]
const CATALOG_STREETS = [
  '14 Amir Temur ko‘chasi',
  '88 Bunyodkor ko‘chasi',
  '210 Farobiy ko‘chasi',
  '5 Guliston ko‘chasi',
  '73 Shahrisabz ko‘chasi',
  '19 Bobur ko‘chasi',
  '402 Nukus ko‘chasi',
  '61 Oybek ko‘chasi',
  '27 Qatortol ko‘chasi',
  '150 Universitet ko‘chasi',
]

function catalogTitle(deal, category, city, beds) {
  const place = `${city} tumanida`
  const action = deal === 'daily' ? 'kunlik ijaraga' : deal === 'rent' ? 'ijaraga beriladi' : 'sotiladi'
  if (category === 'land') return `${place} yer uchastkasi ${action}`
  if (category === 'hotel') return `${place} mehmonxona ${action}`
  if (category === 'dacha') return `${place} dacha ${action}`
  if (category === 'commercial') return `${place} tijorat binosi ${action}`
  if (category === 'apartment') return `${place} ${beds} xonali kvartira ${action}`
  return `${place} ${beds} xonali hovli ${action}`
}

function catalogPosted(index) {
  if (index % 7 === 0) return '2 soat oldin'
  if (index % 5 === 0) return '1 kun oldin'
  if (index % 4 === 0) return '5 kun oldin'
  if (index % 3 === 0) return '2 hafta oldin'
  return `${(index % 20) + 3} kun oldin`
}

const CATALOG_KINDS = [
  ['house', 'sale'],
  ['apartment', 'sale'],
  ['house', 'rent'],
  ['dacha', 'sale'],
  ['apartment', 'rent'],
  ['hotel', 'daily'],
  ['house', 'sale'],
  ['land', 'sale'],
  ['dacha', 'rent'],
  ['hotel', 'sale'],
]

export const regularListings = Array.from({ length: 90 }, (_, index) => {
  const [category, deal] = CATALOG_KINDS[index % CATALOG_KINDS.length]
  const beds = category === 'land' || category === 'hotel' ? 3 : 3 + (index % 2)
  const baths = 1 + (index % 3)
  const cityPair = CATALOG_CITIES[index % CATALOG_CITIES.length]
  const street = CATALOG_STREETS[index % CATALOG_STREETS.length]
  const salePrice = 98000 + index * 4700
  const rentPrice = 720 + index * 35
  const dailyPrice = 48 + index * 4
  const createdAt = Date.parse(index >= 24 ? '2026-08-12T10:00:00' : `2026-09-0${(index % 7) + 1}T12:00:00`)

  return {
    id: `r${index + 1}`,
    street,
    city: `${cityPair[0]}, ${cityPair[1]}`,
    title: catalogTitle(deal, category, cityPair[0], beds),
    price: deal === 'rent' ? rentPrice : deal === 'daily' ? dailyPrice : salePrice,
    image: CATALOG_IMAGES[index % CATALOG_IMAGES.length],
    sqft: 980 + index * 42,
    beds,
    baths,
    posted: catalogPosted(index),
    type: category === 'apartment' ? 'Apartment' : category === 'hotel' ? 'Condo' : 'House',
    createdAt,
    lat: 41.24 + (index % 8) * 0.018,
    lng: 69.16 + (index % 6) * 0.022,
    deal,
    category,
    owner: index % 3 !== 1,
    ownerName: OWNERS[index % OWNERS.length],
    mortgage: deal === 'sale' && index % 2 === 0,
    isTop: index % 4 === 0,
    vip: false,
    ...seedEngagement(`r${index + 1}`, { vip: false }),
  }
})
