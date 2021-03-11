import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },

  titleText: {
    marginLeft: "0.5rem",
    cursor: "pointer",
    fontFamily: "Righteous, cursive",
  },

  navLink: {
    color: "white",
    textDecoration: "none",
  },
});

export default useStyles;
