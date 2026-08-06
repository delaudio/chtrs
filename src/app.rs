use crate::cheatsheet::CheatSheet;

pub struct App {
    pub sheets: Vec<CheatSheet>,
    pub selected: usize, // currently selected cheat sheet index
    pub filter: String,  // search filter text
    pub should_quit: bool,
}

impl App {
    pub fn new(sheets: Vec<CheatSheet>) -> Self {
        Self {
            sheets,
            selected: 0,
            filter: String::new(),
            should_quit: false,
        }
    }

    pub fn next(&mut self) {
        if !self.sheets.is_empty() {
            self.selected = (self.selected + 1) % self.sheets.len();
        }
    }

    pub fn previous(&mut self) {
        if !self.sheets.is_empty() {
            self.selected = (self.selected + self.sheets.len() - 1) % self.sheets.len();
        }
    }

    pub fn filtered_sheets(&self) -> Vec<&CheatSheet> {
        if self.filter.is_empty() {
            return self.sheets.iter().collect();
        }
        let f = self.filter.to_lowercase();
        self.sheets
            .iter()
            .filter(|s| s.name.to_lowercase().contains(&f))
            .collect()
    }

    pub fn current_sheet(&self) -> Option<&CheatSheet> {
        let filtered = self.filtered_sheets();
        filtered.get(self.selected).copied()
    }
}
