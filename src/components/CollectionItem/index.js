import React from "react";
import { useHistory } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import useStyles from "./style";

function CollectionItem({ list, handleClick, handleDelete }) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Card>
      <CardActionArea onClick={(e) => handleClick(e, list.id)}>
        <CardContent className={classes.cardContent}>
          <GridList cols={3} spacing={0}>
            {list.movies.slice(0, 3).map((movie) => (
              <GridListTile key={movie.id}>
                <img
                  alt={movie.title}
                  src={`https://image.tmdb.org/t/p/w400/${movie.image}`}
                  draggable={false}
                />
              </GridListTile>
            ))}
          </GridList>
          <Typography variant="h5" className={classes.listName}>
            {list.title}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.cardActions}>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={() => history.push(`/list/${list.id}`)}
        >
          View List
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          onClick={(e) => handleDelete(e, list.id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

export default CollectionItem;
