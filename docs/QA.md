# Qualidade antes e depois da entrega

Uma release só está concluída quando código, CMS, dados e URL canônica foram verificados. Build local verde, isoladamente, não comprova produção.

## 1. Verificação automatizada local

Com as variáveis operacionais do projeto:

```powershell
corepack enable
pnpm install --frozen-lockfile
pnpm clean
pnpm migrate:status
pnpm check
pnpm build
git diff --check
```

Critérios: todos os comandos terminam com código zero, sem migration pendente e sem whitespace inválido.

Confira ainda:

- `pnpm audit --prod` sem vulnerabilidade conhecida relevante;
- lockfile não mudou depois do `--frozen-lockfile`;
- `git status --short` contém apenas arquivos da entrega;
- `.env`, `.env.local`, `.vercel` e credenciais não estão staged;
- migrations geradas foram lidas por uma pessoa/agente além do gerador.

## 2. Site local no navegador

Inicie `pnpm devsafe` e teste ao menos em 390 × 844 e 1440 × 900:

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

Não aceite rolagem horizontal, texto cortado, controle menor que a área de toque prevista pelo design ou conteúdo invisível sem JavaScript.

## 3. Matriz do CMS

Use três contas de teste sem compartilhar senha:

| Cenário | Resultado esperado |
| --- | --- |
| anônimo consulta API/conteúdo | vê somente publicado e campos públicos |
| anônimo consulta reunião reservada | não recebe o documento |
| Editor salva rascunho | permitido |
| Editor tenta publicar/despublicar/excluir | bloqueado no servidor |
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

## 5. Produção na URL canônica

Depois que a Vercel marcar **Ready**:

1. repita o smoke das rotas públicas em janela anônima;
2. confirme commit e deployment efetivamente servidos;
3. consulte logs de build e função;
4. autentique no `/admin`, salve um rascunho temporário e remova-o de forma controlada;
5. faça upload e leitura de uma mídia de teste no R2;
6. solicite recuperação de senha e confirme recebimento real, links e remetente;
7. não publique conteúdo de teste; use apenas conteúdo institucional verdadeiro;
8. teste links `tel:`, documentos, mapa e serviços externos;
9. confirme domínio, certificado, redirects e ausência de URL Render no HTML, sitemap, canonical ou documentação;
10. registre o resultado.

## Evidência de entrega

O registro final deve conter, sem segredos:

- SHA do commit e branch `main`;
- ID/URL do deployment Vercel e domínio canônico testado;
- resultado e horário de `pnpm check` e `pnpm build`;
- migration aplicada e resultado de `migrate:status`;
- horário/ponto de recuperação Neon pré-entrega, quando aplicável;
- páginas e larguras testadas;
- resultado de login, papéis, R2 e SMTP;
- erros conhecidos e decisão explícita sobre qualquer pendência.

Não use “tudo certo” como evidência. Liste o que foi realmente executado e diferencie local, GitHub, Vercel, Neon, R2 e e-mail.
