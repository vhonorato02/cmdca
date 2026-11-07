> Fotografia de 04/11/2026. Estado atual: [RELATORIO-FINAL.md](RELATORIO-FINAL.md) e [RISCOS.md](RISCOS.md).

# Segurança, privacidade e direitos da criança: registro de auditoria

## Confirmado em código
- Payload restringe acesso público de notícias/documentos a `published`; reuniões requerem `acesso=publica` adicional. Reuniões reservadas rejeitam nova ata ligada à biblioteca pública.
- Mídia exige publicação editorial, `Cache-Control: private, no-store` no download e campos de consentimento de criança restritos à equipe.
- `Users`: três papéis, administrador exclusivo para excluir/gerenciar usuários; política de troca obrigatória de senha, lockout por conta e rate limit por IP no proxy; GraphQL desabilitado.
- `next.config.ts`: CSP, HSTS, cabeçalhos de segurança, `noindex` para CMS/API; saúde não devolve credenciais; preview exige sessão autenticada e origem compatível.

## Não verificado e não deve ser interpretado como ausência de falha
- Testes reais de IDOR/BOLA, mass assignment, upload de PDF hostil, imagem maliciosa, sessão revogada, CSRF com proxy, limite em múltiplas réplicas, SSRF de imagem, exposição após despublicação e log de segredos.
- Exposição de PDFs antigos via bucket R2 legado. Testar autorização usando arquivo **sintético**; a evidência de 12/10 de URL R2 pública era histórica e pode ter mudado.
- Incidência e implementação documental de ECA, LGPD, LAI, LBI, WCAG/eMAG; validação jurídica deve ser feita por responsável institucional.

## Modelo de ameaça por prioridade
1. Conta editorial antiga comprometida em deploy legado.
2. Documento reservado ou informação de criança acessível por API, mídia ou cache.
3. Pessoa vulnerável direcionada a contato errado/antigo.
4. Phishing por dados não verificados do FMDCA/IR.
5. Falha total de VPS e ausência de restore coerente.

## Não publicar sem revisão
Nomes, fotos/EXIF de menores, vítimas/famílias, termos de autorização, dados bancários, orientações fiscais, datas de atos ou contatos novos. Toda coleta e análise automática desta rodada ficou no conteúdo público e em metadados de repositório, sem exportação de dados pessoais.

## Leitura anônima de APIs em 04/11/2026
Respostas HTTP reais obtidas **somente por GET**, sem credenciais:
- `/api/users?limit=1`: **403** (nega lista de usuários).
- `/api/preferences?limit=1`: **404** (rota ausente no runtime atual).
- `/api/media?limit=2&depth=0`: **200** com 3 mídias públicas no total; amostra de 2 registros sem campos `consentimentoMenor`, `referenciaConsentimento` nem `controleEditorial`.
- `/api/noticias?limit=1&depth=0`: **200**, 16 notícias no total e amostra sem `controleEditorial`.
- `/api/reunioes?limit=1&depth=0`: **200**, 0 reuniões públicas retornadas.
- `/api/graphql` por GET: **405**. Isso não demonstra bloqueio de todas as modalidades de GraphQL.

Amostras de paginação **não** demonstram ausência de vazamento em todos os registros, todos os papéis ou em anexos diretos. Sem validação de autorização autenticada, testes de escrita e tentativa adversarial, segurança permanece parcialmente verificada.
