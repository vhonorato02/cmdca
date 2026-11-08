import type { Field } from 'payload'

import { isLoggedInFieldLevel } from '../access'
import type { PublicationRule } from '../hooks/editorialPolicy'

/**
 * Travas de publicação ligadas ao ECA (arts. 17, 18, 143 e 247) e à LGPD (art. 14).
 * Ver docs/juridico/POLITICA-EDITORIAL.md.
 *
 * - Mídia que mostra criança ou adolescente vítima, em acolhimento, em situação de risco
 *   ou a quem se atribua ato infracional nunca é publicada, nem com autorização: o
 *   consentimento dos responsáveis não afasta a proibição de identificar essas pessoas.
 * - Notícias só vão ao ar com a declaração de quem publica de que texto e imagens não
 *   identificam essas crianças e adolescentes. A declaração é humana: só é exigida
 *   quando há uma pessoa autenticada publicando; scripts de sistema não atestam nada
 *   (o pacote editorial é revisado no próprio repositório).
 */

export const SITUACAO_PROTEGIDA_ROTULO =
  'Mostra criança ou adolescente vítima, em acolhimento, em situação de risco ou a quem se atribua ato infracional'

export const situacaoProtegidaField = (): Field => ({
  name: 'situacaoProtegida',
  label: SITUACAO_PROTEGIDA_ROTULO,
  type: 'checkbox',
  defaultValue: false,
  access: { read: isLoggedInFieldLevel },
  admin: {
    description:
      'Se marcado, o arquivo não pode ser publicado, mesmo com autorização dos responsáveis (ECA, arts. 17, 18, 143 e 247). Guarde-o fora do portal.',
  },
})

export const situacaoProtegidaRule: PublicationRule = {
  path: 'situacaoProtegida',
  label:
    'arquivo marcado como situação protegida pelo ECA (vítima, acolhimento, risco ou ato infracional) não pode ser publicado',
  optional: true,
  validate: (value) => value !== true,
}

export const DECLARACAO_ECA_ROTULO =
  'Conferi que o texto e as imagens não identificam criança ou adolescente vítima, em acolhimento, em situação de risco ou a quem se atribua ato infracional'

export const declaracaoProtecaoField = (): Field => ({
  name: 'declaracaoProtecao',
  label: DECLARACAO_ECA_ROTULO,
  type: 'checkbox',
  defaultValue: false,
  access: { read: isLoggedInFieldLevel },
  admin: {
    position: 'sidebar',
    description:
      'Obrigatória para publicar. Nome, apelido, escola, endereço, parentesco, foto, voz ou detalhe que permita reconhecer a pessoa contam como identificação (ECA, arts. 17, 18, 143 e 247).',
  },
})

export const declaracaoProtecaoRule: PublicationRule = {
  path: 'declaracaoProtecao',
  label: 'declaração de proteção de crianças e adolescentes (ECA) marcada por quem publica',
  optional: true,
  // Scripts de sistema (sem usuário, ou com `context.operation`, como o pacote editorial
  // versionado no repositório) não atestam nada em nome de ninguém.
  validate: (value, _document, req) =>
    !req.user || Boolean((req.context as { operation?: unknown } | undefined)?.operation) || value === true,
}
