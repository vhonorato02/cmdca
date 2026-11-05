# Plano de execução e promoção, sem risco de dados

## Lote 0: baseline e contenção
- Mapear `main`, status da execução `41955135317`, hash real em `X-Release-Commit` e alterações alheias.
- Manter Vercel legado **inalterado** até obter backup/export válido de Neon e R2, inventário de contas/URLs e autorização para pausar; após aprovação, preferir pausa reversível a deleção.
- Acesso a dados de crianças e documentos reservados só em ambiente isolado de teste.

## Lote 1: integridade/CI
- PostgreSQL 17 em CI (commit `f630bda`), verificar resultados e depurar caso falhe.
- Testar ACL de mídia e reuniões reservadas, login, uploads, drafts, preview, revogação e cache com fixtures sintéticas.
- Validar migrar banco vazio e snapshot restaurado sem realizar `seed` em produção.
- Resolver versão/tag/changelog/artefato; licença MIT e LICENCE só após confirmação dos direitos.

## Lote 2: informação e experiência
- Corrigir manuais operacionais anacrônicos, fluxo de três papéis e metadados do painel.
- Auditoria visual por tela com screenshots realmente revistas; axe e testes de teclado, toque e leitor de tela.
- Conferir números e orientações de ajuda, legislação e FMDCA com fontes oficiais; não publicar dado pendente automaticamente.

## Lote 3: PWA útil
- Avaliar `display: standalone` com navegação, back, safe areas e deep link em Android.
- Política de offline priorizando rede, sem cache de ajuda obsoleta nem APIs/CMS; nenhuma promessa offline antes da prova.
- Push só após opt-in e infraestrutura idempotente com destinatários sintéticos. Não solicitar permissão em carregamento.

## Lote 4: operação e stable
- Inspecionar VPS multi-tenant com acesso autorizado; medir recursos, backup off-site, restic, restore banco+mídia e impacto de Caddy/Docker.
- Executar `quality.yml`, E2E public/CMS, screenshots, axe/manual, Lighthouse, API security, smoke do SHA live.
- Só promover tag/release stable quando todos os gates de `docs/QA.md` e mandato estão evidenciados. Se não, manter **release bloqueada**.

Cada lote segue: falha reproduzida → teste regressivo → correção mínima → CI → smoke no SHA → commit/handoff. Nenhuma limpeza irreversível, mudança DNS, firewall, segredo, publicação legal, backup ou dado real via automação sem procedimento e autorização específicos.
