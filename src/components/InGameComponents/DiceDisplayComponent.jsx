import React from "react";
import { Grid, Paper } from "@mui/material";
import styled from "styled-components";
import { v4 as uuid4 } from "uuid";
import { valueToDiceIcon } from "./utils";

function DiceDisplayComponent(props) {
  let variantClassName = "";
  switch (props.variant) {
    default:
      variantClassName = "big-dice";
      break;
    case "small":
      variantClassName = "small-dice";
      break;
  }

  return (
    <React.Fragment>
      <StyledPaper elevation={3}>
        <div className={variantClassName}>
          <Grid
            container
            justifyContent="center"
            spacing={3}
            direction="column"
          >
            {props.playerName ? <Grid item>{props.playerName}</Grid> : ""}
            <Grid item container justifyContent="center" spacing={3}>
              {props.diceValues
                ? props.diceValues.map((value) => {
                    return (
                      <Grid item key={uuid4()}>
                        {valueToDiceIcon(value)}
                      </Grid>
                    );
                  })
                : ""}
            </Grid>
          </Grid>
        </div>
      </StyledPaper>
    </React.Fragment>
  );
}

const StyledPaper = styled(Paper)`
  .big-dice {
    padding: 2rem;
    font-size: 2rem;
  }
  .small-dice {
    .diceIcon {
      font-size: 1.5rem;
      margin-bottom: 0.3rem;
    }
  }
`;

export default DiceDisplayComponent;
