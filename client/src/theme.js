import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      900: "#1a365d",
      800: "#153e75",
      700: "#2a69ac",
      yellow: "#f5d000",
      gold: "#a38b00"
    },
  },
  fonts: {
    heading: "Poppins",
    body: "Poppins",
  },
});

export default theme;
