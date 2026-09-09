import villa from '../assets/properties/villa.jpg'
import apartment from '../assets/properties/apartment.jpg'
import waterfront from '../assets/properties/waterfront.jpg'
import condo from '../assets/properties/condo.jpg'
import family from '../assets/properties/family.jpg'
import skyline from '../assets/properties/skyline.jpg'
import modern from '../assets/properties/modern.jpg'
import featured from '../assets/properties/featured.jpg'

const CLIPS = [
  '/stories/clip1.mp4',
  '/stories/clip2.mp4',
  '/stories/clip3.mp4',
  '/stories/clip4.mp4',
  '/stories/clip5.mp4',
]

const POSTERS = [villa, apartment, waterfront, condo, family, skyline, modern, featured]

function clip(index) {
  return CLIPS[index % CLIPS.length]
}

function poster(index) {
  return POSTERS[index % POSTERS.length]
}

function slides(count, offset, extras = []) {
  return Array.from({ length: count }, (_, index) => {
    const extra = extras[index] ?? {}
    return {
      id: `s${offset}-${index + 1}`,
      video: clip(offset + index),
      poster: poster(offset + index),
      badge: extra.badge ?? '',
      caption: extra.caption ?? '',
      cta: extra.cta ?? "Menga qo'ng'iroq qiling",
    }
  })
}

export const STORIES = [
  {
    id: 'uysot',
    name: 'Uysot',
    accent: '#1363d2',
    mark: 'U',
    phone: '+998555888111',
    slides: slides(8, 0, [
      {
        badge: "G'AYRIODDIY BINOLARNING ENG YAXSHILARI",
        caption: "Qaysi biriga borib ko'rgan bo'lardiz? Izohlarda yozib qoldiring!",
      },
      { caption: 'Yangi turar-joy majmualari — bugun bron qiling.' },
      { caption: 'Toshkent markazidagi premium xonadonlar.' },
      { caption: "Hovli va tomorqa variantlarini ham ko'ring." },
      { caption: 'Ipoteka va to‘lov rejalari mavjud.' },
      { caption: "Ichki dizayn — kalitga tayyor uylar." },
      { caption: 'Dam olish va dacha loyihalari.' },
      { caption: "Batafsil ma'lumot uchun qo'ng'iroq qiling." },
    ]),
  },
  {
    id: 'bektemir',
    name: 'Bektemir Residence',
    accent: '#0a53c2',
    mark: 'B',
    phone: '+998555888111',
    slides: slides(3, 2, [
      { badge: 'BEKTEMIR RESIDENCE', caption: 'Yangi bosqich sotuvi boshlandi.' },
      { caption: 'Oilaviy xonadonlar va keng hovlilar.' },
      { caption: 'Bugun tashrif buyuring — joylar cheklangan.' },
    ]),
  },
  {
    id: 'nova',
    name: 'Nova House',
    accent: '#1e6edd',
    mark: 'N',
    phone: '+998555888111',
    slides: slides(5, 4, [
      { badge: 'NOVA HOUSE', caption: 'Zamonaviy arxitektura, qulay joylashuv.' },
      { caption: '2–4 xonali kvartiralar.' },
      { caption: 'Yer usti parking va bolalar maydonchasi.' },
      { caption: 'Tez orada kalit topshirish.' },
      { caption: 'Konsultatsiya bepul.' },
    ]),
  },
  {
    id: 'avalon',
    name: 'Avalon Residence',
    accent: '#2bb8de',
    mark: 'A',
    phone: '+998555888111',
    slides: slides(4, 1, [
      { badge: 'AVALON', caption: 'Suv bo‘yidagi hayot — Avalon Residence.' },
      { caption: 'Panoramali derazalar va terrasalar.' },
      { caption: 'Fitnes, spa va yopiq hovuz.' },
      { caption: "Showroom bugun ochiq." },
    ]),
  },
  {
    id: 'golden',
    name: 'Golden House',
    accent: '#2f62ef',
    mark: 'G',
    phone: '+998555888111',
    slides: slides(2, 5, [
      { badge: 'GOLDEN HOUSE', caption: 'Premium klassdagi yangi bino.' },
      { caption: 'Cheklangan sonli penthouselar.' },
    ]),
  },
  {
    id: 'tashkent-city',
    name: 'Tashkent City',
    accent: '#1363d2',
    mark: 'T',
    phone: '+998555888111',
    slides: slides(6, 3, [
      { badge: 'TASHKENT CITY', caption: 'Shahar markazidagi yangi hayot.' },
      { caption: 'Ofis va turar-joy majmuasi.' },
      { caption: 'Metro va park yonida.' },
      { caption: 'Smart-uy tizimlari.' },
      { caption: 'Investitsiya uchun qulay.' },
      { caption: "Savdo bo'limi 24/7." },
    ]),
  },
]

const SEEN_KEY = 'mixsells-story-seen'

export function readStorySeen() {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function writeStorySeen(seen) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen))
  } catch {
    /* ignore */
  }
}
