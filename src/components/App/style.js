import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { red, deepPurple } from "@material-ui/core/colors";

let theme = createMuiTheme({
  palette: {
    primary: {
      main: red[400],
    },

    secondary: {
      main: deepPurple[400],
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
