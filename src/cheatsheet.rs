use serde::Deserialize;
use std::collections::HashSet;
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Deserialize)]
pub struct CheatSheet {
    pub name: String,
    pub description: String,
    pub sections: Vec<Section>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct Section {
    pub title: String,
    pub items: Vec<Item>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct Item {
    pub key: String,
    pub desc: String,
}

impl CheatSheet {
    pub fn load_all(local_dir: &str) -> Vec<Self> {
        let mut sheets = Vec::new();
        let mut dirs_to_search: Vec<PathBuf> = Vec::new();

        // 1. Local directory (e.g. "./cheat-sheets")
        dirs_to_search.push(PathBuf::from(local_dir));
        if local_dir.contains('_') {
            dirs_to_search.push(PathBuf::from(local_dir.replace('_', "-")));
        } else if local_dir.contains('-') {
            dirs_to_search.push(PathBuf::from(local_dir.replace('-', "_")));
        }

        // 2. Global user config directory ~/.config/chtrs/cheat-sheets and ~/.config/chtrs
        if let Some(home) = std::env::var_os("HOME") {
            let home_path = PathBuf::from(home);
            dirs_to_search.push(home_path.join(".config").join("chtrs").join("cheat-sheets"));
            dirs_to_search.push(home_path.join(".config").join("chtrs"));
        }

        // 3. Directory relative to executable
        if let Ok(exe_path) = std::env::current_exe() {
            if let Some(exe_dir) = exe_path.parent() {
                dirs_to_search.push(exe_dir.join("cheat-sheets"));
            }
        }

        let mut loaded_names = HashSet::new();

        for d in dirs_to_search {
            if let Ok(entries) = fs::read_dir(&d) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if let Some(ext) = path.extension() {
                        if ext == "yaml" || ext == "yml" {
                            if let Ok(content) = fs::read_to_string(&path) {
                                if let Ok(sheet) = serde_yaml::from_str::<CheatSheet>(&content) {
                                    if !loaded_names.contains(&sheet.name) {
                                        loaded_names.insert(sheet.name.clone());
                                        sheets.push(sheet);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        sheets.sort_by(|a, b| a.name.cmp(&b.name));
        sheets
    }
}
