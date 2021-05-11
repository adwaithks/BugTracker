import React, { useContext } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import { ParticipantsContext } from '../context/ParticipantsContext';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import styles from './EachParticipant.module.scss';


function EachParticipant({ notifySuccess, notifyError, refreshData, projectId, person, index }) {

  const [role, setRole] = React.useState(null);
  const [participantEdit, setParticipantEdit] = React.useState(false);
  const { myPermission, participantState, setParticipantState } = useContext(ParticipantsContext);

  const roles = [
  {
    value: 'triager',
    label: 'Triager'
  },
    {
    value: 'engineer',
    label: 'Engineer'
  },
  {
    value: 'projectlead',
    label: 'Project Lead'
  }
  ]

  const editParticipants = async (user, newRole) => {
    const bodyData = {
      id: projectId,
      user: user,
      newRole: newRole
    }

    const res = await fetch('http://localhost:3000/api/editParticipants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)

    });
    const response = await res.json();
    if (response) {
      refreshData();
    }
  }

  const handleDelete = async (deletePerson: any, index: any) => {
    //console.log('passed')
    //console.log(deletePerson)
    if (deletePerson.permission === 'admin') {
      window.alert('Author of the project cannot be removed!')
      return
    }
    if (myPermission.permission == 'admin' || myPermission.permission == 'projectlead') {
      console.log(participantState);
      console.log(participantState[index]);
      console.log(participantState[index] = {})
      console.log(participantState)
      const bodyData = {
        projectId: projectId,
        deletename: deletePerson.name,
        deleteid: deletePerson._id
      }

      const res = await fetch(`http://localhost:3000/api/removeParticipant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)

      });
      const response = await res.json();
      if (response) {
        notifySuccess(response.comment);
        console.log('refreshing');
        refreshData();
      }
    } else {
      notifyError(' Unexpected Error !');
      refreshData();
      return;
    }
  }


  return (
    <div className={styles.eachParticipantBox} key={index}>
      <input className={styles.eachParticipantTextField} disabled={true} value={person.name} />
      <select className={styles.roleSelect} disabled={!participantEdit} onChange={(e) => {
        setRole(e.target.value)
      }}>
        {
          roles.map(option => (
            <option className={styles.roleSelect} value={option.value} selected={(person.permission === option.value) ? true : false}>{person.permission === 'admin' ? 'Admin' : option.label}</option>
          ))
        }
      </select>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '50px'
      }}>
        {
          (person.name !== myPermission.name && person.permission != 'admin' && (myPermission.permission === 'projectlead' || myPermission.permission === 'admin')) ?

            participantEdit ? (
              <>
                <CheckIcon className={styles.checkIcon} style={{ cursor: 'pointer' }} onClick={(e) => {
                  setParticipantEdit(!participantEdit);
                  editParticipants(participantState[index], role);
                }} />

              </>
            ) : (
              <>
                <EditIcon className={styles.editIcon} style={{ cursor: 'pointer' }} onClick={() => {
                  setParticipantEdit(!participantEdit)
                }} />
                <DeleteForeverIcon className={styles.deleteIcon} style={{ cursor: 'pointer' }} onClick={() => {
                  console.log(participantState)
                  console.log(participantState[index])
                  handleDelete(participantState[index], index);
                }} />
              </>
            )
            :
            null
        }
      </div>
    </div>
  )
}

export default EachParticipant;
