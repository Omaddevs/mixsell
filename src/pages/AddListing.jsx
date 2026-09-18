import { useState } from 'react'
import { Check, ExternalLink, ImagePlus, Menu, Video, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AttributionControl, MapContainer, Marker, ScaleControl, TileLayer, ZoomControl, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import Layout from '../components/Layout'
import { useMobileMenu } from '../context/MobileMenuContext'

const TASHKENT_CENTER = [41.311, 69.279]

const PIN_ICON = L.divIcon({
  className: 'add-listing-pin-wrap',
  html: '<span class="add-listing-pin"></span>',
  iconSize: [26, 34],
  iconAnchor: [13, 32],
})

const PROPERTY_TYPES = [
  { id: 'xonadon', label: 'Xonadon' },
  { id: 'hovli', label: 'Hovli uy' },
  { id: 'yer', label: 'Yer' },
]

const ROOM_OPTIONS = ['Studiya', '1', '2', '3', '4', '5', '6+']
const COUNT_OPTIONS = ['1', '2', '3']
const YES_NO = [
  { id: 'bor', label: 'Bor' },
  { id: 'yoq', label: 'Yo‘q' },
]
const BALCONY_OPTIONS = [
  { id: 'lodjiya', label: 'Lodjiya' },
  { id: 'balkon', label: 'Balkon' },
]
const BATHROOM_OPTIONS = [
  { id: 'birlashtirilgan', label: 'Birlashtirilgan' },
  { id: 'alohida', label: 'Alohida' },
]
const CURRENCIES = [
  { id: 'uzs', label: 'UZS' },
  { id: 'usd', label: 'USD' },
]

const INITIAL_FORM = {
  propertyType: 'xonadon',
  address: '',
  landmark: '',
  lat: TASHKENT_CENTER[0],
  lng: TASHKENT_CENTER[1],
  rooms: '',
  totalArea: '',
  livingArea: '',
  floor: '',
  floorsTotal: '',
  balcony: [],
  balconyCount: '',
  bathroom: [],
  bathroomCount: '',
  yearBuilt: '',
  passengerLift: '',
  freightLift: '',
  gas: '',
  description: '',
  currency: 'uzs',
  price: '',
  negotiable: '',
  mortgage: '',
  boostViews: false,
  sellerType: 'owner',
  sellerName: '',
  sellerPhone: '',
}

function toggleInArray(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

function MenuToggle() {
  const { onOpenMenu } = useMobileMenu()
  return (
    <button type="button" className="menu-toggle" aria-label="Open navigation" onClick={onOpenMenu}>
      <Menu size={18} />
    </button>
  )
}

function LocationPicker({ onPick }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng)
    },
  })
  return null
}

