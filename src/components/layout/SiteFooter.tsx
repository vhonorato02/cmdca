import Image from 'next/image'
import { AppLink as Link } from '@/components/ui/AppLink'

import type { Canal, Instituicao } from '@/lib/content'
import { phoneHref } from '@/lib/contact'
import type { NavigationLink } from '@/lib/navigation'

const splitPhones = (value: string) => value.split(/\s*[·;/]\s*/).filter(Boolean)

function FooterLink({ item }: { item: NavigationLink }) {
  if (/^https:\/\//i.test(item.href)) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer">
        {item.label}
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
    )
  }
  return <Link href={item.href}>{item.label}</Link>
}

/** Rodapé institucional: identidade, contato, navegação e canais, tudo vindo do CMS. */
export function SiteFooter({
  instituicao,
  descricao,
  institucional,
  sobreSite,
  canais,
}: {
  instituicao: Instituicao
  descricao: string
  institucional: NavigationLink[]
  sobreSite: NavigationLink[]
  canais: Canal[]
}) {
  const year = new Date().getFullYear()
  const i = instituicao
  const endereco = [i.endereco, i.cep ? `CEP ${i.cep}` : undefined].filter(Boolean).join(', ')
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__top">
        <div>
          <span className="site-footer__plate">
            <Image
              src="/brand/logo-cmdca.jpg"
              alt="CMDCA: Conselho Municipal dos Direitos da Criança e do Adolescente de Pindamonhangaba"
              width={680}
              height={163}
              sizes="240px"
            />
          </span>
          <p className="site-footer__about">{descricao}</p>
          <dl className="site-footer__contact">
            {endereco ? (
              <div>
                <dt>Endereço</dt>
                <dd>{endereco}</dd>
              </div>
            ) : null}
            {i.telefone ? (
              <div>
                <dt>Telefone</dt>
                <dd>
                  {splitPhones(i.telefone).map((phone, index) => (
                    <span key={`${phone}-${index}`}>
                      {index ? ', ' : null}
                      {phoneHref(phone) ? <a href={phoneHref(phone)}>{phone}</a> : phone}
                    </span>
                  ))}
                </dd>
              </div>
            ) : null}
            {i.email ? (
              <div>
                <dt>E-mail</dt>
                <dd>
                  <a href={`mailto:${i.email}`}>{i.email}</a>
                </dd>
              </div>
            ) : null}
            {i.horario ? (
              <div>
                <dt>Atendimento</dt>
                <dd>{i.horario}</dd>
              </div>
            ) : null}
          </dl>
        </div>
        <nav aria-label="Institucional">
          <h2 className="site-footer__title">O conselho</h2>
          <ul className="site-footer__links">
            {institucional.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <FooterLink item={item} />
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Canais de proteção">
          <h2 className="site-footer__title">Proteção</h2>
          <ul className="site-footer__links">
            {canais.map((canal) => (
              <li key={`${canal.tipo}-${canal.numero}`}>
                {canal.rotulo}:{' '}
                <a className="site-footer__phone" href={canal.href}>
                  {canal.numero}
                </a>
              </li>
            ))}
            <li>
              <Link href="/ajuda">Buscar ajuda</Link>
            </li>
            <li>
              <Link href="/ajuda#conselhos-tutelares">Conselho Tutelar</Link>
            </li>
            <li>
              <Link href="/ajuda#rede">Rede de proteção</Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Sobre o site">
          <h2 className="site-footer__title">Sobre o site</h2>
          <ul className="site-footer__links">
            {sobreSite.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <FooterLink item={item} />
              </li>
            ))}
            {i.instagramUrl ? (
              <li>
                <a href={i.instagramUrl} target="_blank" rel="noopener noreferrer">
                  Instagram{i.instagramHandle ? ` ${i.instagramHandle}` : ''}
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>
      <div className="wrap">
        <div className="site-footer__bottom">
          <span>
            © {year} {i.nome}
          </span>
          {i.leiCMDCA ? <span>Criado pela {i.leiCMDCA}</span> : null}
        </div>
      </div>
    </footer>
  )
}
