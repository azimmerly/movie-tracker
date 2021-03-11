import React from "react";
import List from "@material-ui/core/List";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

import MovieSearchItem from "../MovieSearchItem";
import useInputState from "../../hooks/useInputState";
import searchMovieSVG from "../../assets/searchMovie.svg";
import useStyles from "./style";

function MovieSearch({
  findMovie,
  addMovie,
  movieList,
  searchedMovies,
  setSearchedMovies,
  searchModalActive,
  setSearchModalActive,
}) {
  const classes = useStyles();
  const [movie, setMovie, resetInput] = useInputState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (movie) {
      findMovie(movie);
    }
  };

  const resetModal = () => {
    setSearchModalActive();
    setSearchedMovies([]);
    resetInput();
  };

  return (
    <Modal
      open={searchModalActive}
      onClose={resetModal}
      className={classes.modal}
    >
      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            fullWidth
            value={movie}
            onChange={setMovie}
            variant="outlined"
            placeholder="Pulp Fiction"
            label="Search for a movie"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSubmit}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
        <List className={classes.list}>
          {searchedMovies.length ? (
            searchedMovies.map((movie) => (
              <MovieSearchItem
                key={movie.id}
                movie={movie}
                addMovie={addMovie}
                movieList={movieList}
                setSearchModalActive={setSearchModalActive}
                resetInput={resetInput}
              />
            ))
          ) : (
            <div className={classes.svgContainer}>
              <img
                src={searchMovieSVG}
                alt="search movie"
                className={classes.searchMovieSvg}
              />
            </div>
          )}
        </List>
      </Paper>
    </Modal>
  );
}

export default MovieSearch;
