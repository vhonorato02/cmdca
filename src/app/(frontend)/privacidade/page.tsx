import type { Metadata } from 'next'
import Link from 'next/link'

import { Hero } from '@/components/Hero'
import { Reveal } from '@/components/Reveal'
import { getPayloadClient } from '@/lib/payload'
import { createMetadata } from '@/lib/seo'
import { publicText } from '@/lib/site'

export const revalidate = 600

export const metadata: Metadata = createMetadata({
  title: 'Aviso de Privacidade | CMDCA de Pindamonhangaba',
  description:
    'Saiba quais dados o site trata, para quais finalidades, com quem compartilha e como exercer seus direitos previstos na LGPD.',
  path: '/privacidade',
})

const LGPD_URL = 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm'
const MUNICIPIO_LGPD_URL =
  'https://pindamonhangaba.sp.gov.br/lei-geral-de-protecao-de-dados-lei-federal-n-137092018'
const ANPD_CRIANCAS_URL =
  'https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes'

export default async function PrivacidadePage() {
  const payload = await getPayloadClient()
  const config = await payload.findGlobal({ slug: 'configuracoes' }).catch(() => null)
  const email = publicText(config?.contato?.email)

  return (
    <>
      <Hero
        deep
        eyebrow="Seus dados"
        titulo="Aviso de privacidade e proteção de dados"
        texto="Este aviso explica, em linguagem direta, como dados pessoais podem ser tratados no site público e na área administrativa do CMDCA."
      />
      <section className="band">
        <div className="wrap">
          <Reveal>
            <div className="post-body" style={{ margin: 0 }}>
              <p>
                <b>Última atualização:</b> 19 de julho de 2026.
              </p>

              <h3>Quem é responsável pelo tratamento</h3>
              <p>
                O tratamento relacionado a este serviço institucional é realizado no âmbito do
                Município de Pindamonhangaba, por meio do CMDCA. A identidade e o canal atualizado
                do encarregado municipal estão publicados na{' '}
                <a href={MUNICIPIO_LGPD_URL} target="_blank" rel="noopener noreferrer">
                  página oficial de proteção de dados da Prefeitura
                </a>
                .
              </p>

              <h3>Quais dados podem ser tratados</h3>
              <p>
                A navegação pública não exige cadastro. A infraestrutura de hospedagem e segurança
                pode registrar endereço IP, data e hora, página solicitada, navegador, dispositivo,
                resposta do servidor e eventos necessários à prevenção de abuso e à investigação de
                falhas.
              </p>
              <p>
                Ao enviar uma mensagem por e-mail, são tratados os dados que você fornecer, como
                nome, endereço eletrônico, conteúdo da solicitação e anexos. Não envie por e-mail
                detalhes desnecessários sobre crianças, adolescentes, saúde, violência ou outros
                dados sensíveis; para denúncias e emergências, use os canais da página{' '}
                <Link href="/ajuda">Preciso de ajuda</Link>.
              </p>
              <p>
                Usuários autorizados da área administrativa têm dados de identificação, contato,
                credenciais, sessões e registros de atividade tratados para autenticação, segurança,
                revisão e publicação de conteúdo.
              </p>

              <h3>Finalidades e bases legais</h3>
              <p>
                Os dados são usados para entregar e proteger o serviço, responder solicitações,
                administrar conteúdo oficial, cumprir deveres legais e regulatórios, executar
                políticas públicas, manter registros administrativos e exercer direitos em
                processos. Conforme o caso, aplicam-se as bases previstas na{' '}
                <a href={LGPD_URL} target="_blank" rel="noopener noreferrer">
                  Lei Geral de Proteção de Dados
                </a>
                , inclusive obrigação legal, execução de política pública, exercício regular de
                direitos e consentimento quando ele for juridicamente necessário.
              </p>

              <h3>Cookies e armazenamento no dispositivo</h3>
              <p>
                O código público atual não inclui publicidade comportamental nem ferramenta própria
                de analytics. As preferências de contraste e tamanho de fonte são guardadas no
                armazenamento local do navegador. A área administrativa utiliza recursos técnicos de
                autenticação e sessão. Serviços externos incorporados podem utilizar armazenamento
                técnico conforme suas próprias políticas.
              </p>

              <h3>Fornecedores e compartilhamento</h3>
              <p>
                Para operar o serviço, dados técnicos podem ser processados por fornecedores de
                hospedagem e entrega da aplicação (Vercel), banco de dados (Neon), armazenamento de
                mídia (Cloudflare R2) e envio de e-mail, quando configurado. VLibras e mapas do
                OpenStreetMap também podem receber dados técnicos necessários quando seus recursos
                são carregados. As fontes tipográficas são entregues pelo próprio site, sem chamada
                do navegador ao Google Fonts. Alguns fornecedores podem processar dados fora do
                Brasil, sujeitos às salvaguardas contratuais e legais aplicáveis.
              </p>
              <p>
                Dados também podem ser compartilhados com órgãos públicos ou autoridades quando
                houver competência, obrigação legal, ordem válida ou necessidade de proteger
                direitos. O Município não comercializa dados pessoais tratados por este site.
              </p>

              <h3>Retenção e segurança</h3>
              <p>
                Os dados são mantidos pelo tempo necessário à finalidade, aos prazos legais, às
                regras de arquivo público e à defesa de direitos. Registros técnicos são conservados
                pelo período necessário à segurança e à operação. São adotadas medidas de controle
                de acesso, autenticação, cópias de segurança e monitoramento compatíveis com o
                risco, sem promessa de segurança absoluta. Incidentes relevantes serão tratados e
                comunicados conforme a LGPD e as orientações da ANPD.
              </p>

              <h3>Crianças e adolescentes</h3>
              <p>
                Qualquer tratamento envolvendo crianças e adolescentes deve respeitar seu melhor
                interesse, a necessidade, a minimização e a proteção de imagem, identidade e
                dignidade. Consentimento não é a única base jurídica possível, mas seu uso e as
                demais bases devem sempre ser avaliados à luz do art. 14 da LGPD e do caso concreto.
                Consulte o{' '}
                <a href={ANPD_CRIANCAS_URL} target="_blank" rel="noopener noreferrer">
                  entendimento oficial da ANPD
                </a>
                . A publicação de imagens ou relatos exige avaliação prévia de finalidade,
                exposição, riscos e autorizações aplicáveis.
              </p>

              <h3>Direitos do titular</h3>
              <p>
                Nos limites da legislação e das regras próprias do poder público, você pode
                solicitar confirmação do tratamento, acesso, correção, informação sobre
                compartilhamentos, anonimização, bloqueio ou eliminação quando cabíveis, além de
                revisão e demais direitos previstos na LGPD. Algumas informações precisam ser
                preservadas por obrigação legal ou interesse público mesmo após uma solicitação de
                exclusão.
              </p>

              <h3>Como falar sobre privacidade</h3>
              <p>
                Consulte o canal do encarregado na{' '}
                <a href={MUNICIPIO_LGPD_URL} target="_blank" rel="noopener noreferrer">
                  página de LGPD do Município
                </a>
                {email ? (
                  <>
                    {' '}
                    ou escreva para <a href={`mailto:${email}`}>{email}</a>, indicando no assunto
                    “Privacidade e proteção de dados”
                  </>
                ) : null}
                . Para facilitar a resposta, descreva sua solicitação sem incluir dados pessoais
                além do necessário.
              </p>

              <h3>Atualizações deste aviso</h3>
              <p>
                O aviso pode ser atualizado para refletir mudanças legais, técnicas ou operacionais.
                A versão vigente e sua data ficam sempre publicadas nesta página.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
