import { extendTheme, IconButtonProps, ThemeConfig } from "@chakra-ui/react";
import { createBreakpoints, mode } from "@chakra-ui/theme-tools";
import type { GlobalStyleProps, Styles } from "@chakra-ui/theme-tools";
import "@fontsource/inter";
const fonts = { mono: `'Menlo', monospace` };
const light = {
  bg: {
    primary: "#eff0f5",
    secondary: "#ffffff",
    inset: "#e2e4e8",
    input: "rgba(65,67,78,0.12)",
  },
  text: {
    primary: "#050505",
    secondary: "#2f3037",
    tertiary: "#525560",
    quarternary: "#9194a1",
    placeholder: "rgba(82,85,96,0.5)",
    onPrimary: "#ffffff",
  },
  // ...
};

const dark = {
  bg: {
    primary: "#050505",
    secondary: "#111111",
    inset: "#111111",
    input: "rgba(191,193,201,0.12)",
  },
  text: {
    primary: "#fbfbfc",
    secondary: "#e3e4e8",
    tertiary: "#a9abb6",
    quarternary: "#6c6f7e",
    placeholder: "rgba(145,148,161,0.5)",
    onPrimary: "#050505",
  },
  // ...
};

const defaultTheme = {
  fontSizes: [
    "14px", // 0
    "16px", // 1
    "18px", // 2
    "22px", // 3
    "26px", // 4
    "32px", // 5
    "40px", // 6
  ],
  fontWeights: {
    body: 400,
    subheading: 500,
    link: 600,
    bold: 700,
    heading: 800,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.3,
    code: 1.6,
  },
  // ...
};

// export const lightTheme = { ...defaultTheme, ...light }
// export const darkTheme = { ...defaultTheme, ...dark }

const breakpoints = createBreakpoints({
  sm: "40em",
  md: "52em",
  lg: "64em",
  xl: "80em",
});

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const styles: Styles = {
  global: (props) => ({
    colors: {
      brand: {
        100: "#f7fafc",
        // ...
        900: "#1a202c",
      },
    },
    body: {
      fontFamily: "Inter",
      color: mode("gray.500", "gray.200")(props),
      bg: mode("white", "gray.800")(props),
    },
  }),
};

const components = {
  Button: {
    // setup light/dark mode component defaults
    baseStyle: (props: GlobalStyleProps) => ({
      color: mode("gray.900", "gray.200")(props),
      bg: mode("white", "gray.800")(props),
      _focus: { boxShadow: "none" },
    }),
    variants: {
      "myRed": {
        bg: "red.300",
        color: 'gray.800',
        _hover: {
          bg: "red.600",
          color: 'white'
        }
      },
    },
  },
};

const theme = extendTheme({
  components,
  styles,

  config,
});

export default theme;
