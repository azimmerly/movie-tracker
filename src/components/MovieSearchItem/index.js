import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import useStyles from "./style";

function MovieSearchItem({
  movie,
  addMovie,
  setSearchModalActive,
  resetInput,
  movieList,
}) {
  const classes = useStyles();

  const addToList = (id) => {
    addMovie(id);
    setSearchModalActive();
    resetInput();
  };

  return (
    <>
      <ListItem>
        <img
          className={classes.img}
          src={`https://image.tmdb.org/t/p/w200/${movie.image}`}
          alt={movie.title}
          draggable={false}
        />
        <ListItemText primary={movie.title} secondary={movie.year} />
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            color="primary"
            aria-label="add movie"
            onClick={() => addToList(movie.id)}
            disabled={movieList.movies.some(
              (addedMovie) => addedMovie.id === movie.id
            )}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </>
  );
}

export default MovieSearchItem;
