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
    street: '130 Milsom Ave',
    city: 'Cheektowaga, NY 14227',
    price: 142900,
    image: family,
    sqft: 1520,
    beds: 3,
    baths: 2,
    posted: '16H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T19:00:00'),
    lat: 42.9074,
    lng: -78.7546,
    vip: true,
  },
  {
    id: 'h2',
    street: '140 Forgham Rd',
    city: 'Rochester, NY 14616',
    price: 149000,
    image: villa,
    sqft: 1640,
    beds: 3,
    baths: 2,
    posted: '16H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T18:30:00'),
    lat: 43.2158,
    lng: -77.6814,
  },
  {
    id: 'h3',
    street: '60 Navarre Rd',
    city: 'Rochester, NY 14621',
    price: 128700,
    image: modern,
    sqft: 1380,
    beds: 3,
    baths: 1,
    posted: '18H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T16:00:00'),
    lat: 43.1846,
    lng: -77.5978,
  },
  {
    id: 'h4',
    street: '106 Pamela Ct',
    city: 'Buffalo, NY 14224',
    price: 185000,
    image: waterfront,
    sqft: 1890,
    beds: 4,
    baths: 2,
    posted: '1D ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T10:00:00'),
    lat: 42.8259,
    lng: -78.7452,
  },
  {
    id: 'h5',
    street: '3025 County Highway',
    city: 'Meridale, NY 13757',
    price: 172000,
    image: featured,
    sqft: 1760,
    beds: 3,
    baths: 2,
    posted: '1D ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-06T21:00:00'),
    lat: 42.3652,
    lng: -74.9051,
  },
  {
    id: 'h6',
    street: '109 Eastman Ests',
    city: 'Rochester, NY 14622',
    price: 220000,
    image: skyline,
    sqft: 1520,
    beds: 3,
    baths: 2,
    posted: '2D ago',
    perfectFit: false,
    type: 'House',
    createdAt: Date.parse('2026-09-06T12:00:00'),
    lat: 43.2159,
    lng: -77.5483,
  },
  {
    id: 'h7',
    street: '88 Harbor Lane',
    city: 'Buffalo, NY 14202',
    price: 310000,
    image: apartment,
    sqft: 980,
    beds: 3,
    baths: 2,
    posted: '3D ago',
    perfectFit: false,
    type: 'Apartment',
    createdAt: Date.parse('2026-09-05T09:00:00'),
    lat: 42.8866,
    lng: -78.8781,
  },
  {
    id: 'h8',
    street: '12 Elmwood Plaza',
    city: 'Rochester, NY 14607',
    price: 265000,
    image: condo,
    sqft: 1120,
    beds: 3,
    baths: 1,
    posted: '4D ago',
    perfectFit: false,
    type: 'Condo',
    createdAt: Date.parse('2026-09-04T15:00:00'),
    lat: 43.1462,
    lng: -77.5854,
  },
  {
    id: 'h9',
    street: '441 Lakeview Dr',
    city: 'Cheektowaga, NY 14225',
    price: 198500,
    image: visit2,
    sqft: 2100,
    beds: 4,
    baths: 3,
    posted: '5D ago',
    perfectFit: true,
    type: 'Villa',
    createdAt: Date.parse('2026-09-03T11:00:00'),
    lat: 42.9281,
    lng: -78.7364,
    vip: true,
  },
  {
    id: 'h10',
    street: '77 Maple Grove',
    city: 'Buffalo, NY 14209',
    price: 156400,
    image: villa,
    sqft: 1680,
    beds: 3,
    baths: 2,
    posted: '6H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-08T06:00:00'),
    lat: 42.9142,
    lng: -78.8461,
    vip: true,
  },
  {
    id: 'h11',
    street: '19 Parkside Ct',
    city: 'Rochester, NY 14609',
    price: 174900,
    image: family,
    sqft: 1820,
    beds: 4,
    baths: 2,
    posted: '8H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-08T04:00:00'),
    lat: 43.1654,
    lng: -77.5621,
    vip: true,
  },
  {
    id: 'h12',
    street: '540 Delaware Ave',
    city: 'Buffalo, NY 14202',
    price: 239000,
    image: modern,
    sqft: 1960,
    beds: 3,
    baths: 2,
    posted: '9H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-08T03:00:00'),
    lat: 42.9018,
    lng: -78.8724,
    vip: true,
  },
  {
    id: 'h13',
    street: '28 Clinton Pl',
    city: 'Rochester, NY 14620',
    price: 189500,
    image: condo,
    sqft: 1440,
    beds: 3,
    baths: 2,
    posted: '11H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-08T01:00:00'),
    lat: 43.1348,
    lng: -77.6112,
    vip: true,
  },
  {
    id: 'h14',
    street: '91 Hertel Ave',
    city: 'Buffalo, NY 14216',
    price: 162750,
    image: waterfront,
    sqft: 1710,
    beds: 3,
    baths: 2,
    posted: '12H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T23:00:00'),
    lat: 42.9426,
    lng: -78.8553,
    vip: true,
  },
  {
    id: 'h15',
    street: '310 Culver Rd',
    city: 'Rochester, NY 14607',
    price: 205000,
    image: featured,
    sqft: 1880,
    beds: 4,
    baths: 3,
    posted: '14H ago',
    perfectFit: true,
    type: 'Villa',
    createdAt: Date.parse('2026-09-07T21:00:00'),
    lat: 43.1522,
    lng: -77.5764,
    vip: true,
  },
  {
    id: 'h16',
    street: '64 Grant St',
    city: 'Buffalo, NY 14213',
    price: 147800,
    image: skyline,
    sqft: 1390,
    beds: 3,
    baths: 1,
    posted: '15H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T20:00:00'),
    lat: 42.9221,
    lng: -78.8927,
    vip: true,
  },
  {
    id: 'h17',
    street: '8 Lake Ave',
    city: 'Rochester, NY 14608',
    price: 228900,
    image: apartment,
    sqft: 1610,
    beds: 3,
    baths: 2,
    posted: '20H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T15:00:00'),
    lat: 43.1711,
    lng: -77.6278,
    vip: true,
  },
  {
    id: 'h18',
    street: '215 Amherst St',
    city: 'Buffalo, NY 14207',
    price: 193400,
    image: visit1,
    sqft: 2040,
    beds: 4,
    baths: 2,
    posted: '22H ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T13:00:00'),
    lat: 42.9384,
    lng: -78.8871,
    vip: true,
  },
  {
    id: 'h19',
    street: '41 Alexander St',
    city: 'Rochester, NY 14620',
    price: 176250,
    image: modern,
    sqft: 1575,
    beds: 3,
    baths: 2,
    posted: '1D ago',
    perfectFit: true,
    type: 'House',
    createdAt: Date.parse('2026-09-07T08:00:00'),
    lat: 43.1406,
    lng: -77.5994,
    vip: true,
  },
  {
    id: 'h20',
    street: '18 Nottingham Ter',
    city: 'Buffalo, NY 14216',
    price: 214000,
    image: family,
    sqft: 1980,
    beds: 4,
    baths: 3,
    posted: '1D ago',
    perfectFit: true,
    type: 'Villa',
    createdAt: Date.parse('2026-09-06T18:00:00'),
    lat: 42.9512,
    lng: -78.8388,
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
  ['Buffalo', 'NY 14202'],
  ['Rochester', 'NY 14607'],
  ['Cheektowaga', 'NY 14225'],
  ['Syracuse', 'NY 13202'],
  ['Albany', 'NY 12207'],
  ['Utica', 'NY 13501'],
]
const CATALOG_STREETS = [
  '14 Niagara St',
  '88 Monroe Ave',
  '210 Genesee St',
  '5 Court St',
  '73 Franklin St',
  '19 Union Rd',
  '402 Main St',
  '61 Oak St',
  '27 Pine Ave',
  '150 Exchange St',
]

function catalogTitle(deal, category, city, beds) {
  const place = `${city} shahrida`
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
    lat: 42.88 + (index % 8) * 0.04,
    lng: -78.87 + (index % 6) * 0.05,
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
