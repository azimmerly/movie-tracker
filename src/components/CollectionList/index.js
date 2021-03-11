import React from "react";
import { useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import CollectionItem from "../CollectionItem";
import useStyles from "./style";

function CollectionList({ collection, removeCollection }) {
  const history = useHistory();
  const classes = useStyles();

  const handleDelete = (e, listId) => {
    e.preventDefault();
    removeCollection(listId);
  };

  const handleClick = (e, listId) => {
    e.stopPropagation();
    history.push(`/list/${listId}`);
  };

  return (
    <div>
      <Typography variant="h3" className={classes.heading}>
        My Movie Lists
      </Typography>
      <Button
        color="primary"
        variant="contained"
        className={classes.button}
        onClick={() => history.push("/new")}
        startIcon={<AddCircleOutlineIcon />}
      >
        Create New List
      </Button>
      <Grid container spacing={2} className={classes.grid}>
        {collection.map((list) => (
          <Grid item xs={12} sm={6} md={4} key={list.id}>
            <CollectionItem
              list={list}
              handleDelete={handleDelete}
              handleClick={handleClick}
            />
          </Grid>
        ))}
        <Fab
          color="primary"
          aria-label="Create New List"
          onClick={() => history.push("/new")}
          className={classes.floatingButton}
        >
          <AddIcon />
        </Fab>
      </Grid>
    </div>
  );
}

export default CollectionList;
