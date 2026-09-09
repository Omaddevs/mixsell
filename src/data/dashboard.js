import visit1 from '../assets/properties/visit-1.jpg'
import visit2 from '../assets/properties/visit-2.jpg'
import avatar from '../assets/properties/avatar.jpg'
import villa from '../assets/properties/villa.jpg'
import apartment from '../assets/properties/apartment.jpg'
import modern from '../assets/properties/modern.jpg'
import family from '../assets/properties/family.jpg'
import featured from '../assets/properties/featured.jpg'
import waterfront from '../assets/properties/waterfront.jpg'
import condo from '../assets/properties/condo.jpg'

export const navItems = [
  { id: 'home', label: "Uy E'lonlar" },
  { id: 'cars', label: "Avto E'lonlar" },
  { id: 'saved', label: "Saqlangan E'lonlar" },
  { id: 'messages', label: 'Habarlar' },
  { id: 'notifications', label: 'Notification' },
]

export const sidebarUser = {
  name: 'James Carter',
  username: 'james_carter',
  id: '51804',
  email: 'james@mixsells.com',
}

export const sidebarPrimary = [
  { id: 'homes', label: "Uy E'lonlar", shortcut: '⌘2', route: 'home' },
  { id: 'autos', label: "Avto E'lonlar", shortcut: '⌘3', route: 'cars' },
  { id: 'saved', label: "Saqlangan E'lonlar", shortcut: '⌘4', route: 'saved' },
  { id: 'messages', label: 'Habarlar', shortcut: '⌘5', route: 'messages' },
  { id: 'notifications', label: 'Notification', shortcut: '⌘6', route: 'notifications', notify: true },
]

