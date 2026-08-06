use crate::app::App;
use crossterm::event::{self, Event, KeyCode, KeyEventKind};
use std::time::Duration;

pub fn handle_events(app: &mut App) -> std::io::Result<()> {
    if event::poll(Duration::from_millis(50))? {
        if let Event::Key(key) = event::read()? {
            if key.kind != KeyEventKind::Press {
                return Ok(());
            }
            match key.code {
                KeyCode::Char('q') => app.should_quit = true,
                KeyCode::Char('j') | KeyCode::Down => app.next(),
                KeyCode::Char('k') | KeyCode::Up => app.previous(),
                KeyCode::Char(c) if app.filter.is_empty() && c.is_alphabetic() => {
                    // Start search filtering
                    app.filter.push(c);
                }
                KeyCode::Backspace => {
                    app.filter.pop();
                }
                KeyCode::Esc => {
                    app.filter.clear();
                }
                _ => {}
            }
        }
    }
    Ok(())
}
