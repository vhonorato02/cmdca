import * as migration_20260531_062721_initial from './20260531_062721_initial';
import * as migration_20260531_190858_add_diretoria from './20260531_190858_add_diretoria';
import * as migration_20260719_194302_editorial_safety from './20260719_194302_editorial_safety';

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
    name: '20260719_194302_editorial_safety'
  },
];
