import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      900: "#1a365d",
      800: "#153e75",
      700: "#2a69ac",
    },
  },
  fonts: {
    heading: "Poppins",
    body: "Poppins",
  },
/*   components: {
    Button: {
      baseStyle: {
        borderRadius: "none",
      },
      sizes: {
        small: {
          px: 5,
          h: "50px",
          fontSize: "20px",
        },
        medium: {
          px: 7,
          h: "60px",
          fontSize: "25px",
        },
        large: {
          px: 8,
          h: "70px",
          fontSize: "30px",
          borderRadius: "10px",
        },
      },
      variants: {
        primary: {
          bg: "primary",
          color: "#fff",
        },
        secondary: {
          bg: "secondary",
          color: "#fff",
        },
        ghost: {
          bg: "transparent",
          border: "1px solid red",
        },
        primaryGhost: {
          bg: "transparent",
          border: "1px solid",
          borderColor: "primary",
        },
        secondaryGhost: {
          bg: "transparent",
          border: "1px solid",
          borderColor: "secondary",
          _hover: {
            color: "#fff",
            bg: "#BB1415",
          },
        },
      },
    },

    Heading: {
      baseStyle: {
        fontFamily: "Inter",
        fontWeight: "600",
      },
      sizes: {
        small: {
          fontSize: "20px",
        },
        medium: { fontSize: "25px" },
        large: { fontSize: "30px" },
      },
    },
  }, */
});

export default theme;
