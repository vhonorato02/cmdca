# Operações, backup e recuperação

## Rotina saudável

| Frequência | Verificação |
| --- | --- |
| a cada deploy | status Vercel, logs, smoke público/admin, migrações, e-mail de recuperação |
| semanal | falhas 4xx/5xx anormais, contas administrativas, conteúdo com prazo próximo |
| mensal | restaurabilidade do backup Neon, inventário R2, contatos/emergência e dependências |
| trimestral | rotação de credenciais conforme política, revisão de acessos e recuperação simulada |
| a cada mudança de fornecedor | privacidade, CSP/headers, DNS, subprocessadores e documentação |

Registre data, responsável e resultado. Não guarde segredo no registro.

## Migração segura do banco

Migrations são código de produção. Use este fluxo mesmo trabalhando direto na `main`:

1. Altere o schema do Payload.
2. Gere tipos e uma única migração com nome descritivo:

   ```powershell
   pnpm generate:types
   pnpm migrate:create
   ```

3. Revise o arquivo gerado. Procure `DROP`, alteração de tipo, coluna obrigatória sem valor padrão e reescrita de tabela.
4. Confirme que não há outro deploy ou migração em andamento.
5. Quando necessário, execute diretamente:

   ```powershell
   pnpm migrate:status
   pnpm migrate
   pnpm check
   pnpm build
   ```

6. Envie um único deploy. A configuração da Vercel aplica a migração com a conexão direta antes do build.
7. Verifique a produção e registre o horário da migração para eventual recuperação pelo histórico do Neon.

Para mudança incompatível, use expansão e contração em entregas separadas: primeiro adicione campos/tabelas compatíveis, depois migre e confira dados, só em uma entrega posterior remova o formato antigo. Rollback de código não resolve schema destrutivo.

Não execute migration manualmente na base principal ao mesmo tempo que um deployment. Não use `db push`, sincronização automática de schema ou SQL improvisado.

## Camadas de backup

### Neon

- use o histórico/restore do plano contratado e registre o ponto temporal pré-entrega;
- confirme quantidade de documentos críticos e capacidade de login antes de considerar o backup válido;
- registre a janela de retenção do plano real; não presuma retenção ilimitada.

### Cloudflare R2

- habilite versionamento ou uma política de cópia/backup compatível com a criticidade dos documentos;
- mantenha inventário de objetos e retenção alinhada à política documental;
- uma linha restaurada no Neon pode apontar para objeto já excluído no R2;
- uma mídia retirada por privacidade pode continuar em versão/cache: trate remoção como procedimento completo.

### GitHub e Vercel

Git preserva código e migrações. Vercel preserva deployments dentro dos limites da conta. Nenhum dos dois é backup do banco ou do bucket.

## Rollback por cenário

### Código com regressão, dados intactos

1. Pare novos pushes e alterações editoriais.
2. Registre commit/deployment defeituoso e evidências.
3. Promova o último deployment saudável na Vercel.
4. Corrija na `main`, execute QA e publique novo commit.

### Migração aplicada, aplicação incompatível

1. Coloque a edição em pausa e estime quais dados entraram depois da migração.
2. Identifique no histórico Neon o ponto anterior à migração e a janela potencial de perda.
3. Prefira uma migração corretiva para frente quando os dados puderem ser preservados.
4. Restaurar o ponto anterior é destrutivo: exige autorização operacional explícita, horário confirmado e comunicação da possível perda de dados.
5. Depois da recuperação, valide CMS, APIs, contagens, vínculos de mídia e publicação.

### Arquivo ausente ou errado

1. Despublique o documento que aponta para o arquivo.
2. Verifique versões/backup do R2 e metadados no Neon.
3. Restaure com a mesma política de acesso e confira `Content-Type`.
4. Publique novamente e invalide apenas os caches relacionados.

### Conteúdo editorial incorreto

1. Em risco legal, de privacidade ou segurança, despublique primeiro.
2. Preserve a versão e registre a causa.
3. Corrija a partir de fonte oficial e passe novamente pela revisão jurídica.
4. Se necessário, publique errata/retificação em vez de apagar o histórico.

## Rotação de credenciais

Em vazamento real ou suspeito, assuma comprometimento:

1. restrinja acesso ao painel e preserve logs;
2. rotacione `PAYLOAD_SECRET` na Vercel, causando encerramento das sessões;
3. rotacione senha/role do Neon e atualize as duas URIs;
4. rotacione chave limitada do R2 e revogue a anterior;
5. rotacione SMTP e contas administrativas afetadas;
6. faça redeploy e teste runtime, migração, upload e recuperação de senha;
7. procure o valor antigo no histórico Git, logs, artifacts e canais de comunicação;
8. documente alcance, período e medidas sem copiar o segredo.

Alterar apenas `.env.local` não rotaciona uma credencial no provedor. Remover segredo de um commit recente também não o torna seguro; a credencial precisa ser revogada.

## Cache e diagnóstico

Localmente, `pnpm clean` remove somente artefatos gerados seguros. Em produção:

- confirme se o documento está publicado no CMS;
- confirme a linha no Neon e o objeto no R2;
- consulte a resposta HTTP e o deployment que a serviu;
- revalide a rota pelo fluxo normal de publicação;
- só então invalide cache ou faça novo deployment.

Uma limpeza ampla pode aumentar latência e esconder a causa. Nunca apague `.vercel`, bucket ou dados Neon como método de troubleshooting.

## Incidente

Classifique como crítico quando houver credencial exposta, dado pessoal indevido, conteúdo jurídico falso, indisponibilidade geral, perda de dados ou controle administrativo comprometido. Para cada incidente, registre:

- início conhecido e momento da detecção;
- rotas, documentos, usuários e serviços afetados;
- último commit e deployment;
- ações de contenção e quem as autorizou;
- fonte do backup e ponto de recuperação;
- validação final e medidas preventivas.

Não inclua dados pessoais ou segredos no ticket/post-mortem além do estritamente necessário.
