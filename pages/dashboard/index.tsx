import React from 'react';
import styles from './index.module.scss';
import Modal from 'react-modal';
import LayoutFrame from '../components/LayoutFrame';
import Chip from '@material-ui/core/Chip';
import { Doughnut, Bar } from 'react-chartjs-2';
import CloseIcon from '@material-ui/icons/Close';
import fetch from 'isomorphic-unfetch';

const index = () => {

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [editorContent, setEditorContent] = React.useState('');
    const [projectTitle, setProjectTitle] = React.useState('');
    const [chipData, setChipData] = React.useState(['adwaith']);
    const [participantName, setParticipantName] = React.useState('');
    const [issuesReceivedGraphData, setIssuesReceivedGraphData] = React.useState();

    const handleDelete = (deleteName: any) => () => {
        setChipData(chipData.filter((eachName) => {
            return eachName != deleteName;
        }));
    };

    const createNewProject = async () => {
        const data = {
            title: projectTitle,
            description: editorContent,
            participants: chipData
        }
        setIsOpen(false);
        await fetch('http://localhost:3000/api/createNewProject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <LayoutFrame>
            <div className={styles.newTicketContainer}>
                <div className={styles.newTicketBtn}>
                    <button onClick={() => {
                        setIsOpen(!modalIsOpen);
                    }}>Create A New Project</button>
                </div>
            </div>
            <Modal
                className={styles.newProjectModal}
                isOpen={modalIsOpen}
                onRequestClose={() => {
                    setIsOpen(!modalIsOpen)
                }}
                styles={{
                    overlay: {
                        background: 'rgb(0, 0, 0)'
                    }
                }
                }
            >
                {

                    <>
                        <div className={styles.modalCloseIconContainer}>
                            <div className={styles.modalCloseIcon} onClick={() => {
                                setIsOpen(!modalIsOpen)
                            }}>
                                <CloseIcon />
                            </div>
                        </div>

                        <div className={styles.newProjectInfo}>
                            <div className={styles.projectTitle}>
                                <div className={styles.projectTitleLabel}>
                                    <label htmlFor="">Title</label>
                                </div>
                                <input placeholder="Title" type="text" value={projectTitle} onChange={(e) => {
                                    setProjectTitle(e.target.value);
                                }} />
                            </div>
                            <div className={styles.projectDesc}>
                                <div className={styles.projectDescLabel}>
                                    <label htmlFor="">Description</label>
                                </div>
                                <textarea placeholder="Description (Markdown supported)" className={styles.editor} value={editorContent} onChange={(e) => {
                                    console.log(e.target.value);
                                    setEditorContent(e.target.value);
                                }}>
                                </textarea>
                            </div>

                            <div className={styles.participantsContainer}>
                                <div className={styles.participantLabel}>
                                    <label htmlFor="">Project Participants</label>
                                </div>
                                <div className={styles.participantSelect}>


                                    <input type="text" placeholder="Enter name" value={participantName} onChange={(e) => {
                                        setParticipantName(e.target.value);
                                    }} />

                                    <button onClick={(e) => {
                                        e.preventDefault();
                                        setChipData(() => [...chipData, participantName]);
                                        setParticipantName('');
                                    }}>Add</button>
                                </div>
                                <div className={styles.chipContainer}>
                                    {
                                        chipData.map((each, key) => (
                                            <Chip
                                                key={key}
                                                label={each}
                                                onDelete={each === 'adwaith' ? undefined : handleDelete(each)}
                                                className={styles.chip}
                                            />
                                        ))
                                    }
                                </div>
                                <div className={styles.newProjectCreateButton}>
                                    <button onClick={createNewProject}>Create New Project</button>
                                </div>
                            </div>
                        </div>


                    </>

                }

            </Modal>
            <div className={styles.ticketAnalyse}>
                <div className={styles.newTickets}>
                    <div className={styles.blue}></div>
                    <div className={styles.newTicketsContent}>
                        <h1>50</h1>
                        <h3>New Tickets</h3>
                    </div>
                </div>

                <div className={styles.openTickets}>
                    <div className={styles.purple}></div>
                    <div className={styles.openTicketsContent}>
                        <h1>50</h1>
                        <h3>Open Tickets</h3>
                    </div>
                </div>

                <div className={styles.resolvedTickets}>
                    <div className={styles.green}></div>
                    <div className={styles.resolvedTicketsContent}>
                        <h1>50</h1>
                        <h3>Resolved Tickets</h3>
                    </div>
                </div>

                <div className={styles.unresolvedTickets}>
                    <div className={styles.red}></div>
                    <div className={styles.unresolvedTicketsContent}>
                        <h1>50</h1>
                        <h3>UnResolved Tickets</h3>
                    </div>
                </div>

            </div>
            <div className={styles.ticketGraphs}>
                <div className={styles.overallTicketTypes}>
                    <div className={styles.overallTicketTypesHeading}>
                        <h3>Overall Ticket Type</h3>
                        {/*<div className={styles.overallTicketTypesRatings}>
                            <div className={styles.excellent}>
                                <div className={styles.roundgreen}></div>
                                <h4>Excellent</h4>
                            </div>
                            <div className={styles.good}>
                                <div className={styles.roundorange}></div>
                                <h4>Good</h4>
                            </div>
                            <div className={styles.fair}>
                                <div className={styles.roundred}></div>
                                <h4>Fair</h4>
                            </div>
            </div>*/}
                    </div>
                    <div className={styles.overallTicketTypesGraph}>
                        <Bar data={{
                            labels: ['New', 'Open', 'Resolved', 'Unresolved'],
                            datasets: [{
                                label: 'overall issues',
                                data: [12, 23, 34, 1],
                                backgroundColor: [
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 99, 132, 0.2)',

                                ],
                                borderColor: [
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 99, 132, 1)',

                                ],
                                borderWidth: 2
                            }]
                        }}
                        />
                    </div>
                </div>
                <div className={styles.issuesReceived}>
                    <div className={styles.issuesReceivedHeading}>
                        <h3>Issues Received</h3>
                    </div>
                    <div className={styles.issuesReceivedCount}>
                        <h1>163</h1>
                    </div>
                    <div className={styles.issuesReceivedGraph}>
                        <Doughnut data={{
                            labels: ['Critical', 'High', 'Medium', 'Low', 'Spam'],
                            datasets: [{
                                label: 'issues received',
                                data: [12, 19, 3, 5, 1],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                ],
                                borderWidth: 2
                            }]
                        }} />
                    </div>
                </div>
            </div>
        </LayoutFrame>
    )
}

export default index;
