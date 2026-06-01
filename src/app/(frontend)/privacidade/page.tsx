import type { Metadata } from 'next'

import { Hero } from '@/components/Hero'
import { Reveal } from '@/components/Reveal'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Privacidade (LGPD)',
  description:
    'Política de privacidade do site do CMDCA de Pindamonhangaba, conforme a LGPD e a proteção à infância no ambiente digital.',
}

export default async function PrivacidadePage() {
  const payload = await getPayloadClient()
  const config = await payload.findGlobal({ slug: 'configuracoes' }).catch(() => null)
  const email = config?.contato?.email || 'cmdca@pindamonhangaba.sp.gov.br'

  return (
    <>
      <Hero
        deep
        eyebrow="Seus dados"
        titulo="Privacidade e proteção de dados"
        texto="Tratamos dados pessoais com cautela, em conformidade com a LGPD (Lei 13.709/2018) e com a proteção à infância no ambiente digital."
      />
      <section className="band">
        <div className="wrap">
          <Reveal>
            <div className="post-body" style={{ margin: 0 }}>
              <h3>Que dados coletamos</h3>
              <p>
                Este site é majoritariamente informativo e de leitura, não exige cadastro do cidadão e
                não coleta dados pessoais para fins de marketing. Eventuais contatos enviados por
                e-mail são usados apenas para responder à sua solicitação.
              </p>
              <h3>Cookies</h3>
              <p>
                Não utilizamos cookies de rastreamento ou publicidade. As suas preferências de
                acessibilidade (tamanho de fonte e alto contraste) ficam salvas apenas no seu
                navegador, no seu dispositivo.
              </p>
              <h3>Imagens de crianças e adolescentes</h3>
              <p>
                Por padrão, não publicamos imagem de criança ou adolescente identificável. Quando há
                registro de atividades, priorizamos ilustrações ou imagens que não permitam
                identificação individual. A publicação com identificação só ocorre mediante termo de
                consentimento dos responsáveis, em conformidade com a LGPD e com a Lei 15.211/2025.
              </p>
              <h3>Seus direitos e contato</h3>
              <p>
                Para exercer direitos previstos na LGPD ou tirar dúvidas sobre privacidade, escreva
                para <a href={`mailto:${email}`}>{email}</a>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
