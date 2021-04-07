import React from 'react';
import LayoutFrame from '../../components/LayoutFrame';
import styles from './index.module.scss';
import Modal from 'react-modal';
import Chip from '@material-ui/core/Chip';
import GroupIcon from '@material-ui/icons/Group';
import Markdown from 'markdown-to-jsx';
import { useRouter } from 'next/router';
import CloseIcon from '@material-ui/icons/Close';

function index({ data, participants, tickets, projectId }) {

    interface meInterface {
        created_at?: string,
        email?: string,
        in_projects?: [string],
        leading_projects?: [string],
        password?: string,
        raised_tickets?: [string],
        roles?: [string],
        updatedAt?: string,
        username?: string,
        __v?: number,
        _id?: string
    }

    const [editorContent, setEditorContent] = React.useState('');
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [ticketTitle, setTicketTitle] = React.useState('');
    const [previewTabActive, setPreviewTabActive] = React.useState(false);
    const [dataState, setDataState] = React.useState(data);
    const [ticketCatActive, setTicketcatactive] = React.useState('open');
    const [addParticipantModal, setAddParticipantModal] = React.useState(false);
    const [chipData, setChipData] = React.useState([]);
    const [participantName, setParticipantName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [usernameList, setusernameList] = React.useState([]);
    const [me, setMe] = React.useState<meInterface>({});


    React.useEffect(() => {
        const main = async() => {
            const token = window.localStorage.getItem('accessToken');
            const response3 = await fetch(`http://issuetracker.herokuapp.com/api/me`, {
                method: 'GET',
                headers: {
                    'accessToken': token
                }
            });
            const res = await response3.json();
            setUsername(res.username);
            setChipData(participants);
            setMe(res);

            const response2 = await fetch(`http://issuetracker.herokuapp.com/api/getUsers`, {
                method: 'POST',
                headers: {
                    'accessToken': token
                },
                body: JSON.stringify({
                    projectId: projectId
                })
            });
            const res2 = await response2.json();
            setusernameList(res2);
            
        }
        main();
    }, [modalIsOpen]);

    var router = useRouter();

    const refreshData = () => {
        router.replace(router.asPath);
    }
  

    
    var colors = {
        'new': ['greenyellow', 'black'],
        'New': ['greenyellow', 'black'],
        'open': ['green', 'white'],
        'discussion': ['gray', 'white'],
        'bug': ['red', 'white'],
        'critical': ['darkred', 'white'],
        'help wanted': ['lightgreen', 'black'],
        'needs example': ['yellow', 'black'],
        'documentation': ['blue', 'white'],
        'Documentation': ['blue', 'white'],
        'triaged': ['orange', 'black'],
        'closed': ['red', 'black'],
        'triage': ['orange', 'black'],
        'close': ['red', 'black'],
        'default': ['white', 'black'],
        'resolved': ['greenyellow', 'black'],
        'Resolved': ['greenyellow', 'black'],
        'unresolved': ['darkred', 'black'],
        'Unresolved': ['darkred', 'black'],
        'pending': ['purple', 'white'],
        'Pending': ['purple', 'white'],
        'accepted': ['green', 'white'],
        'Accepted': ['green', 'white']
    }




     const editParticipants = async () => {
        setAddParticipantModal(false);
        refreshData();
    }

   const addParticipant = async (particName) => {
        const bodyData = {
            name: particName,
            projectId: projectId,
            me: me.username
        }

        const res = await fetch(`http://issuetracker.herokuapp.com/api/addParticipant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });
        const resjson = await res.json();
        console.log(resjson.status)
            if (res.status === 403) {
                window.alert(resjson.message)
            }
    }

    const handleDelete = async (deleteName: any) => {      
        if  (me.in_projects == undefined ? null : me.in_projects.includes(projectId)) {
            setChipData(chipData.filter((eachName) => {
                return eachName != deleteName;
            }));
            const bodyData = {
                projectId: projectId,
                removed: deleteName,
                me: me.username
            }
    
            const res = await fetch(`http://issuetracker.herokuapp.com/api/removeParticipant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData)
    
            });
            const resjson = await res.json();
            if (resjson.status === 403) {
                alert(resjson.message)
            }
            
        } else {
            console.log('not removable')
            return;
        }

        
    }

    const createNewTicket = async () => {
        const bodyData = {
            title: ticketTitle,
            description: editorContent,
            project: dataState.title,
            author: username,
            participants: data.participants,
            projectId: projectId
        }

        
        const res = await fetch(`http://issuetracker.herokuapp.com/api/createNewTicket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });
        setIsOpen(false);
        refreshData();
    }

    return (
        <LayoutFrame>
            <div className={styles.currentProject}>
                <div className={styles.createNewTicketContainer}>
                    <div className={styles.createButton}>
                        <button onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(!modalIsOpen);
                        }}>Create New Ticket</button>
                    </div>
                    <div className={styles.createButton}>
                        <button onClick={(e) => {
                            e.preventDefault();
                            setAddParticipantModal(!addParticipantModal);
                        }}>Add Participants</button>
                    </div>
                </div>
                <div className={styles.projectDetailsContainer}>
                    <div className={styles.projectHead}>
                        <h5>#{data._id}</h5>
                        <h1>{data.title}</h1>
                        <h4>Created By {data.author}</h4>
                    </div>
                    <div className={styles.projectParts}>
                        <h4>Participants:</h4>
                        {
                            participants.map((each, id) => (
                                <div key={id} className={styles.partAvatar}>
                                    <h3>{each}</h3>
                                </div>
                            ))
                        }
                    </div>
                    <div className={styles.projectDesc}>
                        <Markdown>{data.description}</Markdown>
                    </div>
                </div>
                <Modal
                    className={styles.editParticipantModal}
                    isOpen={addParticipantModal}
                    onRequestClose={() => {
                        setChipData(participants);
                        setAddParticipantModal(!addParticipantModal)
                    }}
                    style={{
                        overlay: {
                            background: 'rgba(27, 27, 27, 0.9)'
                        }
                    }}
                >
                    {

                        <>
                            <div className={styles.modalCloseIconContainer}>
                                <div className={styles.modalCloseIcon} onClick={() => {
                                    setChipData(participants);
                                    setAddParticipantModal(!addParticipantModal);
                                }}>
                                    <CloseIcon />
                                </div>
                            </div>
                            <div>
                                <div className={styles.chipContainer}>
                                    <div className={styles.participantHeading}>
                                        <GroupIcon />
                                        <h5>Participants</h5>
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
                                                addParticipant(participantName);
                                                setChipData(() => [...chipData, participantName]);
                                                setParticipantName('');
                                            }}>Add</button>
                                            {/*<FormControl className={styles.formControl}>
                                                <InputLabel className={styles.inputLabel}>Username</InputLabel>
                                                <Select
                                                labelId="demo-simple-select-label"
                                                className={styles.selectLabel}
                                                value={participantName}
                                                onChange={(event) => {
                                                    setParticipantName(event.target.value);
                                                }}
                                                >
                                                    {
                                                        usernameList.map((each,id) => (
                                                            <MenuItem key={id} value={each}>{each}</MenuItem>
                                                        ))
                                                    }
                                                
                                                </Select>
                                            </FormControl>

                                            <FormControl className={styles.formControl}>
                                                <InputLabel className={styles.inputLabel}>Permission</InputLabel>
                                                <Select
                                                labelId="demo-simple-select-label"
                                                className={styles.selectLabel}
                                                value={permission}
                                                onChange={(event) => {
                                                    setPermission(event.target.value);
                                                }}
                                                >
                                                    
                                                            <MenuItem value="Admin">Admin</MenuItem>
                                                            <MenuItem value="Triager">Triager</MenuItem>
                                                            <MenuItem value="Viewer">Viewer</MenuItem>

                                                    
                                                
                                                </Select>
                                            </FormControl>

                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                addParticipant(participantName);
                                                setChipData(() => [...chipData, participantName]);
                                                setPermission('');
                                                setParticipantName('');
                                            }}>Add</button>*/}

                                        </div>

                                         <div className={styles.chipContainer}>
                                                {
                                                    chipData.map((each, key) => (
                                                        <Chip
                                                            key={key}
                                                            label={each}
                                                            onDelete={() => {
                                                                each == username ? undefined : handleDelete(each)
                                                                
                                                            }}
                                                            className={styles.chip}
                                                        />
                                                    ))
                                                }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*<div className={styles.allParticipants}>
                                <div className={styles.allParticipantsHeadContainer}>
                                    <h2>Available Participants</h2>
                                </div>
                                {
                                    usernameList.map(eachUser => (
                                        <div onClick={(e) => {
                                            console.log(e.target.innerText)
                                            addParticipant(e.target.innerText);
                                            setChipData(() => [...chipData, e.target.innerText]);
                                            setParticipantName('');
                                        }} key={eachUser} className={styles.eachUsernameContainer}>
                                            <AddCircleOutlineIcon className={styles.circleOutlineIcon} />
                                            <h4 className={styles.eachUsername}>{eachUser}</h4>
                                        </div>
                                    ))
                                }
                            </div>*/}

                            <div className={styles.editParticipantButton}>
                                <button onClick={editParticipants}>Save</button>
                            </div>


                        </>

                    }

                </Modal>

                <Modal
                    className={styles.newTicketModal}
                    isOpen={modalIsOpen}
                    onRequestClose={() => {
                        setIsOpen(!modalIsOpen)
                    }}
                    style={{
                        overlay: {
                            background: 'rgba(27, 27, 27, 0.8)'
                        }
                    }}
                >
                    {

                        <>
                            <div className={styles.modalCloseIconContainer}>
                                <div className={styles.previewTabContainer}>
                                    {
                                        previewTabActive ? (
                                            <>
                                                <div className={styles.writeTab} onClick={() => {
                                                    setPreviewTabActive(!previewTabActive)
                                                }}><h4>Write</h4></div>
                                                <div className={styles.previewTabActive}><h4>Preview</h4></div>
                                            </>
                                        ) : (
                                            <>
                                                <div className={styles.writeTabActive}><h4>Write</h4></div>
                                                <div className={styles.previewTab} onClick={() => {
                                                    setPreviewTabActive(!previewTabActive)
                                                }}><h4>Preview</h4></div>
                                            </>
                                        )
                                    }

                                </div>
                                <div className={styles.modalCloseIcon} onClick={() => {
                                    setIsOpen(!modalIsOpen)
                                }}>
                                    <CloseIcon />
                                </div>
                            </div>
                            {
                                previewTabActive ? (
                                    <div className={styles.previewSection}>
                                        {
                                            editorContent ? (
                                                <>
                                                    <h1 className={styles.previewTitle}>{ticketTitle}</h1>
                                                    <Markdown>
                                                        {editorContent}
                                                    </Markdown>
                                                </>
                                            ) : (
                                                <h2>Nothing to preview!</h2>
                                            )
                                        }
                                    </div>
                                ) : (
                                    <div className={styles.newTicketInfo}>
                                        <div className={styles.ticketTitle}>
                                            <div>
                                                <label htmlFor="">Title</label>
                                            </div>
                                            <input placeholder="Title" value={ticketTitle} type="text" onChange={(e) => {
                                                setTicketTitle(e.target.value);
                                            }} />
                                        </div>
                                        <div className={styles.description}>
                                            <div>
                                                <label htmlFor="">Description</label>
                                            </div>
                                            <textarea placeholder="Description (Markdown supported)" className={styles.editor} value={editorContent} onChange={(e) => {
                                                setEditorContent(e.target.value);
                                            }}>
                                            </textarea>
                                        </div>
                                        <div className={styles.createTicketButton}>
                                            <button onClick={createNewTicket}>Create a new ticket</button>
                                        </div>

                                    </div>
                                )
                            }

                        </>

                    }

                </Modal>
                <div className={styles.projectTicketContainer}>
                    <div className={styles.openpendingclosedContainer}>
                        <div className={styles.openpendingClosedInnerContainer}>
                            <div className={ticketCatActive=='open' ? styles.ticketcategActive : styles.ticketcateg} onClick={(e) => {
                                setTicketcatactive('open');
                            }}><h4>Open</h4></div>
                            <div className={ticketCatActive=='closed' ? styles.ticketcategActive : styles.ticketcateg} onClick={(e) => {
                                setTicketcatactive('closed');
                            }}><h4>Closed</h4></div>

                        </div>
                    </div>
                    
                    <div className={styles.ticketDetails}>
                        {
                            ticketCatActive === 'open' ? (
                                <div className={styles.ticketList}>
                                    {
                                        tickets.map((each: any, id: number) => (
                                            each.currentStatus != 'closed' ? (
                                                <div onClick={() => {
                                                    router.push(
                                                        '/projects/[projectId]/ticket/[ticketId]',
                                                        `/projects/${each.projectId}/ticket/${each._id}`
                                                        )
                                                }} key={id} className={styles.eachTicket}>
                                                    <div className={styles.ticketListUpper}>
                                                        <div className={styles.ticketHeading}>
                                                            <h3>{each.title}</h3>
                                                            <div className={styles.ticketTags}>
                                                            <h5 style={{
                                                                paddingLeft: '25px',
                                                                paddingRight: '25px',
                                                                display:'flex',
                                                                alignItems: 'center',
                                                                padding: '4px',
                                                                border: 'black solid 1px',
                                                                borderRadius: '10px',
                                                                backgroundColor: colors[each.currentStatus ? each.currentStatus.toLowerCase() : 'default'][0] || 'orange',
                                                                color: colors[each.currentStatus ? each.currentStatus.toLowerCase() : 'default'][1] || 'white'
                                                            }}>{each.currentStatus}</h5>
                                                                {
                                                                    each.tags.map((each, keyId) => (
                                                                        <h5 key={keyId} style={{
                                                                            paddingLeft: '25px',
                                                                            display:'flex',
                                                                            alignItems: 'center',
                                                                            paddingRight: '25px',
                                                                            padding: '3px',
                                                                            borderRadius: '10px',
                                                                            marginRight: '5px',
                                                                            marginLeft: '5px',
                                                                            backgroundColor: colors[each.toLowerCase()] ? colors[each.toLowerCase()][0] : 'orange',
                                                                            color: colors[each.toLowerCase()] ? colors[each.toLowerCase()][1] : 'black'
                                                                        }}>{each}</h5>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={styles.ticketListLower}>
                                                        <div className={styles.ticketId}>
                                                            <h5>#{each._id}</h5>
                                                        </div>
                                                        <div className={styles.reportDate}>
                                                            <h5>Opened On {each.created_at} by {each.author}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                null
                                            )
                                        ))
                                    }
                                </div>
                            ) : ticketCatActive === 'closed' ? (
                                <div className={styles.ticketList}>
                                    {
                                        tickets.map((each: any, id: number) => (
                                            each.currentStatus == 'closed' ? (
                                                <div onClick={() => {
                                                    router.push(
                                                        '/projects/[projectId]/ticket/[ticketId]',
                                                        `/projects/${projectId}/ticket/${each._id}`
                                                        );
                                                }} key={id} className={styles.eachTicket}>
                                                    <div className={styles.ticketListUpper}>
                                                        <div className={styles.ticketHeading}>
                                                            <h3>{each.title}</h3>
                                                            <div className={styles.ticketTags}>
                                                                <h5 style={{
                                                                    paddingLeft: '10px',
                                                                    paddingRight: '10px',
                                                                    padding: '2px',
                                                                    marginRight: '5px',
                                                                    marginLeft: '5px',
                                                                    borderRadius: '5px',
                                                                    backgroundColor: 'red',
                                                                    color: 'white'
                                                                }}>{each.currentStatus}</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={styles.ticketListLower}>
                                                        <div className={styles.ticketId}>
                                                            <h5>#{each._id}</h5>
                                                        </div>
                                                        <div className={styles.reportDate}>
                                                            <h5>Opened On {each.created_at} by {each.author}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                null
                                            )


                                        ))
                                    }
                                </div>
                            ) : (
                                <div className={styles.ticketList}>
                                    {
                                        tickets.map((each: any, id: number) => (
                                            each.currentStatus == 'Pending' ? (
                                                <div onClick={() => {
                                                    router.push(
                                                        '/projects/[projectId]/ticket/[ticketId]',
                                                        `/projects/${projectId}/ticket/${each._id}`
                                                        );
                                                }} key={id} className={styles.eachTicket}>
                                                    <div className={styles.ticketListUpper}>
                                                        <div className={styles.ticketHeading}>
                                                            <h3>{each.title}</h3>
                                                            <div className={styles.ticketTags}>
                                                                <h5>{each.currentStatus}</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={styles.ticketListLower}>
                                                        <div className={styles.ticketId}>
                                                            <h5>#{each._id}</h5>
                                                        </div>
                                                        <div className={styles.reportDate}>
                                                            <h5>Opened On {each.created_at} by {each.author}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                null
                                            )


                                        ))
                                    }
                                </div>
                            )
                        }

                    </div>
                </div>
            </div>
        </LayoutFrame>
    )
}

export async function getServerSideProps(context) {
    const projectId = context.req.__NEXT_INIT_QUERY.projectId ? context.req.__NEXT_INIT_QUERY.projectId : context.req.url.split('/')[2];
    const response = await fetch(`http://issuetracker.herokuapp.com/api/getProject`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: projectId
        })
    });

    const data = await response.json();
    const participants = data.participants;

    const response2 = await fetch(`http://issuetracker.herokuapp.com/api/getProjectTickets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: projectId
        })
    });

    const data2 = await response2.json();

    
    

    return {
        props: {
            data: data,
            participants: participants,
            tickets: data2,
            projectId: projectId,
        }
    }
}

export default index;
