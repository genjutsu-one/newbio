
const SUPABASE_URL = 'https://arhcuichmdulkxltvanc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_MBvUCt_XnWBGowsDscdO2Q_ZmF9IXS0';

const VIEW_SEEN_KEY = 'unnamed_view_seen_v1';
const VIEW_COUNT_KEY = 'unnamed_view_count_cache_v1';

const mob = window.innerWidth <= 600;
const NODE_COUNT = mob ? 65 : 120;
const LINK_DIST = mob ? 120 : 180;
const DOT_ALPHA = mob ? .28 : .45;
const LINE_ALPHA = mob ? .20 : .32;
const SPEED = mob ? .4 : .6;
const SCARE_RADIUS = mob ? 70 : 110;
const SCARE_FORCE = mob ? .012 : .018;
const MAX_SPEED = mob ? 0.9 : 1.15;
