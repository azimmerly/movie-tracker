import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";

import useStyles from "./style";

function MovieListItemDetail({ modalActive, setModalActive, movie }) {
  const classes = useStyles();

  return (
    <Modal
      open={modalActive}
      onClose={setModalActive}
      className={classes.modal}
    >
      <Card className={classes.card}>
        <img
          src={`https://image.tmdb.org/t/p/w500/${movie.image}`}
          alt={movie.title}
          className={classes.movieImage}
          draggable={false}
        />
        <CardHeader
          title={movie.title}
          subheader={`${movie.year} - ${movie.genres}`}
          className={classes.cardHeader}
        />
        <Typography variant="body1" className={classes.cardBody}>
          {movie.summary}
        </Typography>
        <CardActions className={classes.cardActions}>
          <Button color="secondary" variant="outlined" onClick={setModalActive}>
            Close
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
}

export default MovieListItemDetail;
