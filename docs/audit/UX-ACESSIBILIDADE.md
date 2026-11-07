> Fotografia de 04/11/2026. Estado atual: [RELATORIO-FINAL.md](RELATORIO-FINAL.md) e [RISCOS.md](RISCOS.md).

# UX e acessibilidade: evidência e cobertura

## Leitura de páginas públicas em 04/11/2026
- `/` retornou 200, com CTA de proteção e acesso a `/ajuda`, `tel:190`, `tel:100` e Conselho Tutelar.
- `/ajuda` retornou 200 e expõe orientação para perigo imediato, denúncia, Conselho Tutelar e lista de serviços com links de telefone/rota. A fonte dos contatos locais não foi revalidada nesta rodada.
- O CMS `/admin/login` respondeu 200 e está marcado `noindex`.

Foi solicitada captura remota de home desktop e ajuda mobile, mas **não houve abertura/inspeção humana local dos arquivos capturados**. Logo, não há resultado válido de auditoria visual tela a tela, nem teste de fluxo completo, TalkBack ou axe nesta rodada. Relatórios de outubro em `docs/QA.md` são históricos.

## Matriz de aceitação para próxima rodada
- Telas: 320/360/390/430/768/1024/1280/1440/1920 px, 200/400% zoom; mobile e desktop, panorama/retrato.
- Menu, faixa fixa de proteção, links telefônicos, formulários, documentos, tabelas, mapa/lista, foco/teclado/escape, sem JS, slow 3G, alto contraste, preferência por movimento reduzido.
- WCAG 2.2 AA e eMAG: axe automático **mais** leitura com TalkBack/NVDA, descrições e feedback de validação; PDF precisa de auditoria própria.
- Proteger pessoas em urgência: números verificados, ação em destaque, saída rápida com limites de privacidade explicados.

**Conclusão:** há superfícies públicas operantes por HTTP, mas usabilidade e acessibilidade **não podem ser aprovadas** apenas por HTML ou registros antigos.
