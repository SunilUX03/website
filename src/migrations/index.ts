import * as migration_20260809_153736_initial from './20260809_153736_initial';
import * as migration_20260809_161547_add_announcements from './20260809_161547_add_announcements';
import * as migration_20260809_163817_add_media_items from './20260809_163817_add_media_items';
import * as migration_20260809_164620_add_job_openings from './20260809_164620_add_job_openings';
import * as migration_20260809_165947_add_nav_content from './20260809_165947_add_nav_content';

export const migrations = [
  {
    up: migration_20260809_153736_initial.up,
    down: migration_20260809_153736_initial.down,
    name: '20260809_153736_initial',
  },
  {
    up: migration_20260809_161547_add_announcements.up,
    down: migration_20260809_161547_add_announcements.down,
    name: '20260809_161547_add_announcements',
  },
  {
    up: migration_20260809_163817_add_media_items.up,
    down: migration_20260809_163817_add_media_items.down,
    name: '20260809_163817_add_media_items',
  },
  {
    up: migration_20260809_164620_add_job_openings.up,
    down: migration_20260809_164620_add_job_openings.down,
    name: '20260809_164620_add_job_openings',
  },
  {
    up: migration_20260809_165947_add_nav_content.up,
    down: migration_20260809_165947_add_nav_content.down,
    name: '20260809_165947_add_nav_content'
  },
];
