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

Em 12/10, consultas READ ONLY ao Neon e ao restore retornaram os mesmos totais:
6 noticias, 2 registros de midia e 2 usuarios. Nenhum dado pessoal foi registrado
nessa comparacao.

## Backup e restore dos uploads

Em 12/10/2026 19:01 UTC, os 3 objetos do bucket (55.064 bytes) foram lidos sem
alteracao remota, criptografados com AES-256-GCM e restaurados localmente.
Cada objeto restaurado teve SHA256 comparado ao original.

Pasta privada: `C:\Users\Ze\.cmdca-backups\2026-10-12T19-01-49-380Z`.
ACL conferida: acesso somente NOTE-ZE\Ze. Chave de recuperacao fora do
repositorio, dentro da pasta protegida; nunca enviar seu conteudo ao chat/Git.
SHA256 do arquivo uploads.aes:
`aaa94012773ee5465b6f43e28c4397abefb9effc4780c39f69a4668cb1f54631`.

O helper `node scripts/backup-storage.mjs --confirm-readonly-backup` faz
somente LIST/GET no R2 e testa a recuperacao dos arquivos gravados no disco.
Isso nao configura retencao automatica ou uma segunda copia externa.

HEAD anonimo de objeto existente no endereco direto R2 retornou 200 em 12/10.
A privacidade do bucket continua bloqueadora, apesar de o portal agora
autorizar os downloads pela API Payload.
