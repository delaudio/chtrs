use chtrs::app::App;

mod support;
use support::{assert_snapshot, render_snapshot, sample_app};

#[test]
fn snapshot_empty_app() {
    let app = App::new(vec![]);
    assert_snapshot("empty-app", render_snapshot(&app, 80, 24));
}

#[test]
fn snapshot_default_view() {
    let app = sample_app();
    assert_snapshot("default-view", render_snapshot(&app, 80, 24));
}

#[test]
fn snapshot_navigation_next() {
    let mut app = sample_app();
    app.next();
    assert_snapshot("navigation-next", render_snapshot(&app, 80, 24));
}

#[test]
fn snapshot_search_filter_active() {
    let mut app = sample_app();
    app.filter = "gi".to_string();
    assert_snapshot("search-filter-active", render_snapshot(&app, 80, 24));
}

#[test]
fn snapshot_responsive_compact() {
    let app = sample_app();
    assert_snapshot("responsive-compact", render_snapshot(&app, 50, 15));
}

#[test]
fn snapshot_responsive_wide() {
    let app = sample_app();
    assert_snapshot("responsive-wide", render_snapshot(&app, 120, 30));
}
