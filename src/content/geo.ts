/**
 * Coordenadas aproximadas (pelas ruas divulgadas pela Prefeitura) usadas no
 * mapa enquanto o ponto da rede não tiver latitude e longitude no CMS. A lista
 * de endereços continua sendo a referência.
 */
export const COORDENADAS_APROXIMADAS: Record<string, [number, number]> = {
  'CRAS Araretama': [-22.9481387, -45.4960189],
  'CRAS Castolira': [-22.924871, -45.437798],
  'CRAS Centro': [-22.9392412, -45.4607149],
  'CRAS Cidade Nova': [-22.9444915, -45.408434],
  'CRAS Moreira César': [-22.9183166, -45.3645229],
  'CREAS Centro': [-22.9279614, -45.4565787],
  'CREAS Moreira César': [-22.9191887, -45.3604353],
}
