import { ConfigProvider, theme as antTheme } from "antd";
import esES from "antd/locale/es_ES";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useTheme } from "./shared/hooks/useTheme";
import AppRouter from "./routing/AppRouter";

const DARK_TOKENS = {
  colorPrimary: "#19B38C",
  colorBgBase: "#111315",
  colorBgContainer: "#171A1D",
  colorBgElevated: "#252A31",
  colorBorder: "#2E353D",
  colorText: "#F3F5F7",
  colorTextSecondary: "#A3ADB8",
  colorTextTertiary: "#7D8794",
  colorError: "#E06C75",
  colorWarning: "#F4B860",
  colorInfo: "#68A4FF",
  colorSuccess: "#19B38C",
  borderRadius: 8,
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

const LIGHT_TOKENS = {
  colorPrimary: "#0E8F71",
  colorBgBase: "#F6F8FA",
  colorBgContainer: "#FFFFFF",
  colorBgElevated: "#E9EEF3",
  colorBorder: "#D7DEE6",
  colorText: "#151A20",
  colorTextSecondary: "#4E5A67",
  colorTextTertiary: "#758190",
  colorError: "#C85C66",
  colorWarning: "#D99A33",
  colorInfo: "#3D7BE0",
  colorSuccess: "#0E8F71",
  borderRadius: 8,
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

const ThemedApp: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ConfigProvider
      locale={esES}
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: isDark ? DARK_TOKENS : LIGHT_TOKENS,
      }}
    >
      <AppRouter />
    </ConfigProvider>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  );
};

export default App;
