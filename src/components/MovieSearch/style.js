import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  paper: {
    position: "absolute",
    height: "clamp(20rem, 60vh, 40rem)",
    width: "clamp(15rem, 90vw, 40rem)",
    padding: "clamp(1.25rem, 5vw, 2rem)",
    overflowX: "hidden",
    overflowY: "auto",
    border: "none",
    outline: "none",
  },

  list: {
    marginTop: "1rem",
  },

  svgContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2rem",
  },

  searchMovieSvg: {
    width: "clamp(20rem, 25vw, 30rem)",
    padding: "2rem",
  },
});

export default useStyles;
