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
import * as migration_20260809_225807_add_site_copy_content from './20260809_225807_add_site_copy_content';
import * as migration_20260810_051920_add_projects_spotlight_service_field from './20260810_051920_add_projects_spotlight_service_field';
import * as migration_20260810_052059_drop_projects_spotlight_old_fields from './20260810_052059_drop_projects_spotlight_old_fields';
import * as migration_20260810_063607_add_services_order_field from './20260810_063607_add_services_order_field';
import * as migration_20260810_073754_add_cta_label_href from './20260810_073754_add_cta_label_href';
import * as migration_20260810_160700_job_openings_jd_upload from './20260810_160700_job_openings_jd_upload';
import * as migration_20260810_161500_add_social_posts from './20260810_161500_add_social_posts';
import * as migration_20260820_190000_add_department_contacts_services_to_government from './20260820_190000_add_department_contacts_services_to_government';
import * as migration_20260820_210000_add_localization_pilot from './20260820_210000_add_localization_pilot';
import * as migration_20260821_070657_full_localization from './20260821_070657_full_localization';
import * as migration_20260822_073750_add_name_localization from './20260822_073750_add_name_localization';
import * as migration_20260822_144148_add_social_posts_text_localization from './20260822_144148_add_social_posts_text_localization';
import * as migration_20260822_211410_redesign_org_chart_step1_drop from './20260822_211410_redesign_org_chart_step1_drop';
import * as migration_20260822_211441_redesign_org_chart_step2_add from './20260822_211441_redesign_org_chart_step2_add';
import * as migration_20260822_211719_org_chart_localize_top_label from './20260822_211719_org_chart_localize_top_label';
import * as migration_20260822_212946_org_chart_add_jceo from './20260822_212946_org_chart_add_jceo';
import * as migration_20260824_115500_site_copy_split_services_hero from './20260824_115500_site_copy_split_services_hero';
import * as migration_20260824_130000_home_page_section_headings from './20260824_130000_home_page_section_headings';
import * as migration_20260824_150000_about_page_section_headings from './20260824_150000_about_page_section_headings';
import * as migration_20260824_160000_careers_section_headings from './20260824_160000_careers_section_headings';
import * as migration_20260824_170000_add_citizen_services from './20260824_170000_add_citizen_services';
import * as migration_20260824_180000_initiatives_projects_updates from './20260824_180000_initiatives_projects_updates';
import * as migration_20260824_190000_services_to_government_department_contacts from './20260824_190000_services_to_government_department_contacts';
import * as migration_20260824_200000_service_detail_editable_headings from './20260824_200000_service_detail_editable_headings';
import * as migration_20260824_210000_services_form_simplification from './20260824_210000_services_form_simplification';
import * as migration_20260825_100000_svcgov_table_column_headers from './20260825_100000_svcgov_table_column_headers';
import * as migration_20260825_110000_social_posts_announcements_order from './20260825_110000_social_posts_announcements_order';
import * as migration_20260825_120000_footer_initiatives_projects_column from './20260825_120000_footer_initiatives_projects_column';
import * as migration_20260825_130000_add_feedback_submissions from './20260825_130000_add_feedback_submissions';
import * as migration_20260825_140000_add_site_identity_and_site_map from './20260825_140000_add_site_identity_and_site_map';
import * as migration_20260826_100000_hero_content_images from './20260826_100000_hero_content_images';
import * as migration_20260826_140000_add_analytics_events from './20260826_140000_add_analytics_events';
import * as migration_20260826_150000_legal_pages_cookie_policy from './20260826_150000_legal_pages_cookie_policy';
import * as migration_20260826_160000_site_identity_favicon from './20260826_160000_site_identity_favicon';
import * as migration_20261001_100000_svcgov_section_toggles from './20261001_100000_svcgov_section_toggles';
import * as migration_20261002_100000_announcements_documents from './20261002_100000_announcements_documents';

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
    name: '20260809_224339_add_rti_tenders_content',
  },
  {
    up: migration_20260809_225807_add_site_copy_content.up,
    down: migration_20260809_225807_add_site_copy_content.down,
    name: '20260809_225807_add_site_copy_content',
  },
  {
    up: migration_20260810_051920_add_projects_spotlight_service_field.up,
    down: migration_20260810_051920_add_projects_spotlight_service_field.down,
    name: '20260810_051920_add_projects_spotlight_service_field',
  },
  {
    up: migration_20260810_052059_drop_projects_spotlight_old_fields.up,
    down: migration_20260810_052059_drop_projects_spotlight_old_fields.down,
    name: '20260810_052059_drop_projects_spotlight_old_fields',
  },
  {
    up: migration_20260810_063607_add_services_order_field.up,
    down: migration_20260810_063607_add_services_order_field.down,
    name: '20260810_063607_add_services_order_field',
  },
  {
    up: migration_20260810_073754_add_cta_label_href.up,
    down: migration_20260810_073754_add_cta_label_href.down,
    name: '20260810_073754_add_cta_label_href',
  },
  {
    up: migration_20260810_160700_job_openings_jd_upload.up,
    down: migration_20260810_160700_job_openings_jd_upload.down,
    name: '20260810_160700_job_openings_jd_upload',
  },
  {
    up: migration_20260810_161500_add_social_posts.up,
    down: migration_20260810_161500_add_social_posts.down,
    name: '20260810_161500_add_social_posts',
  },
  {
    up: migration_20260820_190000_add_department_contacts_services_to_government.up,
    down: migration_20260820_190000_add_department_contacts_services_to_government.down,
    name: '20260820_190000_add_department_contacts_services_to_government',
  },
  {
    up: migration_20260820_210000_add_localization_pilot.up,
    down: migration_20260820_210000_add_localization_pilot.down,
    name: '20260820_210000_add_localization_pilot',
  },
  {
    up: migration_20260821_070657_full_localization.up,
    down: migration_20260821_070657_full_localization.down,
    name: '20260821_070657_full_localization',
  },
  {
    up: migration_20260822_073750_add_name_localization.up,
    down: migration_20260822_073750_add_name_localization.down,
    name: '20260822_073750_add_name_localization',
  },
  {
    up: migration_20260822_144148_add_social_posts_text_localization.up,
    down: migration_20260822_144148_add_social_posts_text_localization.down,
    name: '20260822_144148_add_social_posts_text_localization',
  },
  {
    up: migration_20260822_211410_redesign_org_chart_step1_drop.up,
    down: migration_20260822_211410_redesign_org_chart_step1_drop.down,
    name: '20260822_211410_redesign_org_chart_step1_drop',
  },
  {
    up: migration_20260822_211441_redesign_org_chart_step2_add.up,
    down: migration_20260822_211441_redesign_org_chart_step2_add.down,
    name: '20260822_211441_redesign_org_chart_step2_add',
  },
  {
    up: migration_20260822_211719_org_chart_localize_top_label.up,
    down: migration_20260822_211719_org_chart_localize_top_label.down,
    name: '20260822_211719_org_chart_localize_top_label',
  },
  {
    up: migration_20260822_212946_org_chart_add_jceo.up,
    down: migration_20260822_212946_org_chart_add_jceo.down,
    name: '20260822_212946_org_chart_add_jceo'
  },
  {
    up: migration_20260824_115500_site_copy_split_services_hero.up,
    down: migration_20260824_115500_site_copy_split_services_hero.down,
    name: '20260824_115500_site_copy_split_services_hero',
  },
  {
    up: migration_20260824_130000_home_page_section_headings.up,
    down: migration_20260824_130000_home_page_section_headings.down,
    name: '20260824_130000_home_page_section_headings',
  },
  {
    up: migration_20260824_150000_about_page_section_headings.up,
    down: migration_20260824_150000_about_page_section_headings.down,
    name: '20260824_150000_about_page_section_headings',
  },
  {
    up: migration_20260824_160000_careers_section_headings.up,
    down: migration_20260824_160000_careers_section_headings.down,
    name: '20260824_160000_careers_section_headings',
  },
  {
    up: migration_20260824_170000_add_citizen_services.up,
    down: migration_20260824_170000_add_citizen_services.down,
    name: '20260824_170000_add_citizen_services',
  },
  {
    up: migration_20260824_180000_initiatives_projects_updates.up,
    down: migration_20260824_180000_initiatives_projects_updates.down,
    name: '20260824_180000_initiatives_projects_updates',
  },
  {
    up: migration_20260824_190000_services_to_government_department_contacts.up,
    down: migration_20260824_190000_services_to_government_department_contacts.down,
    name: '20260824_190000_services_to_government_department_contacts',
  },
  {
    up: migration_20260824_200000_service_detail_editable_headings.up,
    down: migration_20260824_200000_service_detail_editable_headings.down,
    name: '20260824_200000_service_detail_editable_headings',
  },
  {
    up: migration_20260824_210000_services_form_simplification.up,
    down: migration_20260824_210000_services_form_simplification.down,
    name: '20260824_210000_services_form_simplification',
  },
  {
    up: migration_20260825_100000_svcgov_table_column_headers.up,
    down: migration_20260825_100000_svcgov_table_column_headers.down,
    name: '20260825_100000_svcgov_table_column_headers',
  },
  {
    up: migration_20260825_110000_social_posts_announcements_order.up,
    down: migration_20260825_110000_social_posts_announcements_order.down,
    name: '20260825_110000_social_posts_announcements_order',
  },
  {
    up: migration_20260825_120000_footer_initiatives_projects_column.up,
    down: migration_20260825_120000_footer_initiatives_projects_column.down,
    name: '20260825_120000_footer_initiatives_projects_column',
  },
  {
    up: migration_20260825_130000_add_feedback_submissions.up,
    down: migration_20260825_130000_add_feedback_submissions.down,
    name: '20260825_130000_add_feedback_submissions',
  },
  {
    up: migration_20260825_140000_add_site_identity_and_site_map.up,
    down: migration_20260825_140000_add_site_identity_and_site_map.down,
    name: '20260825_140000_add_site_identity_and_site_map',
  },
  {
    up: migration_20260826_100000_hero_content_images.up,
    down: migration_20260826_100000_hero_content_images.down,
    name: '20260826_100000_hero_content_images',
  },
  {
    up: migration_20260826_140000_add_analytics_events.up,
    down: migration_20260826_140000_add_analytics_events.down,
    name: '20260826_140000_add_analytics_events',
  },
  {
    up: migration_20260826_150000_legal_pages_cookie_policy.up,
    down: migration_20260826_150000_legal_pages_cookie_policy.down,
    name: '20260826_150000_legal_pages_cookie_policy',
  },
  {
    up: migration_20260826_160000_site_identity_favicon.up,
    down: migration_20260826_160000_site_identity_favicon.down,
    name: '20260826_160000_site_identity_favicon',
  },
  {
    up: migration_20261001_100000_svcgov_section_toggles.up,
    down: migration_20261001_100000_svcgov_section_toggles.down,
    name: '20261001_100000_svcgov_section_toggles',
  },
  {
    up: migration_20261002_100000_announcements_documents.up,
    down: migration_20261002_100000_announcements_documents.down,
    name: '20261002_100000_announcements_documents',
  },
];
