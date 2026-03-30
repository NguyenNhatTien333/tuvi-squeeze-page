import { cn, extractUTMSource } from '@/lib/utils'

describe('cn()', () => {
  it('returns a single class unchanged', () => {
    expect(cn('text-red-500')).toBe('text-red-500')
  })

  it('merges multiple classes', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('deduplicates conflicting Tailwind classes (last wins)', () => {
    expect(cn('px-4', 'px-8')).toBe('px-8')
  })

  it('ignores falsy values', () => {
    expect(cn('text-sm', false, undefined, null, 'font-bold')).toBe('text-sm font-bold')
  })

  it('handles conditional classes', () => {
    const isActive = true
    expect(cn('base', isActive && 'active')).toBe('base active')
    expect(cn('base', !isActive && 'active')).toBe('base')
  })

  it('merges conflicting text color classes (last wins)', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('returns empty string for no arguments', () => {
    expect(cn()).toBe('')
  })
})

describe('extractUTMSource()', () => {
  it('extracts utm_source from a URL', () => {
    expect(extractUTMSource('http://localhost:3000/?utm_source=facebook')).toBe('facebook')
  })

  it('returns "direct" when utm_source is absent', () => {
    expect(extractUTMSource('http://localhost:3000/')).toBe('direct')
  })

  it('returns "direct" for an empty string URL', () => {
    expect(extractUTMSource('')).toBe('direct')
  })

  it('returns "direct" for a malformed URL', () => {
    expect(extractUTMSource('not a url')).toBe('direct')
  })

  it('handles utm_source with a complex value', () => {
    expect(
      extractUTMSource('https://example.com/page?utm_source=google_ads&utm_medium=cpc')
    ).toBe('google_ads')
  })

  it('returns "direct" when utm_source param is empty', () => {
    expect(extractUTMSource('https://example.com/?utm_source=')).toBe('direct')
  })
})
