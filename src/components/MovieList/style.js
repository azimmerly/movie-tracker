import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  list: {
    padding: "0",
    marginBottom: "4rem",

    "& > *:not(:last-child)": {
      marginBottom: "1rem",
    },
  },

  buttonSection: {
    marginBottom: "1.5rem",

    "& > *": {
      marginBottom: "0.5rem",
    },

    "& > *:not(:last-child)": {
      marginRight: "0.5rem",
    },
  },

  floatingButton: {
    position: "fixed",
    right: "clamp(1rem, 3vw, 2rem)",
    bottom: "clamp(1rem, 3vw, 2rem)",
  },

  getStartedSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  getStartedText: {
    marginTop: "clamp(1rem, 4vw, 3rem)",
    marginBottom: "1rem",
  },

  getStartedSvg: {
    width: "clamp(20rem, 25vw, 30rem)",
    padding: "2rem",
  },
});

export default useStyles;
