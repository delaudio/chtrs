use std::{fs, path::PathBuf};

use chtrs::{
    app::App,
    cheatsheet::{CheatSheet, Item, Section},
    ui::draw,
};
use ratatui::{backend::TestBackend, Terminal};

pub fn sample_app() -> App {
    let git_sheet = CheatSheet {
        name: "git".to_string(),
        description: "Version control system".to_string(),
        sections: vec![
            Section {
                title: "Basics".to_string(),
                items: vec![
                    Item {
                        key: "git status".to_string(),
                        desc: "Show working tree status".to_string(),
                    },
                    Item {
                        key: "git diff".to_string(),
                        desc: "Show changes between commits".to_string(),
                    },
                ],
            },
            Section {
                title: "Branching".to_string(),
                items: vec![Item {
                    key: "git switch -c".to_string(),
                    desc: "Create and switch to new branch".to_string(),
                }],
            },
        ],
    };

    let docker_sheet = CheatSheet {
        name: "docker".to_string(),
        description: "Container platform".to_string(),
        sections: vec![Section {
            title: "Containers".to_string(),
            items: vec![Item {
                key: "docker ps".to_string(),
                desc: "List active containers".to_string(),
            }],
        }],
    };

    App::new(vec![docker_sheet, git_sheet])
}

pub fn render_snapshot(app: &App, width: u16, height: u16) -> String {
    let backend = TestBackend::new(width, height);
    let mut terminal = Terminal::new(backend).expect("test terminal");
    terminal
        .draw(|frame| draw(frame, app))
        .expect("draw frame");
    visualize_status_padding(buffer_text(terminal.backend().buffer()))
}

fn buffer_text(buffer: &ratatui::buffer::Buffer) -> String {
    let mut output = String::new();
    for y in 0..buffer.area.height {
        for x in 0..buffer.area.width {
            output.push_str(buffer[(x, y)].symbol());
        }
        output.push('\n');
    }
    output
}

fn visualize_status_padding(output: String) -> String {
    let mut result = String::new();
    for line in output.lines() {
        let content_end = line.trim_end_matches(' ').len();
        let padding = line.len().saturating_sub(content_end);
        result.push_str(&line[..content_end]);
        result.push_str(&"·".repeat(padding));
        result.push('\n');
    }
    result
}

pub fn assert_snapshot(name: &str, actual: String) {
    let path = snapshot_path(name);
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).expect("create snapshots dir");
    }

    if std::env::var_os("UPDATE_CHTRS_SNAPSHOTS").is_some() {
        fs::write(&path, actual).expect("write snapshot");
        return;
    }

    let expected = fs::read_to_string(&path).unwrap_or_else(|_| {
        panic!("Snapshot file not found: {:?}. Run with UPDATE_CHTRS_SNAPSHOTS=1 cargo test to generate it.", path);
    });

    if actual != expected {
        panic!(
            "Snapshot mismatch for '{name}'\n{}",
            line_diff(&expected, &actual)
        );
    }
}

fn line_diff(expected: &str, actual: &str) -> String {
    let expected = expected.lines().collect::<Vec<_>>();
    let actual = actual.lines().collect::<Vec<_>>();
    let first = (0..expected.len().max(actual.len()))
        .find(|&index| expected.get(index) != actual.get(index))
        .unwrap_or(0);
    let start = first.saturating_sub(2);
    let end = (first + 3).min(expected.len().max(actual.len()));
    let mut diff = format!("First differing line: {}\n", first + 1);
    for index in start..end {
        diff.push_str(&format!(
            "{:>5} - {}\n      + {}\n",
            index + 1,
            expected.get(index).copied().unwrap_or("<missing>"),
            actual.get(index).copied().unwrap_or("<missing>")
        ));
    }
    diff
}

fn snapshot_path(name: &str) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests")
        .join("snapshots")
        .join(format!("{name}.snap"))
}
