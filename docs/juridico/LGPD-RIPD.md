# Relatório de impacto à proteção de dados pessoais (RIPD)

Rascunho técnico para o encarregado do Município (LGPD, art. 38, e art. 5º, XVII). Data: **08/11/2026**.

## 1. Por que fazer

O portal é de um órgão que lida com direitos de crianças e adolescentes. Mesmo sem coletar dados de visitantes, ele
pode publicar imagens e nomes, e uma publicação errada pode identificar uma criança em situação de risco. Esse é o
risco central, e o motivo deste relatório.

## 2. Descrição do tratamento

Ver [LGPD-INVENTARIO.md](LGPD-INVENTARIO.md). Resumo: portal informativo sem cadastro nem formulário público; painel
interno para poucas contas; publicação de atos públicos; imagens de eventos; cópias de segurança cifradas.

## 3. Necessidade e proporcionalidade

- A finalidade (transparência e orientação sobre direitos) é pública e prevista em lei (LAI, ECA, lei municipal do
  CMDCA).
- Coleta mínima: nada é pedido ao visitante. Registros técnicos têm guarda curta.
- Imagens de crianças não são necessárias para a finalidade na maioria dos casos. A regra é preferir grupos, mãos e
  detalhes, e o sistema exige termo para qualquer criança identificável.

## 4. Riscos e medidas

| Risco | Probabilidade antes | Impacto | Medidas adotadas | Risco residual |
| --- | --- | --- | --- | --- |
| Publicar imagem ou texto que identifique criança vítima, acolhida, em risco ou com ato infracional atribuído | Média | Muito alto | Trava `situacaoProtegida` (bloqueia mesmo com termo); declaração obrigatória em notícias; política editorial; retirada imediata a pedido | Baixo |
| Publicar imagem de criança sem autorização | Média | Alto | Campo obrigatório de criança identificável + termo conferido + referência interna; teste automático | Baixo |
| Foto com GPS ou dados do aparelho revelar endereço | Alta (celulares gravam GPS) | Alto | EXIF removido no envio; teste automático no CI | Muito baixo |
| PDF com metadados (autor, caminho do arquivo) | Média | Baixo | Orientação para exportar sem metadados | Baixo |
| Termo de autorização ou documento pessoal enviado à biblioteca pública | Baixa | Alto | Aviso fixo no painel; arquivos novos nascem como rascunho; revisão antes de publicar | Baixo |
| Conta do painel invadida | Baixa | Alto | Senha forte obrigatória, troca forçada, bloqueio por conta e por IP, papéis mínimos, contas de teste apagadas | Baixo |
| Vazamento de rascunho ou campo interno pela API | Baixa | Médio | Acesso por documento e por campo; testes anônimos da API no CI | Muito baixo |
| Perda de dados | Baixa | Médio | Backup diário cifrado, cópia externa, restauração testada | Muito baixo |
| Transferência internacional sem garantia | Baixa | Baixo | Cópia externa já cifrada (o provedor não lê); mapa e Libras só por escolha do visitante, informados no aviso | Baixo |
| Visitante usar o e-mail do portal para relatar caso grave | Média | Alto | Avisos em termos, privacidade e ajuda direcionam ao 190, Disque 100 e Conselho Tutelar | Médio: depende do comportamento do visitante |

## 5. Conclusão técnica

Com as medidas implementadas em 08/11/2026, o risco residual é baixo. Os pontos que dependem de pessoas (revisão
editorial, guarda dos termos, retirada rápida) estão descritos em [POLITICA-EDITORIAL.md](POLITICA-EDITORIAL.md) e
precisam ser aprovados pelo conselho.

## 6. Aprovação

| Papel | Nome | Data | Assinatura |
| --- | --- | --- | --- |
| Encarregado do Município | | | |
| Presidência do CMDCA | | | |
| Responsável técnico | | | |
