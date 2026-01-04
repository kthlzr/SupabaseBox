import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimit = new Map<string, { count: number; lastReset: number }>()

export async function rateLimitMiddleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 10

  const current = rateLimit.get(ip) ?? { count: 0, lastReset: now }

  if (now - current.lastReset > windowMs) {
    current.count = 1
    current.lastReset = now
  } else {
    current.count++
  }

  rateLimit.set(ip, current)

  if (current.count > maxRequests) {
    return new NextResponse('Too many requests', { status: 429 })
  }

  return null
}
