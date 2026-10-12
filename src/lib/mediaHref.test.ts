import { afterEach, describe, expect, it, vi } from 'vitest'
import { publicMediaHref } from './site'

afterEach(() => vi.unstubAllEnvs())

describe('Payload image URLs', () => {
  it('normalizes same-origin files without allowing other loopback origins', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'http://localhost:3000')
    expect(publicMediaHref('http://localhost:3000/api/media/file/image.png'))
      .toBe('/api/media/file/image.png')
    expect(publicMediaHref('http://127.0.0.1:4569/private.png'))
      .toBe('http://127.0.0.1:4569/private.png')
  })
  it('preserves approved external URLs and rejects unsafe protocols', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://cms.example.test')
    expect(publicMediaHref('https://media.example.test/cover.png'))
      .toBe('https://media.example.test/cover.png')
    expect(publicMediaHref('javascript:alert(1)')).toBeUndefined()
    expect(publicMediaHref('/api/media/file/cover.png')).toBe('/api/media/file/cover.png')
  })
})