export const messages = [
  {
    id: 'm1',
    title: 'Sarah Chen',
    body: 'Agar bo‘lsa, 11:00 atrofida kelamiz.',
    time: '10:24',
    unread: true,
    unreadCount: 2,
    online: true,
    seen: 'onlayn',
    avatar: visit1,
    tone: '#4f8ef7',
    role: 'buyer',
    listing: {
      title: 'Harbor Bay villa',
      price: '$156,400',
      image: villa,
      location: 'Toshkent, Yashnobod',
      status: 'Faol',
      specs: ['2 sotix', '4 xona', '125 m²'],
      gallery: [villa, featured, waterfront, modern],
      extraPhotos: 12,
      kind: 'home',
    },
    thread: [
      { id: 't1', from: 'them', text: 'Assalomu alaykum, e’lon hali dolzarbmi?', time: '10:18', day: 'Bugun' },
      { id: 't2', from: 'me', text: 'Vaalaykum assalom. Ha, uy hali sotuvda.', time: '10:20', day: 'Bugun', status: 'read' },
      { id: 't3', from: 'them', type: 'listing', time: '10:21', day: 'Bugun' },
      { id: 't4', from: 'me', text: 'Manzilni ham yubordim, xaritadan ko‘ring.', time: '10:22', day: 'Bugun', status: 'read' },
      { id: 't5', from: 'me', type: 'map', place: 'Toshkent, Yashnobod', time: '10:22', day: 'Bugun', status: 'read' },
      { id: 't6', from: 'them', text: 'Ertaga Harbor Bay uyingizni ko‘rib chiqishimiz mumkinmi?', time: '10:24', day: 'Bugun' },
      { id: 't7', from: 'them', text: 'Agar bo‘lsa, 11:00 atrofida kelamiz.', time: '10:24', day: 'Bugun' },
    ],
  },
  {
    id: 'm2',
    title: 'Listing Desk',
    body: 'Modern Villa rasmlari yangilandi. Tasdiqlab qo‘ying.',
    time: 'Kecha',
    unread: false,
    unreadCount: 0,
    online: false,
    seen: 'oxirgi marta kecha',
    avatar: null,
    tone: '#1363d2',
    verified: true,
    role: 'system',
    listing: {
      title: 'Modern Villa',
      price: '$850,000',
      image: modern,
      location: 'Toshkent, Yunusobod',
      status: 'Faol',
      specs: ['3 sotix', '5 xona', '210 m²'],
      gallery: [modern, villa, featured, waterfront],
      extraPhotos: 8,
      kind: 'home',
    },
    thread: [
      { id: 't1', from: 'them', text: 'E’loningiz moderatsiyadan o‘tdi.', time: '18:02', day: 'Kecha' },
      { id: 't2', from: 'me', text: 'Rahmat, rasmlarni ham yangilayman.', time: '18:11', day: 'Kecha', status: 'read' },
      { id: 't3', from: 'them', text: 'Modern Villa rasmlari yangilandi. Tasdiqlab qo‘ying.', time: '19:40', day: 'Kecha' },
    ],
  },
  {
    id: 'm3',
    title: 'Aziz Karimov',
    body: 'Cobalt avtomobil hali sotuvdami? Narxni muhokama qilamiz.',
    time: 'Dush',
    unread: true,
    unreadCount: 1,
    online: false,
    seen: 'oxirgi marta 3 soat oldin',
    avatar: visit2,
    tone: '#22c55e',
    role: 'buyer',
    listing: {
      title: 'Chevrolet Cobalt',
      price: '$12,400',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
      location: 'Toshkent, Chilonzor',
      status: 'Faol',
      specs: ['2021', 'Sedan', '86 ming km'],
      gallery: [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80',
      ],
      extraPhotos: 6,
      kind: 'car',
    },
    thread: [
      { id: 't1', from: 'them', text: 'Salom, Cobaltni ko‘rish mumkinmi?', time: '16:40', day: 'Dushanba' },
      { id: 't2', from: 'me', text: 'Ha, kechki payt bo‘shman.', time: '17:02', day: 'Dushanba', status: 'read' },
      { id: 't3', from: 'them', text: 'Cobalt avtomobil hali sotuvdami? Narxni muhokama qilamiz.', time: '17:15', day: 'Dushanba' },
    ],
  },
  {
    id: 'm4',
    title: 'Nilufar Akramova',
    body: '2 xonali kvartira bo‘yicha ipoteka shartlari qanday?',
    time: 'Yak',
    unread: false,
    unreadCount: 0,
    online: true,
    seen: 'onlayn',
    avatar: family,
    tone: '#f59e0b',
    role: 'buyer',
    listing: {
      title: '2 xonali kvartira',
      price: '$89,000',
      image: apartment,
      location: 'Toshkent, Mirzo Ulug‘bek',
      status: 'Faol',
      specs: ['2 xona', '54 m²', '4/9 qavat'],
      gallery: [apartment, condo, modern, family],
      extraPhotos: 9,
      kind: 'home',
    },
    thread: [
      { id: 't1', from: 'them', text: 'Kvartira hali bo‘shmi?', time: '12:10', day: 'Yakshanba' },
      { id: 't2', from: 'me', text: 'Ha, hozircha band qilinmagan.', time: '12:22', day: 'Yakshanba', status: 'read' },
      { id: 't3', from: 'them', text: '2 xonali kvartira bo‘yicha ipoteka shartlari qanday?', time: '12:31', day: 'Yakshanba' },
      { id: 't4', from: 'me', text: 'Boshlang‘ich to‘lov 20%, qolgani 15 yilgacha.', time: '12:40', day: 'Yakshanba', status: 'read' },
    ],
  },
  {
    id: 'm5',
    title: 'Jasur Tursunov',
    body: 'Rasmlarni yubordim, ko‘rib chiqing.',
    time: 'Juma',
    unread: false,
    unreadCount: 0,
    online: false,
    seen: 'oxirgi marta juma',
    avatar: avatar,
    tone: '#8b5cf6',
    role: 'seller',
    listing: {
      title: 'Oilaviy uy',
      price: '$142,000',
      image: villa,
      location: 'Toshkent, Sergeli',
      status: 'Faol',
      specs: ['3 sotix', '6 xona', '180 m²'],
      gallery: [villa, family, featured, waterfront],
      extraPhotos: 10,
      kind: 'home',
    },
    thread: [
      { id: 't1', from: 'me', text: 'Hovli tomondan ham rasm bormi?', time: '09:12', day: 'Juma', status: 'read' },
      { id: 't2', from: 'them', text: 'Rasmlarni yubordim, ko‘rib chiqing.', time: '09:28', day: 'Juma' },
    ],
  },
]

export const notifications = [
  {
    id: 'n1',
    title: 'Yangi so‘rov',
    body: 'Ocean View uyiga yangi mijoz qiziqish bildirmoqda.',
    time: '12 daqiqa oldin',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Ko‘rik 40 daqiqadan keyin',
    body: 'Edward Mathew · 10:00 AM',
    time: '40 daqiqa',
    unread: true,
  },
  {
    id: 'n3',
    title: 'E’lon tasdiqlandi',
    body: 'Avto e’loningiz faol holatga o‘tdi.',
    time: 'Kecha',
    unread: false,
  },
  {
    id: 'n4',
    title: 'Saqlangan e’lon arzonlashdi',
    body: 'Urban Apartment narxi $8,000 ga tushdi.',
    time: '2 kun oldin',
    unread: false,
  },
]
