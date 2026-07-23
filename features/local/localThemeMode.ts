const THEME_MODE_KEY = "theme-mode";

export type ThemeMode = "light" | "dark";

export const setLocalThemeMode = (value: ThemeMode) =>
    localStorage.setItem(THEME_MODE_KEY, value);

export const getLocalThemeMode = (): ThemeMode => {
    const mode = localStorage.getItem(THEME_MODE_KEY);

    if (!mode) {
        setLocalThemeMode('light');
        return 'light'
    }

    return mode as ThemeMode;
}