import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";

import useStyles from "./style";

function MovieListTitle({ isEditing, setIsEditing, movieList, setMovieList }) {
  const classes = useStyles();
  const [title, setTitle] = useState(movieList.title);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.length) return;
    setMovieList({ ...movieList, title: title });
    setIsEditing();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setTitle(movieList.title);
    setIsEditing();
  };

  return (
    <>
      {isEditing ? (
        <form onSubmit={handleSubmit} className={classes.form}>
          <TextField
            autoFocus
            fullWidth
            color="primary"
            variant="outlined"
            label="List Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && handleCancel(e)}
            className={classes.textField}
          />
          <ButtonGroup variant="outlined">
            <Button
              color="primary"
              disabled={!title.length}
              onClick={handleSubmit}
            >
              Update
            </Button>
            <Button color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </ButtonGroup>
        </form>
      ) : (
        <Typography variant="h3" className={classes.titleText}>
          {title}
        </Typography>
      )}
    </>
  );
}

export default MovieListTitle;
