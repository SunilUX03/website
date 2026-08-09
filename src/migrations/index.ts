import * as migration_20260809_153736_initial from './20260809_153736_initial';
import * as migration_20260809_161547_add_announcements from './20260809_161547_add_announcements';
import * as migration_20260809_163817_add_media_items from './20260809_163817_add_media_items';
import * as migration_20260809_164620_add_job_openings from './20260809_164620_add_job_openings';
import * as migration_20260809_165947_add_nav_content from './20260809_165947_add_nav_content';
import * as migration_20260809_170753_add_board_content from './20260809_170753_add_board_content';
import * as migration_20260809_171259_add_team_members from './20260809_171259_add_team_members';
import * as migration_20260809_172326_add_hero_and_leadership_band from './20260809_172326_add_hero_and_leadership_band';
import * as migration_20260809_173933_add_services from './20260809_173933_add_services';
import * as migration_20260809_174207_add_suppress_get_started_steps from './20260809_174207_add_suppress_get_started_steps';
import * as migration_20260809_194046_add_documents_go_policies_activitylog_ticker from './20260809_194046_add_documents_go_policies_activitylog_ticker';
import * as migration_20260809_212557_add_legal_pages_footer from './20260809_212557_add_legal_pages_footer';
import * as migration_20260809_214433_add_about_page_content from './20260809_214433_add_about_page_content';
import * as migration_20260809_221528_add_metrics_pillars_projects_spotlight from './20260809_221528_add_metrics_pillars_projects_spotlight';
import * as migration_20260809_223632_add_careers_content from './20260809_223632_add_careers_content';
import * as migration_20260809_224339_add_rti_tenders_content from './20260809_224339_add_rti_tenders_content';

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
    name: '20260809_165947_add_nav_content',
  },
  {
    up: migration_20260809_170753_add_board_content.up,
    down: migration_20260809_170753_add_board_content.down,
    name: '20260809_170753_add_board_content',
  },
  {
    up: migration_20260809_171259_add_team_members.up,
    down: migration_20260809_171259_add_team_members.down,
    name: '20260809_171259_add_team_members',
  },
  {
    up: migration_20260809_172326_add_hero_and_leadership_band.up,
    down: migration_20260809_172326_add_hero_and_leadership_band.down,
    name: '20260809_172326_add_hero_and_leadership_band',
  },
  {
    up: migration_20260809_173933_add_services.up,
    down: migration_20260809_173933_add_services.down,
    name: '20260809_173933_add_services',
  },
  {
    up: migration_20260809_174207_add_suppress_get_started_steps.up,
    down: migration_20260809_174207_add_suppress_get_started_steps.down,
    name: '20260809_174207_add_suppress_get_started_steps',
  },
  {
    up: migration_20260809_194046_add_documents_go_policies_activitylog_ticker.up,
    down: migration_20260809_194046_add_documents_go_policies_activitylog_ticker.down,
    name: '20260809_194046_add_documents_go_policies_activitylog_ticker',
  },
  {
    up: migration_20260809_212557_add_legal_pages_footer.up,
    down: migration_20260809_212557_add_legal_pages_footer.down,
    name: '20260809_212557_add_legal_pages_footer',
  },
  {
    up: migration_20260809_214433_add_about_page_content.up,
    down: migration_20260809_214433_add_about_page_content.down,
    name: '20260809_214433_add_about_page_content',
  },
  {
    up: migration_20260809_221528_add_metrics_pillars_projects_spotlight.up,
    down: migration_20260809_221528_add_metrics_pillars_projects_spotlight.down,
    name: '20260809_221528_add_metrics_pillars_projects_spotlight',
  },
  {
    up: migration_20260809_223632_add_careers_content.up,
    down: migration_20260809_223632_add_careers_content.down,
    name: '20260809_223632_add_careers_content',
  },
  {
    up: migration_20260809_224339_add_rti_tenders_content.up,
    down: migration_20260809_224339_add_rti_tenders_content.down,
    name: '20260809_224339_add_rti_tenders_content'
  },
];
