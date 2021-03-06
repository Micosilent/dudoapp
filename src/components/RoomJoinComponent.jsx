import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import {
  TextField,
  Grid,
  Button,
  Paper,
  Dialog,
  DialogContentText,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LogoComponent from "./LogoComponent";
import { useDispatch, useSelector } from "react-redux";
import { WebSocketContext } from "../WebSocket";
import { updateUserName } from "../actions/gameDataActions";
import { changeToNewRoom, updateKickStatus } from "../actions/appStatusActions";

function RoomJoinComponent() {
  const ws = useContext(WebSocketContext);
  const userUuid = useSelector((state) => state.gameData.userId);
  const dispatch = useDispatch();
  let error = useSelector((state) => state.gameData.error);
  let userKicked = useSelector((state) => state.appStatus.userKicked);
  let [userName, setUserName] = useState(
    useSelector((state) => state.gameData.name)
  );
  let [roomID, setRoomID] = useState("");
  let [roomPassword, setRoomPassword] = useState("");
  let [passwordHelperText, setPaswordHelperText] = useState(
    "Looks like this room has a password"
  );
  let [roomIdHelperText, setRoomIdHelperText] = useState("");
  let [userNameHelperText, setUsernameHelperText] = useState("");
  let [triedToJoin, setTriedToJoin] = useState(false);
  let [gameNotFound, setGameNotFound] = useState(false);
  let [duplicateUser, setDuplicateUser] = useState(false);

  const userNameHandler = (e) => {
    setUserName(e.target.value);
  };

  const roomIDHandler = (e) => {
    setRoomID(e.target.value.replace(/\s/g, ""));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      joinRoomHandler();
    }
  };

  const joinRoomHandler = (e) => {
    dispatch(updateUserName(userName));
    ws.sendJoinRequest(userUuid, userName, roomID, roomPassword);
    if (roomPassword !== "") {
      setTriedToJoin(true);
      setRoomPassword("");
      setPaswordHelperText("Password was not correct, try again");
    }
  };

  const passwordHandler = (e) => {
    setRoomPassword(e.target.value);
  };

  const passwordInputDisplayHandler = () => {
    return (
      <Grid item>
        <TextField
          id="passwordInput"
          label="Password "
          type="password"
          value={roomPassword}
          onChange={passwordHandler}
          helperText={passwordHelperText}
          error={triedToJoin}
        />
      </Grid>
    );
  };

  const handleNewRoom = () => {
    dispatch(updateUserName(userName));
    dispatch(changeToNewRoom());
  };

  const handleClose = () => {
    dispatch(updateKickStatus(false));
  };

  useEffect(() => {
    if (error === "Game is full") {
      setRoomIdHelperText("This room is full");
      setGameNotFound(true);
    }
    if (error === "Game not found") {
      setRoomIdHelperText("Game does not exist");
      setGameNotFound(true);
    }
    if (error === "" || error === "Incorrect password, try again") {
      setRoomIdHelperText("");
      setGameNotFound(false);
    }
    if (error === "User name is already under use") {
      setUsernameHelperText("User name is already in use");
      setDuplicateUser(true);
    }
  }, [error]);

  return (
    <React.Fragment>
      <StyledContainer>
        <Dialog open={userKicked} onClose={handleClose}>
          <DialogContent>
            <DialogContentText id="modal-modal-description" sx={{ mt: 2 }}>
              You have been kicked by the admin of the room
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        <StyledGrid container>
          <Grid item s={12} sm={10} md={8} lg={6}>
            <StyledPaper>
              <LogoComponent />
              <Grid
                container
                direction="column"
                justifyContent="center"
                spacing={5}
                className="textFields"
              >
                <Grid item>
                  <TextField
                    id="nameInput"
                    label="Username"
                    value={userName}
                    onChange={userNameHandler}
                    error={duplicateUser}
                    helperText={userNameHelperText}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    id="roomInput"
                    label="RoomID "
                    value={roomID}
                    helperText={roomIdHelperText}
                    error={gameNotFound}
                    onChange={roomIDHandler}
                    onKeyPress={handleKeyPress}
                    autoFocus
                  />
                </Grid>
                {error === "Incorrect password, try again"
                  ? passwordInputDisplayHandler()
                  : ""}
                <Grid item>
                  <Button
                    variant="contained"
                    fullWidth={true}
                    onClick={joinRoomHandler}
                  >
                    Join Room
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    fullWidth={true}
                    onClick={handleNewRoom}
                  >
                    Create Room
                  </Button>
                </Grid>
              </Grid>
            </StyledPaper>
          </Grid>
        </StyledGrid>
      </StyledContainer>
    </React.Fragment>
  );
}
const StyledPaper = styled(Paper)`
  padding: 2rem;
`;
const StyledContainer = styled.div`
  padding: 2rem;
  margin-top: 10vh;
`;
const StyledGrid = styled(Grid)`
  justify-content: center;
`;
export default RoomJoinComponent;
