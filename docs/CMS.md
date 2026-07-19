# Manual do painel

Este guia é para a equipe do CMDCA. O painel fica em `/admin` e funciona melhor em navegador atualizado. Não compartilhe conta: cada pessoa deve usar seu próprio usuário para que o histórico identifique quem revisou.

## Entrar e recuperar acesso

1. Abra `/admin` no domínio oficial.
2. Informe e-mail e senha.
3. Se errar repetidamente, aguarde o bloqueio temporário terminar em vez de insistir.
4. Use “Esqueci minha senha” somente se o SMTP institucional estiver validado.

Se o e-mail não chegar, confira spam e peça ao Administrador para verificar os logs e o provedor. Nunca peça senha por mensagem. O Administrador pode orientar a redefinição, mas não deve conhecer a senha final do usuário.

## Papéis

| Ação | Editor | Jurídico | Administrador |
| --- | :---: | :---: | :---: |
| Criar e editar conteúdo | sim | sim | sim |
| Salvar rascunho | sim | sim | sim |
| Alterar aprovação jurídica | não | sim | sim |
| Publicar ou despublicar | não | sim | sim |
| Excluir/enviar à lixeira | não | não | sim |
| Editar configurações institucionais | não | sim | sim |
| Gerenciar usuários e papéis | não | não | sim |

O painel impede a exclusão da própria conta administrativa e a remoção do último Administrador. Mantenha dois Administradores ativos para contingência.

## Fluxo: rascunho → revisão → publicação

### 1. Editor prepara

1. Escolha a área correta, como Notícias, Reuniões, Resoluções ou Editais.
2. Clique em criar novo item.
3. Preencha o texto, data, documentos e campos laterais.
4. No bloco **Fonte e revisão**, informe a fonte, o link oficial, a data da conferência e qualquer dúvida em **Observações internas**.
5. Clique em **Salvar rascunho**. O autosave reduz perda de trabalho, mas confirme que o estado exibido é rascunho antes de sair.
6. Avise o Jurídico pelo canal interno adotado pelo Conselho, incluindo o título exato do item. Não envie senha nem arquivo sigiloso pelo aviso.

O Editor não consegue publicar, mesmo por API. Se o sistema recusar o salvamento, leia a mensagem: normalmente falta campo obrigatório, formato de URL/data ou o comando usado tentaria publicar.

### 2. Jurídico revisa

1. Abra o rascunho indicado e consulte a fonte primária.
2. Compare nomes, número e data do ato, vigência, anexos, prazos e competência do órgão.
3. Para informação dinâmica, confirme que a data de verificação é recente.
4. Corrija o conteúdo ou devolva a pendência em **Observações internas**.
5. Altere **Revisão jurídica** para **Aprovada** somente quando houver suporte documental.
6. Publique e abra a página pública em janela anônima.

Uma validação de servidor bloqueia publicação incompleta. Não contorne removendo fonte ou mudando a categoria. Corrija a informação ou mantenha o rascunho.

### 3. Depois de publicar

Confira título, resumo, data, links, PDF, imagem, texto alternativo e versão móvel. O site atualiza as rotas relacionadas automaticamente; uma pequena demora de cache pode ocorrer. Se a informação estiver errada, corrija e publique nova versão ou despublique conforme a gravidade.

## Cuidados por tipo de conteúdo

### Notícias

- título objetivo e resumo entre os limites mostrados no formulário;
- corpo completo, autoria e data de publicação;
- capa apenas em formato de imagem; PDF não é imagem de capa;
- “Nota técnica” exige aprovação jurídica;
- só marque destaque quando a notícia ainda for relevante na home.

### Reuniões

- **Natureza** diz se é ordinária ou extraordinária;
- **Acesso** diz se é pública ou reservada. Reservadas nunca aparecem na API pública;
- **Modalidade** define presencial, online ou híbrida;
- presencial/híbrida exige local; online/híbrida exige link;
- horário usa formato de 24 horas, por exemplo `14:30`;
- anexe a ata somente após aprovação e em PDF.

Não publique link interno, credencial de videoconferência ou pauta protegida em reunião reservada.

### Resoluções e editais

- confira número, ano, data, título, situação e vigência;
- anexe o documento oficial em PDF;
- em retificação, relacione o ato anterior e explique o que foi alterado;
- não substitua silenciosamente um PDF publicado. Preserve o ato anterior e publique a correção com rastreabilidade.

### Entidades e rede de proteção

- confirme registro, validade e situação antes de listar uma entidade;
- telefone e endereço antigos causam risco real: confirme com o equipamento;
- abra o pin do mapa e confira rua/bairro; coordenada válida não garante local correto;
- não use observação pública para guardar dado pessoal ou informação de caso.

### Indicadores

Os números ficam ocultos enquanto **Publicar indicadores no site** estiver desligado. Antes de ligar:

- preencha período, fonte, data de verificação e aprovação jurídica;
- confira todos os totais contra a mesma competência;
- use anos de quatro dígitos sem repetir;
- percentuais por área, quando preenchidos, devem somar 100%;
- explique metodologia, mudança de série ou cobertura na nota pública.

Zero é um número válido somente quando a fonte comprova zero; não o use como placeholder.

### Mídia

- dê nome compreensível ao arquivo antes do upload;
- preencha texto alternativo descrevendo a informação visual, não “imagem de...”;
- informe crédito e fonte;
- use PDF para atos/documentos e formatos de imagem para fotografias/capas;
- para criança ou adolescente identificável, registre consentimento/autorização e aplique a política de [`CONTEUDO.md`](../CONTEUDO.md).

Comprovação de consentimento e observações internas não aparecem ao público, mas também não devem conter dados excessivos.

## Histórico, correção e exclusão

Use o histórico de versões para entender o que mudou e recuperar texto editorial. Restaurar uma versão cria estado no CMS; confira e publique conscientemente.

Prefira despublicar quando o conteúdo precisa sair do site mas deve permanecer como registro. Exclusão é exclusiva do Administrador e deve ser excepcional. A lixeira protege contra erro operacional, porém não substitui backup do Neon nem versionamento/backup do R2.

Para incidente com dado pessoal, documento indevido ou credencial exposta, não apenas edite a página: acione o procedimento de [`docs/OPERACOES.md`](OPERACOES.md).
