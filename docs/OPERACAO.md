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
- Backup e restore do Neon e dos objetos precisam ser executados.
- Dominio Wix exato e zona nao localizados; nenhum DNS foi alterado.
- Host temporario resolve, mas nao existe publicacao CMDCA verificada.
