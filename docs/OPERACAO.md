# Operacao verificada

Inspecao somente leitura em 2026-10-11.

## Plataforma existente

- Host zewithane.vps.brz.dev.br, SSH 22322, usuario zewithane.
- Traefik em /srv/platform, configuracao dinamica por site e TLS automatico.
- /srv/sites/quarau e /srv/sites/teste existentes, nao alterados.
- Redes proxy e db separadas. Postgres sem porta publicada no host.
- UFW ativo: 22322, 80, 443; listeners 22/22322 observados.
- Timers platform-backup, platform-restore-test, platform-health e
  platform-autodeploy existem. Resultado de restore CMDCA ainda inexistente.

O comando /srv/platform/bin/site foi lido. Suporta site novo, deploy,
rollback, dominios, banco e autodeploy. Evitar novo proxy ou painel.

## Convencao para proximo site

Somente exemplo operacional, nao executado nesta sessao:

```sh
sudo site novo NOME ghcr.io/ORGANIZACAO/IMAGEM --porta 3000 --saude /api/health --memoria 512m --sem-autodeploy
```

O comando cria /srv/sites/NOME, app.env protegido, rede e banco/role exclusivos.
Para banco externo, acrescentar --sem-banco. Preencher segredos no arquivo
protegido, executar backup, e publicar tag imutavel pelo site deploy.
Nunca executar site remover em tentativa de reparo.

## Bloqueios CMDCA

- Privacidade direta do bucket R2 precisa ser verificada e configurada.
- SMTP institucional ainda ausente.
- Backup dos objetos R2 ainda precisa ser executado; restore do banco descrito abaixo.
- Dominio Wix exato e zona nao localizados; nenhum DNS foi alterado.
- Host temporario resolve, mas nao existe publicacao CMDCA verificada.

## Backup e restore do banco

Dump criado em 11/10/2026 e conferido novamente em 12/10:
`/srv/backups/cmdca/database-20261011074653107.dump` (root, modo 600).
SHA256: `84982c8908e90e4c5ba6788fd6f1fc7246a4a5dc113b231dfdc085cda2b63d8e`.
Restore privado retido em `cmdca_restore_20261011074653107`, sem aplicacao
conectada e sem CONNECT para PUBLIC. Contagem verificada: 46 tabelas e 6 noticias.
O Neon fonte nao foi alterado. O helper pg_dump foi efemero, com 128 MiB e
0.5 CPU; o Postgres compartilhado manteve sua rede privada inalterada.

Tres tentativas iniciais deixaram arquivos de zero bytes no mesmo diretorio.
Nao sao backups validos; somente o arquivo com hash acima esta confirmado.
Copias offsite e backup periodico do Neon/R2 ainda nao foram configurados.
O timer existente da plataforma nao exporta automaticamente o Neon.
