import React, { createContext } from 'react';

export const ParticipantsContext = createContext(null);

const ParticipantsProvider = ({ children }) => {
  const [myPermission, setMyPermission] = React.useState({});
  const [participantState, setParticipantState] = React.useState([]);

  return (
    <ParticipantsContext.Provider value={{
      myPermission,
      setMyPermission,
      participantState,
      setParticipantState
    }}>{children}</ParticipantsContext.Provider>
  )
}


export default ParticipantsProvider;