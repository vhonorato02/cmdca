# Decisoes de CI e entrega

Atualizado em 2026-10-11.

| Local | Uso decidido | Evidencia e risco |
| --- | --- | --- |
| Windows | dev, lint, tipos, unitarios, navegador publico de leitura | Pacotes incompletos reparados pelo lock; banco local aponta ao operacional |
| GitHub Actions | Postgres descartavel, migracoes, CMS, Playwright, build e imagem | Repo publico; workflow existente tem gate, timeout e concorrencia |
| VPS | runtime somente | 1.9 GiB RAM, dois sites ativos, nenhum build/teste pesado |
| Coolify | nao usar sem nova descoberta | Nao instalado na VPS inspecionada |
| Vercel | nao promover | Destino solicitado e VPS; workflow legado desativado |

Nao foram consultadas cotas de runners especiais pagos. Usa-se ubuntu-latest
padrao, sem habilitar servico pago. Nao executar build de producao local.

O transporte S3 do CI e uma simulacao explicita em loopback. Persiste apenas
durante o job para provar upload, autorizacao, download e identidade dos bytes.
Nao comprova IAM, privacidade, backup ou durabilidade do R2 real.

O pipeline Coolify existente nao corresponde ao servidor real e nao foi acionado.
Entrega futura deve consumir somente artefato do SHA aprovado, usar o comando
site da plataforma com autodeploy desativado e manter tag anterior para rollback.
Nenhuma migracao operacional antes de backup e restauracao verificados.
