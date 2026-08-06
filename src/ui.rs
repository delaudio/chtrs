use crate::app::App;
use ratatui::{
    layout::{Constraint, Direction, Layout, Margin},
    style::{Color, Modifier, Style},
    text::{Line, Span},
    widgets::{Block, Borders, Clear, List, ListItem, Paragraph, Wrap},
    Frame,
};

pub fn draw(f: &mut Frame, app: &App) {
    let chunks = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([Constraint::Percentage(25), Constraint::Percentage(75)])
        .split(f.area());

    // --- Pannello sinistro: lista programmi ---
    let items: Vec<ListItem> = app
        .filtered_sheets()
        .iter()
        .enumerate()
        .map(|(i, sheet)| {
            let style = if i == app.selected {
                Style::default()
                    .fg(Color::Black)
                    .bg(Color::Cyan)
                    .add_modifier(Modifier::BOLD)
            } else {
                Style::default().fg(Color::White)
            };
            ListItem::new(sheet.name.clone()).style(style)
        })
        .collect();

    let list = List::new(items).block(Block::default().borders(Borders::ALL).title("Programs"));
    f.render_widget(list, chunks[0]);

    // --- Pannello destro: cheat sheet attivo ---
    if let Some(sheet) = app.current_sheet() {
        let mut text = Vec::new();

        // Titolo
        text.push(Line::from(vec![
            Span::styled(
                &sheet.name,
                Style::default()
                    .fg(Color::Yellow)
                    .add_modifier(Modifier::BOLD),
            ),
            Span::raw(" — "),
            Span::styled(&sheet.description, Style::default().fg(Color::Gray)),
        ]));
        text.push(Line::from(""));

        // Sezioni
        for section in &sheet.sections {
            text.push(Line::from(Span::styled(
                &section.title,
                Style::default()
                    .fg(Color::Green)
                    .add_modifier(Modifier::BOLD | Modifier::UNDERLINED),
            )));
            for item in &section.items {
                let line = Line::from(vec![
                    Span::styled(
                        format!("  {:<15}", item.key),
                        Style::default().fg(Color::Cyan),
                    ),
                    Span::raw(&item.desc),
                ]);
                text.push(line);
            }
            text.push(Line::from(""));
        }

        let paragraph = Paragraph::new(text)
            .block(Block::default().borders(Borders::ALL).title("Cheat Sheet"))
            .wrap(Wrap { trim: true });
        f.render_widget(paragraph, chunks[1]);
    } else {
        let empty = Paragraph::new("No cheat sheet selected")
            .block(Block::default().borders(Borders::ALL).title("Cheat Sheet"));
        f.render_widget(empty, chunks[1]);
    }

    // --- Barra di ricerca in sovrimpressione (se attiva) ---
    if !app.filter.is_empty() {
        let area = f.area().inner(Margin::new(10, 10));
        let search = Paragraph::new(format!("/{}", app.filter))
            .block(Block::default().borders(Borders::ALL).title("Search"));
        f.render_widget(Clear, area); // pulisce lo sfondo
        f.render_widget(search, area);
    }
}
