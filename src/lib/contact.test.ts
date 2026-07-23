import { describe, expect, it } from 'vitest'

import { phoneHref } from './contact'

describe('phoneHref', () => {
  it('normaliza um telefone simples para o URI tel', () => {
    expect(phoneHref('(12) 3550-0513')).toBe('tel:1235500513')
  })

  it('mantém o prefixo internacional quando informado', () => {
    expect(phoneHref('+55 (12) 3550-0513')).toBe('tel:+551235500513')
  })

  it.each([
    ['(12) 3550-3609 (ramais 9198/9199)', 'tel:1235503609'],
    ['(12) 3642-6403 (ramais 7090/7091)', 'tel:1236426403'],
    ['(12) 3637-5386 (ramais 9132/9133)', 'tel:1236375386'],
    ['(12) 3645-6949 (ramais 8964/8965)', 'tel:1236456949'],
    ['(12) 3642-1302 (ramais 8804/8805)', 'tel:1236421302'],
    ['(12) 3645-3672 (ramal 8850)', 'tel:1236453672'],
    ['(12) 3643-4209 (ramais 9026/9027)', 'tel:1236434209'],
  ])('não concatena o ramal de %s ao número discado', (phone, expected) => {
    expect(phoneHref(phone)).toBe(expected)
  })

  it('não cria URI para texto sem telefone', () => {
    expect(phoneHref('ramal 1234')).toBeUndefined()
    expect(phoneHref('')).toBeUndefined()
  })
})
