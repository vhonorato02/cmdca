import * as migration_20260531_062721_initial from './20260531_062721_initial'
import * as migration_20260531_190858_add_diretoria from './20260531_190858_add_diretoria'
import * as migration_20260719_194302_editorial_safety from './20260719_194302_editorial_safety'
import * as migration_20260929_150216_payload_upgrade_compatibility from './20260929_150216_payload_upgrade_compatibility'
import * as migration_20261011_073400_editorial_controls from './20261011_073400_editorial_controls'
import * as migration_20261026_092854_textos_paginas_pendencias from './20261026_092854_textos_paginas_pendencias'
import * as migration_20261027_044136_media_sem_autosave from './20261027_044136_media_sem_autosave'
import * as migration_20261027_235800_trocar_senha from './20261027_235800_trocar_senha'

export const migrations = [
  {
    up: migration_20260531_062721_initial.up,
    down: migration_20260531_062721_initial.down,
    name: '20260531_062721_initial',
  },
  {
    up: migration_20260531_190858_add_diretoria.up,
    down: migration_20260531_190858_add_diretoria.down,
    name: '20260531_190858_add_diretoria',
  },
  {
    up: migration_20260719_194302_editorial_safety.up,
    down: migration_20260719_194302_editorial_safety.down,
    name: '20260719_194302_editorial_safety',
  },
  {
    up: migration_20260929_150216_payload_upgrade_compatibility.up,
    down: migration_20260929_150216_payload_upgrade_compatibility.down,
    name: '20260929_150216_payload_upgrade_compatibility',
  },
  {
    up: migration_20261011_073400_editorial_controls.up,
    down: migration_20261011_073400_editorial_controls.down,
    name: '20261011_073400_editorial_controls',
  },
  {
    up: migration_20261026_092854_textos_paginas_pendencias.up,
    down: migration_20261026_092854_textos_paginas_pendencias.down,
    name: '20261026_092854_textos_paginas_pendencias',
  },
  {
    up: migration_20261027_044136_media_sem_autosave.up,
    down: migration_20261027_044136_media_sem_autosave.down,
    name: '20261027_044136_media_sem_autosave',
  },
  {
    up: migration_20261027_235800_trocar_senha.up,
    down: migration_20261027_235800_trocar_senha.down,
    name: '20261027_235800_trocar_senha',
  },
]
