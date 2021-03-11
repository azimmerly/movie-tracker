import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  heading: {
    marginTop: "3rem",
    marginBottom: "2rem",
  },

  grid: {
    marginBottom: "4rem",
  },

  button: {
    marginBottom: "2rem",
  },

  floatingButton: {
    position: "fixed",
    right: "clamp(1rem, 3vw, 2rem)",
    bottom: "clamp(1rem, 3vw, 2rem)",
  },
});

export default useStyles;
