import React, { Component } from "react";
import Participant from "./Participant";
import { setParticipants } from "../../../store/actions";
import { store } from "../../../store/store";
import { Grid , Snackbar } from "@material-ui/core";
import ReactDOM from 'react-dom';



class TwilioRoom extends Component {
  constructor(props) {
    super(props);
    const remoteParticipants = Array.from(
      this.props.room.participants.values()
    );
    this.state = {
      remoteParticipants: remoteParticipants,
    };
    remoteParticipants.forEach((participant) => {
      this.addParticipantToStore(participant);
    });
  }

  // Define mount class of the participant.
  componentDidMount() {
    this.props.room.on("participantConnected", (participant) =>
      this.addParticipant(participant)
    );

    this.props.room.on("participantDisconnected", (participant) => {
      this.removeParticipant(participant);
    });
  }

  addParticipantToStore(participant) {
    const participants = store.getState().participants;
    //check if the participant already exists
    if (participants.find((p) => p.identity === participant.identity)) {
      return;
    } else {
      const newParticipants = [...participants];
      newParticipants.push({ identity: participant.identity });
      store.dispatch(setParticipants(newParticipants));
    }
  }

  addParticipant(participant) {
    //Add snackBar.
    console.log(`${participant.identity} has joined the room`);
    //Update participant state.
    this.addParticipantToStore(participant);
    this.setState({
      remoteParticipants: [...this.state.remoteParticipants, participant],
    });
  }

  removeParticipantFromStore(participant) {
    // find and erase participant from state.
    const participants = store
      .getState()
      .participants.filter((p) => p.identity !== participant.identity);
    store.dispatch(setParticipants(participants));
  }

  removeParticipant(participant) {
    //Add snackBar.
    console.log(`${participant.identity} has left the room`);
    this.removeParticipantFromStore(participant);

    //Update participant state.
    this.setState({
      remoteParticipants: this.state.remoteParticipants.filter(
        (p) => p.identity !== participant.identity
      ),
    });
  }

  render() {
    return (
      <>
        <Participant
          key={this.props.room.localParticipant.identity}
          localParticipant
          participant={this.props.room.localParticipant}
        />
        {this.state.remoteParticipants.map((participant) => {
          return (
            <Participant key={participant.identity} participant={participant} />
          );
        })}
      </>
    );
  }
}

export default TwilioRoom;
