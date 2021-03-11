import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { useHistory, useRouteMatch } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Fab from "@material-ui/core/Fab";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import MovieSearch from "../MovieSearch";
import MovieListTitle from "../MovieListTitle";
import MovieListItem from "../MovieListItem";
import useToggleState from "../../hooks/useToggleState";
import addMovieSVG from "../../assets/addMovie.svg";
import useStyles from "./style";

function MovieList({
  addCollection,
  findCollection,
  updateCollection,
  moviedb,
}) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  let currentCollection = findCollection(match.params.id);

  const [movieList, setMovieList] = useState(
    currentCollection || { id: uuid(), title: "✨ New Movie List", movies: [] }
  );

  const [searchedMovies, setSearchedMovies] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useToggleState(false);
  const [searchModalActive, setSearchModalActive] = useToggleState(false);
  const [isEditing, setIsEditing] = useToggleState(false);

  const findMovie = async (movieTitle) => {
    const res = await moviedb.searchMovie({
      query: movieTitle,
      include_adult: false,
    });
    let returnedMovies = res.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      image: movie.poster_path,
      year: movie.release_date?.substring(0, 4),
    }));
    returnedMovies = returnedMovies
      .filter((movie) => movie.image !== null)
      .filter((movie) => movie.title.length < 50)
      .slice(0, 15);
    setSearchedMovies(returnedMovies);
  };

  const addMovie = async (movieId) => {
    const res = await moviedb.movieInfo({ id: movieId });
    const movie = {
      id: res.id,
      title: res.title,
      summary: res.overview,
      image: res.poster_path,
      year: res.release_date?.substring(0, 4),
      genres: res.genres
        .map((genre) => genre.name)
        .slice(0, 3)
        .join(", "),
      isWatched: false,
      isFavorite: false,
    };
    setMovieList({ ...movieList, movies: [...movieList.movies, movie] });
    setSnackbarOpen();
    setSearchedMovies([]);
  };

  const updateMovie = (movieId, isWatched, isFavorite) => {
    const updatedMovies = movieList.movies.map((movie) =>
      movie.id === movieId
        ? { ...movie, isWatched: isWatched, isFavorite: isFavorite }
        : movie
    );
    setMovieList({ ...movieList, movies: updatedMovies });
  };

  const removeMovie = (movieId) => {
    setMovieList({
      ...movieList,
      movies: movieList.movies.filter((movie) => movie.id !== movieId),
    });
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = [...movieList.movies];
    const [reorderedMovie] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedMovie);
    setMovieList({ ...movieList, movies: items });
  };

  useEffect(() => {
    if (movieList.movies.length && !currentCollection) {
      history.push(`/list/${movieList.id}`);
      addCollection(movieList);
    }
    if (movieList.movies.length && currentCollection) {
      updateCollection(movieList.id, movieList.title, movieList.movies);
    }
  }, [movieList]);

  return (
    <>
      <MovieListTitle
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        movieList={movieList}
        setMovieList={setMovieList}
      />
      <div className={classes.buttonSection}>
        <Button
          color="primary"
          variant="contained"
          onClick={setSearchModalActive}
          startIcon={<AddCircleOutlineIcon />}
        >
          Add Movie
        </Button>
        <Button
          color="default"
          variant="contained"
          onClick={setIsEditing}
          startIcon={<EditIcon />}
        >
          Edit List Name
        </Button>
        <Button
          color="default"
          variant="contained"
          onClick={() => history.push("/")}
          startIcon={<ArrowBackIcon />}
        >
          View All Lists
        </Button>
      </div>
      <>
        <MovieSearch
          addMovie={addMovie}
          findMovie={findMovie}
          movieList={movieList}
          searchModalActive={searchModalActive}
          setSearchModalActive={setSearchModalActive}
          searchedMovies={searchedMovies}
          setSearchedMovies={setSearchedMovies}
        />
        {movieList.movies.length ? (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="movies">
              {(provided) => (
                <List
                  className={classes.list}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {movieList.movies.map((movie, i) => (
                    <Draggable
                      key={movie.id}
                      draggableId={movie.id.toString()}
                      index={i}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <MovieListItem
                            movie={movie}
                            removeMovie={removeMovie}
                            updateMovie={updateMovie}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className={classes.getStartedSection}>
            <Typography
              variant="h6"
              align="center"
              className={classes.getStartedText}
            >
              Add a movie to your list to get started!
            </Typography>
            <img
              src={addMovieSVG}
              alt="add movie"
              className={classes.getStartedSvg}
            />
          </div>
        )}
        <Fab
          color="primary"
          aria-label="Create New List"
          onClick={setSearchModalActive}
          className={classes.floatingButton}
        >
          <AddIcon />
        </Fab>
      </>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        autoHideDuration={4000}
        open={snackbarOpen}
        onClose={setSnackbarOpen}
        message="Movie added to your list!"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={setSnackbarOpen}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}

export default MovieList;
