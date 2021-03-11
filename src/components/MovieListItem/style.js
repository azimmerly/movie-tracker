import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  card: {
    display: "flex",
  },

  cardInfo: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    padding: "clamp(0.75rem, 2vw, 1rem)",
  },

  movieTitle: {
    padding: "0",
  },

  movieImage: {
    height: "clamp(8rem, 25vw, 11rem)",
  },

  cardContent: {
    padding: "0",
  },

  cardActions: {
    flex: "1",
    padding: "0",
    marginTop: "clamp(0.5rem, 2vw, 1rem)",
    alignItems: "flex-end",
  },

  checkBox: {
    paddingRight: "clamp(0.25rem, 2vw, 0.5rem)",
  },

  dragIndicator: {
    marginRight: "clamp(0.5rem, 2vw, 1rem)",
    marginTop: "clamp(0.5rem, 2vw, 1rem)",
  },
});

export default useStyles;
