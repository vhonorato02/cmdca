# Qualidade antes e depois da entrega

Uma release só está concluída quando código, CMS, dados e URL canônica foram verificados. Build aprovado no GitHub Actions, isoladamente, não comprova produção.

## 1. Verificação automatizada local

Com as variáveis operacionais do projeto:

```powershell
corepack enable
pnpm install --frozen-lockfile
pnpm check
git diff --check
```

Critérios locais: todos os comandos terminam com código zero e sem whitespace inválido. Build, migrações e testes com gravação em banco são executados pelo GitHub Actions. Fixtures usam somente o PostgreSQL efêmero do runner.

Confira ainda:

- `pnpm audit --prod` sem vulnerabilidade conhecida relevante;
- lockfile não mudou depois do `--frozen-lockfile`;
- `git status --short` contém apenas arquivos da entrega;
- `.env`, `.env.local`, `.vercel` e credenciais não estão staged;
- migrations geradas foram lidas por uma pessoa/agente além do gerador.

## 2. Site local no navegador

Inicie `pnpm dev` e confira todas as páginas relevantes nas larguras 1440, 1024, 768 e 390 pixels:

- home e todas as rotas do cabeçalho/rodapé;
- notícias (lista, detalhe e conteúdo ausente);
- conselho, FMDCA, reuniões, resoluções, editais, entidades e transparência;
- ajuda, mapa/lista da rede, privacidade, acessibilidade e mapa do site;
- página 404 e tela de erro controlado;
- menu móvel abre, prende foco de forma coerente e fecha por botão/Escape;
- zoom a 200%, texto ampliado, alto contraste e preferência de movimento reduzido;
- navegação completa por teclado, skip-link e foco sempre visível;
- carrossel/accordion/visualizações operáveis sem gesto preciso;
- gráficos possuem alternativa textual ou tabular;
- nenhum erro/hidratação no console.

Não aceite rolagem horizontal, texto cortado, controle com área de toque menor que 44 por 44 pixels ou conteúdo invisível sem JavaScript. Confira proporção e recortes de imagens, sobreposições, espaçamento, contraste, alt, headings, links, título, descrição e Open Graph em cada largura.

## 3. Matriz do CMS

Use três contas de teste sem compartilhar senha:

| Cenário | Resultado esperado |
| --- | --- |
| anônimo consulta API/conteúdo | vê somente publicado e campos públicos |
| anônimo consulta reunião reservada | não recebe o documento |
| Editor salva rascunho | permitido |
| Editor publica/despublica | permitido após validações |
| Editor tenta excluir | bloqueado no servidor |
| Jurídico aprova e publica | permitido após validações |
| Jurídico tenta gerenciar usuários/excluir | bloqueado |
| Administrador gerencia usuário | permitido |
| Administrador tenta excluir a própria conta/último admin | bloqueado |
| publicação com placeholder/fonte ausente | bloqueada |
| capa em PDF ou ato sem PDF obrigatório | bloqueado |
| upload com dado interno de consentimento | dado não aparece na API pública |
| restaurar versão | histórico preservado e publicação consciente |

Também verifique autosave sem duplicação, slugs, links externos HTTPS, datas, horário de reunião, reunião híbrida e retificação de ato.

## 4. SEO, privacidade e HTTP

- cada página tem um único `h1`, título e descrição próprios;
- canonical, Open Graph, JSON-LD, `sitemap.xml` e `robots.txt` usam a origem correta;
- `/admin`, `/api` e GraphQL desabilitado/não indexável não aparecem no sitemap;
- dados estruturados aceitam texto do CMS sem encerrar a tag `<script>`;
- imagens têm dimensões, texto alternativo e carregamento coerente;
- não há placeholder, depoimento inventado, indicador sem fonte ou dado bancário não confirmado;
- política de privacidade descreve Vercel, Neon, R2, OpenStreetMap/Leaflet, VLibras, fontes e armazenamento local realmente usados;
- headers de segurança não quebram painel, mapas, uploads, fontes ou VLibras;
- páginas públicas importantes respondem sem redirect em cadeia e o HTTPS é válido.

Para Core Web Vitals, use dados de campo quando houver tráfego. Em laboratório, investigue qualquer regressão relevante de LCP, INP ou CLS; não maquie a métrica removendo conteúdo necessário.

## 5. Produção (VPS)

Automático a cada deploy (GitHub Actions, sem usar este computador):

1. `Producao (VPS)`: smoke de `/api/health`, rotas públicas e aquecimento do sitemap;
2. `E2E (producao)`: Playwright de leitura + axe em desktop e celular (`E2E_TARGET=production`
   pula o que depende das fixtures do CI e nenhuma credencial é usada);
3. `Lighthouse (producao)`: mobile, mediana de 3 rodadas, mínimo 95 (SEO só é cobrado sem `noindex`);
4. `Disponibilidade`: `/api/health` e home a cada 15 minutos, com alerta no ntfy.

Manual, a cada entrega relevante:

1. teclado: Tab pela home em 1280 e 390 px (ordem lógica, skip link primeiro, foco visível);
2. `/admin`: entrar, salvar um rascunho, pré-visualizar e apagar o rascunho;
3. cabeçalhos: Mozilla Observatory (`observatory-api.mdn.mozilla.net`);
4. backup: `site backup && site teste-restauracao` na VPS;
5. domínio: certificado válido, 301 dos hosts secundários e `robots.txt` sem `Disallow: /`.

## Evidência de entrega

Registre o que foi executado, sem segredos, diferenciando local, GitHub e VPS.
Capturas não equivalem a inspeção visual.

### 26/10/2026 (domínio temporário)

- Lighthouse mobile (run 40414355829, e8a5c14), 8 páginas: Perf 98–99, A11y 100,
  Boas práticas 100; SEO 69 por causa do `noindex` temporário.
- E2E produção (run 40415972555): 7 falhas. Os testes agiam antes da hidratação e havia um estouro
  de 8 px em 320 px no número do Conselho Tutelar enquanto a fonte carrega. Corrigido em c8962a4 e f0aea89;
  nova rodada (run 40418735331): 110 aprovados, 0 falhas, 18 pulados (fixtures/credenciais do CI).
- Teclado (script Playwright contra a produção): 30 paradas em 1280 px e em 390 px. O skip link vem primeiro,
  depois os canais de proteção, as ferramentas de acessibilidade, a marca, o menu e o conteúdo. Todas
  as paradas têm foco visível; nos cards, o contorno fica no card inteiro (`:has(a:focus-visible)`).
- Observatory: B+ (80), 11/12 testes (falta só o `'unsafe-inline'`, ADR 0008).
- Backup: `OK snapshot=ddc7712e bancos=[cmdca:52] midia=ok` (teste diário de restauração).
- Monitor externo: run 40417845545, `/api/health → 200`, `/ → 200`.
