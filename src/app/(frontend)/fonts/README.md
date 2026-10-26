# Fontes locais

`archivo-condensada.woff2`: instância parcial da **Archivo** (Omnibus-Type), com largura fixa em 78% e peso variável de 760 a 860, só com o subconjunto latino. Ela cobre títulos e numerais e pesa cerca de 25 KB, contra 90 KB da fonte completa.

- Copyright 2017 The Archivo Project Authors (https://github.com/Omnibus-Type/Archivo).
- Licença: SIL Open Font License 1.1 (https://openfontlicense.org). Modificada só por instanciação e subconjunto (fontTools `varLib.instancer`).

Como regerar a partir da fonte variável do Google Fonts (subconjunto latino):

```sh
uvx --from "fonttools[woff]" fonttools varLib.instancer archivo-var-latin.ttf wdth=78 wght=760:860 -o archivo-cond.ttf
uvx --from "fonttools[woff]" fonttools ttLib.woff2 compress archivo-cond.ttf -o archivo-condensada.woff2
```
