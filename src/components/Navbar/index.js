import React from "react";
import { useLocation, useHistory, Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import useStyles from "./style";

function Navbar() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <div className={classes.title}>
          <Typography
            variant="h5"
            className={classes.titleText}
            onClick={() => history.push("/")}
          >
            Movie Tracker
          </Typography>
        </div>
        {location.pathname !== "/" && (
          <Link to="/" className={classes.navLink}>
            <Button color="inherit" startIcon={<ArrowBackIcon />}>
              Go Back
            </Button>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
