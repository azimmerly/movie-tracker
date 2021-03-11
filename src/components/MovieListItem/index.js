import React, { useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";

import MovieListItemDetail from "../MovieListItemDetail";
import useToggleState from "../../hooks/useToggleState";
import useStyles from "./style";

function MovieListItem({ movie, removeMovie, updateMovie }) {
  const classes = useStyles();

  const [modalActive, setModalActive] = useToggleState(false);
  const [isWatched, setIsWatched] = useToggleState(movie.isWatched);
  const [isFavorite, setIsFavorite] = useToggleState(movie.isFavorite);

  useEffect(() => {
    updateMovie(movie.id, isWatched, isFavorite);
  }, [isWatched, isFavorite]);

  return (
    <>
      <Card className={classes.card}>
        <Hidden xsDown>
          <img
            src={`https://image.tmdb.org/t/p/w500/${movie.image}`}
            alt={movie.title}
            className={classes.movieImage}
            draggable={false}
          />
        </Hidden>
        <div className={classes.cardInfo}>
          <CardHeader
            className={classes.movieTitle}
            title={movie.title}
            subheader={`${movie.year} - ${movie.genres}`}
          />
          <FormGroup row>
            <FormControlLabel
              label="Watched"
              control={
                <Checkbox
                  color="primary"
                  name="watched"
                  checked={isWatched}
                  onChange={setIsWatched}
                  className={classes.checkBox}
                />
              }
            />
            <FormControlLabel
              label="Favorite"
              control={
                <Checkbox
                  color="primary"
                  name="favorite"
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                  checked={isFavorite}
                  onChange={setIsFavorite}
                  className={classes.checkBox}
                />
              }
            />
          </FormGroup>
          <CardActions className={classes.cardActions}>
            <Button
              color="primary"
              variant="outlined"
              size="small"
              onClick={setModalActive}
            >
              More Info
            </Button>
            <Button
              color="secondary"
              variant="outlined"
              size="small"
              onClick={() => removeMovie(movie.id)}
            >
              Remove
            </Button>
          </CardActions>
        </div>
        <DragIndicatorIcon
          fontSize="large"
          color="disabled"
          className={classes.dragIndicator}
        />
      </Card>
      <MovieListItemDetail
        movie={movie}
        modalActive={modalActive}
        setModalActive={setModalActive}
      />
    </>
  );
}

export default MovieListItem;
