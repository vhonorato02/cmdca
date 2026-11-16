# Registro das operações de tratamento (LGPD, art. 37)

Portal do CMDCA de Pindamonhangaba. Situação em **08/11/2026**, conferida no código e na VPS. Entregar ao encarregado
do Município para inclusão no inventário municipal.

Controlador: Município de Pindamonhangaba, por meio do CMDCA. Operador da infraestrutura: responsável técnico do
portal. Servidor: VPS no Brasil (`zewithane`, Ubuntu 24.04, Docker), banco PostgreSQL 17 e arquivos de mídia no
mesmo servidor.

## Operações

| # | Operação | Titulares | Dados | Finalidade | Base legal | Compartilhamento | Retenção |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Registro técnico de acesso | Visitantes | IP, data e hora, método e endereço, agente do navegador, código de resposta | Segurança, abuso, diagnóstico | Art. 7º, III; art. 23; art. 46 | Nenhum | Logs do proxy (Caddy → driver `local` do Docker): 3 arquivos de 10 MB, rotação por tamanho, em geral dias. Journal do sistema: até 30 dias / 200 MB. Não entram nas cópias de segurança |
| 2 | Limite de tentativas de login | Quem tenta entrar no painel | IP (ou prefixo /64 do IPv6), contagem | Impedir teste de senhas | Art. 7º, III; art. 46 | Nenhum | Só em memória; zera a cada reinício (`src/security/rate-limit.ts`) |
| 3 | Contas do painel | Conselheiros e equipe autorizados | Nome, e-mail, papel, hash da senha, tentativas e bloqueio, sessões | Autenticação, permissões, autoria das publicações | Art. 7º, II e III; art. 23 | Nenhum | Enquanto houver função; desativar ao sair. Histórico de versões (até 30 por item) mantido como registro do ato |
| 4 | Recuperação de senha | Usuários do painel | E-mail, token de uso único | Recuperar acesso | Art. 7º, III | Nenhum (sem SMTP externo; decisão 0009) | Token expira e é consumido no uso |
| 5 | Publicação de atos e notícias | Conselheiros, diretoria, signatários, entidades | Nome, cargo, segmento, nome da entidade e registro | Transparência ativa | Art. 7º, II; art. 23; LAI, art. 8º; CF, art. 37 | Público (portal e API de leitura) | Enquanto houver interesse público; atos revogados ficam marcados, não apagados |
| 6 | Depoimentos | Pessoas que autorizaram | Nome, papel, frase, referência da autorização (interna) | Comunicação institucional | Art. 7º, I (consentimento) | Público: nome, papel e frase; referência só interna | Até a revogação da autorização; ao revogar, despublicar |
| 7 | Imagens com criança ou adolescente identificável | Crianças, adolescentes, responsáveis | Imagem; referência do termo (interna) | Registro de eventos públicos | Art. 14, § 1º (consentimento específico de um dos pais ou responsável) | Público: só a imagem | Até a revogação; termo físico guardado fora do portal |
| 8 | Mensagens ao e-mail do conselho | Qualquer pessoa | Nome, e-mail, texto, anexos | Responder e encaminhar | Art. 7º, III; art. 23; Lei nº 13.460/2017 | Setores do Município, quando necessário | Tabela de temporalidade do Município (pendente de definição; ver README) |
| 9 | Cópias de segurança | Todos os acima, exceto 1 e 2 | Dump do banco e arquivos de mídia | Continuidade e recuperação | Art. 46 | Cópia externa cifrada (restic) em armazenamento em nuvem (Google Drive), sem a chave | 7 diárias, 4 semanais, 6 mensais (`/srv/platform/scripts/backup.sh`) |
| 10 | Preferências de acessibilidade | Visitantes | `cmdca-fs` (tamanho de letra), `cmdca-contrast` | Lembrar a preferência | Não há tratamento pelo controlador: fica só no navegador | Nenhum | Até o visitante apagar |
| 11 | VLibras (sob demanda) | Visitantes que clicam em "Libras" | IP e dados técnicos enviados pelo navegador | Tradução para Libras | Escolha do visitante; serviço do Governo Federal | VLibras (gov.br) e jsDelivr | Políticas dos terceiros |
| 12 | Mapa da rede (sob demanda) | Visitantes que pedem o mapa | IP e dados técnicos enviados pelo navegador | Mostrar endereços | Escolha do visitante | Fundação OpenStreetMap (pode ficar fora do Brasil) | Políticas dos terceiros |

## O que o portal não trata

- Denúncias, relatos de casos, dados de saúde, prontuários, processos do Conselho Tutelar.
- Cadastro de visitantes, newsletter, formulário público, cookies de visitantes, estatística de navegação, pixels de
  redes sociais.
- Termos de autorização assinados: ficam no arquivo do conselho, nunca na biblioteca de mídia (aviso no próprio
  painel).

## Revisão

Revisar este registro sempre que entrar um formulário, um serviço de terceiro, uma integração ou uma nova coleção no
CMS, e pelo menos uma vez por ano.
