export type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "planner:theme";

export function resolveIsDark(preference: ThemePreference): boolean {
  if (preference === "dark") return true;
  if (preference === "light") return false;
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyTheme(preference: ThemePreference) {
  document.documentElement.classList.toggle("dark", resolveIsDark(preference));
}

/**
 * layout.tsx의 <head>에 인라인으로 심어서, 리액트가 하이드레이션되기 전에
 * 저장된 테마를 즉시 적용해 화면 깜빡임(FOUC)을 막는다.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var pref = localStorage.getItem("${THEME_STORAGE_KEY}") || "system";
    var isDark = pref === "dark" || (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;
