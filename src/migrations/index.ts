import * as migration_20260809_153736_initial from './20260809_153736_initial';
import * as migration_20260809_161547_add_announcements from './20260809_161547_add_announcements';

export const migrations = [
  {
    up: migration_20260809_153736_initial.up,
    down: migration_20260809_153736_initial.down,
    name: '20260809_153736_initial',
  },
  {
    up: migration_20260809_161547_add_announcements.up,
    down: migration_20260809_161547_add_announcements.down,
    name: '20260809_161547_add_announcements'
  },
];
