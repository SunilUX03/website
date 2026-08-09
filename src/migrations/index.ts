import * as migration_20260809_153736_initial from './20260809_153736_initial';

export const migrations = [
  {
    up: migration_20260809_153736_initial.up,
    down: migration_20260809_153736_initial.down,
    name: '20260809_153736_initial'
  },
];
