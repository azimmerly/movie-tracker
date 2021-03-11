import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  form: {
    marginTop: "3rem",
    marginBottom: "2rem",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    alignItems: "center",

    "&>*:not(:last-child)": {
      marginRight: "0.5rem",
    },
  },

  textField: {
    flex: 1,
    minWidth: "18rem",
    marginTop: "0.5rem",
    marginBottom: "0.5rem",
  },

  titleText: {
    marginTop: "3rem",
    marginBottom: "2rem",
  },
});

export default useStyles;
