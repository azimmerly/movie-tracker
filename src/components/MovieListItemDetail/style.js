import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    position: "absolute",
    maxHeight: "80vh",
    width: "clamp(15rem, 90vw, 40rem)",
    padding: "clamp(1.25rem, 5vw, 2rem)",
    boxShadow: "0.2rem 0.4rem 1.2rem rgba(0, 0, 0, 0.2)",
    overflowY: "auto",
    border: "none",
    outline: "none",
    display: "flex",
    flexDirection: "column",
  },

  cardHeader: {
    padding: "1.5rem 0 1.5rem 0",
    textAlign: "center",
  },

  cardBody: {
    textAlign: "justify",
  },

  cardActions: {
    diplay: "flex",
    justifyContent: "center",
    marginTop: "1rem",
  },

  movieImage: {
    height: "15rem",
    borderRadius: "0.3rem",
    alignSelf: "center",
  },
});

export default useStyles;