export default function AddListing() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...INITIAL_FORM })
  const [photos, setPhotos] = useState([])
  const [video, setVideo] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const isLand = form.propertyType === 'yer'
  const isApartment = form.propertyType === 'xonadon'
  const showRooms = !isLand
  const showLivingArea = !isLand
  const showFloor = !isLand
  const showBalcony = isApartment
  const showBathroom = !isLand
  const showBuildingCard = !isLand
  const showLifts = isApartment

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function pickLocation(latlng) {
    setForm((current) => ({ ...current, lat: latlng.lat, lng: latlng.lng }))
  }

  function addPhotos(event) {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    const valid = files.filter((file) => file.type.startsWith('image/')).slice(0, 8 - photos.length)
    valid.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        setPhotos((current) => [...current, { id: `${Date.now()}-${Math.random()}`, src: String(reader.result) }])
      }
      reader.readAsDataURL(file)
    })
  }

  function removePhoto(id) {
    setPhotos((current) => current.filter((photo) => photo.id !== id))
  }

  function addVideo(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setVideo({ name: file.name, src: URL.createObjectURL(file) })
  }

  function removeVideo() {
    if (video) URL.revokeObjectURL(video.src)
    setVideo(null)
  }

  function openInYandex() {
    const url = `https://yandex.uz/maps/?ll=${form.lng}%2C${form.lat}&z=16&pt=${form.lng},${form.lat}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (
      !form.address.trim() ||
      (showRooms && !form.rooms) ||
      !form.totalArea.trim() ||
      (showFloor && !form.floor.trim()) ||
      !form.price.trim() ||
      photos.length < 3 ||
      !form.sellerName.trim() ||
      !form.sellerPhone.trim()
    ) {
      setError('Iltimos, majburiy maydonlarni to‘ldiring')
      return
    }
    setError('')
    setSubmitted(true)
  }

  function resetForm() {
    setForm({ ...INITIAL_FORM, sellerPhone: form.sellerPhone })
    setPhotos([])
    removeVideo()
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <Layout variant="home" hero={false}>
        <main className="listings-page add-listing-page">
          <div className="add-listing-success">
            <span className="add-listing-success-icon">
              <Check size={26} strokeWidth={2.6} />
            </span>
            <h1>E’loningiz yuborildi</h1>
            <p>Moderatsiyadan o‘tgach, e’loningiz saytda chop etiladi. Odatda bu 1 soatgacha vaqt oladi.</p>
            <div className="add-listing-success-actions">
              <button type="button" className="profile-btn is-primary" onClick={resetForm}>
                Yana e’lon qo‘shish
              </button>
              <button type="button" className="profile-btn" onClick={() => navigate('/')}>
                Bosh sahifaga qaytish
              </button>
            </div>
          </div>
        </main>
      </Layout>
    )
  }

  return (
    <Layout variant="home" hero={false}>
      <main className="listings-page add-listing-page">
        <header className="profile-top">
          <MenuToggle />
          <div className="profile-who">
            <span>
              <strong>Yangi e’lon</strong>
              <em>Ko‘chmas mulkni bozorga chiqaring</em>
            </span>
          </div>
        </header>

        <form className="add-listing-form" onSubmit={handleSubmit}>
          <section className="add-listing-card">
            <h2>Asosiy ma’lumot</h2>

            <div className="add-listing-segmented">
              {PROPERTY_TYPES.map((item) => {
                const on = form.propertyType === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={on ? 'is-on' : undefined}
                    aria-pressed={on}
                    onClick={() => update('propertyType', item.id)}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>

            <div className="profile-form">
              <label>
                <span className="add-listing-label-row">
                  Manzil <span className="add-listing-req">*</span>
                </span>
                <input
                  value={form.address}
                  onChange={(event) => update('address', event.target.value)}
                  placeholder="Ko‘cha va uy raqamini kiriting"
                />
              </label>
            </div>

            <div className="add-listing-map">
              <MapContainer
                center={[form.lat, form.lng]}
                zoom={13}
                scrollWheelZoom={false}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  subdomains="abc"
                  maxZoom={19}
                  attribution="&copy; OpenStreetMap contributors"
                />
                <AttributionControl position="bottomright" prefix={false} />
                <ZoomControl position="bottomright" />
                <ScaleControl position="bottomright" imperial={false} />
                <LocationPicker onPick={pickLocation} />
                <Marker position={[form.lat, form.lng]} icon={PIN_ICON} />
              </MapContainer>
              <button type="button" className="add-listing-map-open" onClick={openInYandex}>
                <ExternalLink size={13} strokeWidth={2.2} />
                Yandex xaritada ochish
              </button>
            </div>

            <div className="profile-form">
              <label>
                <span className="add-listing-label-row">
                  Mo‘ljal
                  <span className="add-listing-hint" title="Yaqin atrofdagi mashhur joy yoki mo‘ljalni ko‘rsating">
                    i
                  </span>
                </span>
                <input
                  value={form.landmark}
                  onChange={(event) => update('landmark', event.target.value)}
                  placeholder="Masalan, Furqat bog‘i"
                />
              </label>
            </div>

            {showRooms ? (
              <div>
                <span className="add-listing-subtitle">
                  Xonalar soni <span className="add-listing-req">*</span>
                </span>
                <div className="add-listing-picker">
                  {ROOM_OPTIONS.map((option) => {
                    const on = form.rooms === option
                    return (
                      <button
                        key={option}
                        type="button"
                        className={`add-listing-pick${option !== 'Studiya' ? ' add-listing-pick--circle' : ''}${on ? ' is-on' : ''}`}
                        aria-pressed={on}
                        onClick={() => update('rooms', option)}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}

            <div className="profile-form add-listing-fields">
              <label>
                <span className="add-listing-label-row">
                  Umumiy maydon <span className="add-listing-req">*</span>
                </span>
                <div className="add-listing-suffixed">
                  <input
                    inputMode="numeric"
                    value={form.totalArea}
                    onChange={(event) => update('totalArea', event.target.value.replace(/[^\d.]/g, ''))}
                    placeholder="0"
                  />
                  <span>m²</span>
                </div>
              </label>
              {showLivingArea ? (
                <label>
                  Yashash maydoni
                  <div className="add-listing-suffixed">
                    <input
                      inputMode="numeric"
                      value={form.livingArea}
                      onChange={(event) => update('livingArea', event.target.value.replace(/[^\d.]/g, ''))}
                      placeholder="0"
                    />
                    <span>m²</span>
                  </div>
                </label>
              ) : null}
              {showFloor ? (
                <label>
                  <span className="add-listing-label-row">
                    Qavat <span className="add-listing-req">*</span>
                  </span>
                  <input
                    inputMode="numeric"
                    value={form.floor}
                    onChange={(event) => update('floor', event.target.value.replace(/[^\d]/g, ''))}
                  />
                </label>
              ) : null}
              {showFloor ? (
                <label>
                  Qavatlar soni
                  <input
                    inputMode="numeric"
                    value={form.floorsTotal}
                    onChange={(event) => update('floorsTotal', event.target.value.replace(/[^\d]/g, ''))}
                  />
                </label>
              ) : null}
            </div>

            {showBalcony ? (
              <>
                <div>
                  <span className="add-listing-subtitle">Balkon</span>
                  <div className="add-listing-picker">
                    {BALCONY_OPTIONS.map((option) => {
                      const on = form.balcony.includes(option.id)
                      return (
                        <button
                          key={option.id}
                          type="button"
                          className={`add-listing-pick${on ? ' is-on' : ''}`}
                          aria-pressed={on}
                          onClick={() => update('balcony', toggleInArray(form.balcony, option.id))}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <span className="add-listing-subtitle">Balkonlar soni</span>
                  <div className="add-listing-picker">
                    {COUNT_OPTIONS.map((option) => {
                      const on = form.balconyCount === option
                      return (
                        <button
                          key={option}
                          type="button"
                          className={`add-listing-pick add-listing-pick--circle${on ? ' is-on' : ''}`}
                          aria-pressed={on}
                          onClick={() => update('balconyCount', option)}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : null}

            {showBathroom ? (
              <>
                <div>
                  <span className="add-listing-subtitle">Sanuzel</span>
                  <div className="add-listing-picker">
                    {BATHROOM_OPTIONS.map((option) => {
                      const on = form.bathroom.includes(option.id)
                      return (
                        <button
                          key={option.id}
                          type="button"
                          className={`add-listing-pick${on ? ' is-on' : ''}`}
                          aria-pressed={on}
                          onClick={() => update('bathroom', toggleInArray(form.bathroom, option.id))}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <span className="add-listing-subtitle">Sanuzellar soni</span>
                  <div className="add-listing-picker">
                    {COUNT_OPTIONS.map((option) => {
                      const on = form.bathroomCount === option
                      return (
                        <button
                          key={option}
                          type="button"
                          className={`add-listing-pick add-listing-pick--circle${on ? ' is-on' : ''}`}
                          aria-pressed={on}
                          onClick={() => update('bathroomCount', option)}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : null}
          </section>

          {showBuildingCard ? (
            <section className="add-listing-card">
              <h2>Uy haqida ma’lumot</h2>

              <div className="profile-form">
                <label>
                  Qurilgan yili
                  <input
                    inputMode="numeric"
                    value={form.yearBuilt}
                    onChange={(event) => update('yearBuilt', event.target.value.replace(/[^\d]/g, ''))}
                  />
                </label>
              </div>

              {showLifts ? (
                <>
                  <div>
                    <span className="add-listing-subtitle">Yo‘lovchi lifti</span>
                    <div className="add-listing-picker">
                      {COUNT_OPTIONS.map((option) => {
                        const on = form.passengerLift === option
                        return (
                          <button
                            key={option}
                            type="button"
                            className={`add-listing-pick add-listing-pick--circle${on ? ' is-on' : ''}`}
                            aria-pressed={on}
                            onClick={() => update('passengerLift', option)}
                          >
                            {option}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <span className="add-listing-subtitle">Yuk lifti</span>
                    <div className="add-listing-picker">
                      {COUNT_OPTIONS.map((option) => {
                        const on = form.freightLift === option
                        return (
                          <button
                            key={option}
                            type="button"
                            className={`add-listing-pick add-listing-pick--circle${on ? ' is-on' : ''}`}
                            aria-pressed={on}
                            onClick={() => update('freightLift', option)}
                          >
                            {option}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </>
              ) : null}

              <div>
                <span className="add-listing-subtitle">Gaz</span>
                <div className="add-listing-picker">
                  {YES_NO.map((option) => {
                    const on = form.gas === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`add-listing-pick${on ? ' is-on' : ''}`}
                        aria-pressed={on}
                        onClick={() => update('gas', option.id)}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>
          ) : null}

          <section className="add-listing-card">
            <h2>Tavsifi</h2>
            <div className="add-listing-textarea-wrap">
              <textarea
                rows={5}
                maxLength={2000}
                value={form.description}
                onChange={(event) => update('description', event.target.value)}
                placeholder="Planirovka, remont, qo‘shnilar va tuman infratuzilmasi haqida ma’lumot bering"
              />
              <span className="add-listing-counter">{form.description.length}/2000</span>
            </div>
          </section>

          <section className="add-listing-card">
            <h2>Narxi va xarid shartlari</h2>

            <span className="add-listing-subtitle">
              Narxi <span className="add-listing-req">*</span>
            </span>
            <div className="add-listing-segmented add-listing-segmented--currency">
              {CURRENCIES.map((item) => {
                const on = form.currency === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={on ? 'is-on' : undefined}
                    aria-pressed={on}
                    onClick={() => update('currency', item.id)}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
            <input
              className="add-listing-price-input"
              inputMode="numeric"
              value={form.price}
              onChange={(event) => update('price', event.target.value.replace(/[^\d]/g, ''))}
              placeholder={form.currency === 'uzs' ? '150 000 000' : '12 000'}
            />

            <div>
              <span className="add-listing-subtitle">Savdolashish imkoniyati</span>
              <div className="add-listing-picker">
                {YES_NO.map((option) => {
                  const on = form.negotiable === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`add-listing-pick${on ? ' is-on' : ''}`}
                      aria-pressed={on}
                      onClick={() => update('negotiable', option.id)}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <span className="add-listing-subtitle">Ipoteka</span>
              <div className="add-listing-picker">
                {YES_NO.map((option) => {
                  const on = form.mortgage === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={`add-listing-pick${on ? ' is-on' : ''}`}
                      aria-pressed={on}
                      onClick={() => update('mortgage', option.id)}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="add-listing-card">
            <h2>
              Fotosuratlar <span className="add-listing-req">*</span>
            </h2>
            <p>Kamida 3 ta rasm yuklang. Rasmni asosiy sifatida belgilash uchun uni ro‘yxat boshiga suring.</p>
            {photos.length ? (
              <div className="add-listing-photos">
                {photos.map((photo) => (
                  <div key={photo.id} className="add-listing-photo">
                    <img src={photo.src} alt="" />
                    <button type="button" aria-label="Rasmni o‘chirish" onClick={() => removePhoto(photo.id)}>
                      <X size={13} strokeWidth={2.4} />
                    </button>
                  </div>
                ))}
                {photos.length < 8 ? (
                  <label className="add-listing-photo-add">
                    <ImagePlus size={20} strokeWidth={1.9} />
                    <span>Rasm qo‘shish</span>
                    <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={addPhotos} />
                  </label>
                ) : null}
              </div>
            ) : (
              <label className="add-listing-upload-btn">
                <ImagePlus size={16} strokeWidth={2.1} />
                Yuklash
                <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={addPhotos} />
              </label>
            )}
          </section>

          <section className="add-listing-card">
            <h2>Videosharh</h2>
            <p>Xaridorlar e’tiborini jalb qilish uchun video qo‘shing</p>
            {video ? (
              <div className="add-listing-video-preview">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video src={video.src} controls />
                <button type="button" aria-label="Videoni o‘chirish" onClick={removeVideo}>
                  <X size={13} strokeWidth={2.4} />
                </button>
              </div>
            ) : (
              <>
                <div className="add-listing-video-drop">
                  <Video size={24} strokeWidth={1.7} />
                </div>
                <p className="add-listing-video-note">
                  Videoning maksimal hajmi 1 GB, mp4, webm, quicktime formatlari
                </p>
                <label className="add-listing-upload-btn">
                  <Video size={16} strokeWidth={2.1} />
                  Qo‘shish
                  <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={addVideo} />
                </label>
              </>
            )}
          </section>

          <section className="add-listing-card add-listing-boost">
            <div className="add-listing-boost-row">
              <h2>
                Ko‘rishlar sonini <span className="add-listing-accent">bepul</span> oshirish
              </h2>
              <button
                type="button"
                className={`switch${form.boostViews ? ' is-on' : ''}`}
                role="switch"
                aria-checked={form.boostViews}
                aria-label="Ko‘rishlar sonini bepul oshirish"
                onClick={() => update('boostViews', !form.boostViews)}
              >
                <span className="switch-knob" />
              </button>
            </div>
            <p>
              Mulkka bo‘lgan huquqni tasdiqlang. Buning uchun kadastr raqami yoki MyGov’dan olingan ko‘chirma
              kifoya
            </p>
          </section>

          <section className="add-listing-card">
            <h2>Sotuvchi ma’lumotlari</h2>

            <div className="add-listing-radio-row">
              <label className="add-listing-radio">
                <input
                  type="radio"
                  name="sellerType"
                  checked={form.sellerType === 'owner'}
                  onChange={() => update('sellerType', 'owner')}
                />
                <span className="add-listing-radio-dot" />
                Mulk egasi
              </label>
              <label className="add-listing-radio">
                <input
                  type="radio"
                  name="sellerType"
                  checked={form.sellerType === 'realtor'}
                  onChange={() => update('sellerType', 'realtor')}
                />
                <span className="add-listing-radio-dot" />
                Rieltor
              </label>
            </div>

            <div className="profile-form">
              <label>
                <span className="add-listing-label-row">
                  Ism <span className="add-listing-req">*</span>
                </span>
                <input
                  value={form.sellerName}
                  onChange={(event) => update('sellerName', event.target.value)}
                  placeholder="Ismingiz"
                />
              </label>

              <label>
                <span className="add-listing-label-row">
                  Telefon raqami <span className="add-listing-req">*</span>
                </span>
                <div className="add-listing-phone">
                  <span>+998</span>
                  <input
                    value={form.sellerPhone}
                    onChange={(event) => update('sellerPhone', event.target.value)}
                    placeholder="00-000-00-00"
                  />
                </div>
              </label>
            </div>

            <p className="add-listing-disclaimer">
              E’lonlarni joylashtirish orqali, siz joylashtirish qoidalarini qabul qilasiz, shuningdek
              foydalanuvchi shartnomasining shartlariga rozi bo‘lasiz
            </p>

            {error ? <p className="settings-error">{error}</p> : null}

            <button type="submit" className="profile-btn is-primary add-listing-submit-btn">
              E’lonni joylashtirish
            </button>
            <button type="button" className="add-listing-draft-btn">
              Qoralamani saqlash
            </button>
          </section>
        </form>
      </main>
    </Layout>
  )
}
