import { useEffect, useState } from 'react'

const TZ = 'Asia/Tashkent'

export function tashkentClock(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0)
  return { hour, minute, decimal: hour + minute / 60 }
}

export function skyPeriodFromHour(decimal) {
  if (decimal >= 5 && decimal < 8) return 'sunrise'
  if (decimal >= 8 && decimal < 17) return 'day'
  if (decimal >= 17 && decimal < 20) return 'sunset'
  return 'night'
}

function compute() {
  const clock = tashkentClock()
  const period = skyPeriodFromHour(clock.decimal)
  return {
    ...clock,
    period,
    stars: period === 'night' ? 1 : period === 'sunset' || period === 'sunrise' ? 0.25 : 0,
  }
}

export function useSkyPeriod() {
  const [sky, setSky] = useState(compute)

  useEffect(() => {
    const tick = () => setSky(compute())
    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [])

  return sky
}
