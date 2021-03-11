import React from "react";
import { MovieDb } from "moviedb-promise";
import { Switch, Route, Redirect } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";

import MovieList from "../MovieList";
import Navbar from "../Navbar";
import CollectionList from "../CollectionList";
import useLocalStorageState from "../../hooks/useLocalStorageState";
import defaultMovies from "../../defaultMovies";
import theme from "./style";

const moviedb = new MovieDb(process.env.REACT_APP_MOVIEDB_API_KEY);

function App() {
  const [collection, setCollection] = useLocalStorageState(
    "movies",
    defaultMovies
  );

  const findCollection = (listId) => {
    return collection.find((list) => list.id === listId);
  };

  const addCollection = (newList) => {
    setCollection([...collection, newList]);
  };

  const removeCollection = (listId) => {
    setCollection(collection.filter((list) => list.id !== listId));
  };

  const updateCollection = (listId, newTitle, newMovies) => {
    const updatedList = collection.map((list) =>
      list.id === listId
        ? { ...list, title: newTitle, movies: newMovies }
        : list
    );
    setCollection(updatedList);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Container>
        <Switch>
          <Route exact path="/">
            <CollectionList
              collection={collection}
              removeCollection={removeCollection}
            />
          </Route>
          <Route exact path="/new">
            <MovieList
              moviedb={moviedb}
              addCollection={addCollection}
              findCollection={findCollection}
            />
          </Route>
          <Route exact path="/list/:id">
            <MovieList
              moviedb={moviedb}
              updateCollection={updateCollection}
              findCollection={findCollection}
            />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Container>
    </ThemeProvider>
  );
}

export default App;
