# Lighthouse mobile em produção (26/10/2026)

Medido no site publicado (`https://cmdca.zewithane.vps.brz.dev.br`, commit `e48a7e6`)
pelo workflow `Lighthouse (producao)`, run
[40377222536](https://github.com/vhonorato02/cmdca/actions/runs/40377222536), em
hardware padrão do GitHub (benchmark de CPU ~3000). Lighthouse 12.8.2, perfil mobile
padrão (Moto G Power, 4G lento simulado, CPU 4x), 3 rodadas por página, mediana.

| Página | Perf | A11y | Boas práticas | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| home | 97 | 100 | 100 | 69* | 2,2 s | 67 ms | 0,000 |
| ajuda | 98 | 100 | 100 | 69* | 2,2 s | 35 ms | 0,000 |
| conselho | 98 | 100 | 100 | 69* | 2,2 s | 68 ms | 0,000 |
| fmdca | 98 | 100 | 100 | 69* | 2,2 s | 74 ms | 0,000 |
| noticias | 98 | 100 | 100 | 69* | 2,0 s | 79 ms | 0,002 |
| participe | 98 | 100 | 100 | 69* | 2,2 s | 67 ms | 0,000 |
| resolucoes | 98 | 100 | 100 | 69* | 2,0 s | 37 ms | 0,000 |
| reunioes | 98 | 100 | 100 | 69* | 2,0 s | 37 ms | 0,019 |

\* A única auditoria de SEO reprovada é `is-crawlable`: o domínio temporário envia
`noindex` de propósito (`SITE_INDEXABLE=false`). Com o build local em
`SITE_INDEXABLE=true`, o SEO deu 100 em todas as páginas. Medir de novo depois da
troca para `www.cmdcapinda.org`.

## Arquivos
`mobile-<página>.json.gz` é o relatório mediano de cada página. Para ver, descompacte
e abra no [Lighthouse Viewer](https://googlechrome.github.io/lighthouse/viewer/).

## Como medir de novo
O workflow roda depois de cada deploy, toda segunda-feira e sob demanda
(`gh workflow run lighthouse.yml`). Ele falha se alguma categoria ficar abaixo de 95
(SEO só é cobrado com `SITE_INDEXABLE=true`). Para resumir artefatos baixados:
`node scripts/lighthouse-summary.mjs <pasta> 95`.

Medições nesta máquina de desenvolvimento não valem: a CPU fica abaixo da faixa
calibrada da simulação e a nota de performance oscila até 20 pontos.
