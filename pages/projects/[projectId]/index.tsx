import React from 'react';
import LayoutFrame from '../../components/LayoutFrame';
import styles from './index.module.scss';
import Modal from 'react-modal';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Markdown from 'markdown-to-jsx';
import { useRouter } from 'next/router';
import CloseIcon from '@material-ui/icons/Close';
import { ToastContainer, toast, Id } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SyncLoader from "react-spinners/SyncLoader";
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

function index({ data, participants, tickets, projectId, openTickets, closedTickets }) {

    const roles = [{
        value: 'Engineer',
        label: 'Engineer'
    },
    {
        value: 'Project Lead',
        label: 'Project Lead'
    },
    {
        value: 'Triager',
        label: 'Triager'
    }
    ]

    const searchHandler = (e) => {
        if (ticketCatActive == 'open') {
            setOpenTickets(tempopenTicketsState.filter(function (each) {
                return each.title.toLowerCase().match(e.toLowerCase());
            }));
        } else {
            setClosedTickets(tempclosedTicketsState.filter(function (each) {
                return each.title.toLowerCase().match(e.toLowerCase());
            }));
        }
    }

    const notifySuccess = (message) => toast.success(message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const notifyError = (message) => toast.error(message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });


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

    interface myPermission {
        _id?: any,
        name?: String,
        permission?: String
    }

    const [openTicketsState, setOpenTickets] = React.useState(openTickets);
    const [closedTicketsState, setClosedTickets] = React.useState(closedTickets);
    const [tempopenTicketsState, tempsetOpenTickets] = React.useState(openTickets);
    const [tempclosedTicketsState, tempsetClosedTickets] = React.useState(closedTickets);
    const [isLoading, setisLoading] = React.useState(false);
    const [editorContent, setEditorContent] = React.useState('');
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [ticketTitle, setTicketTitle] = React.useState('');
    const [newPartPermission, setNewPartPermission] = React.useState('Triager');
    const [newPartName, setNewPartName] = React.useState('');
    const [previewTabActive, setPreviewTabActive] = React.useState(false);
    const [dataState, setDataState] = React.useState(data);
    const [role, setRole] = React.useState('Triager');
    const [participantEdit, setParticipantEdit] = React.useState(false);
    const [ticketCatActive, setTicketcatactive] = React.useState('open');
    const [addParticipantModal, setAddParticipantModal] = React.useState(false);
    const [myPermission, setMyPermission] = React.useState<myPermission>({});
    const [chipData, setChipData] = React.useState([]);
    const [participantState, setParticipantState] = React.useState([]);
    const [username, setUsername] = React.useState('');
    const [usernameList, setusernameList] = React.useState([]);
    const [me, setMe] = React.useState<meInterface>({});


    React.useEffect(() => {
        const main = async () => {
            setisLoading(true)
            const token = window.localStorage.getItem('accessToken');
            const response3 = await fetch(`http://localhost:3000/api/me`, {
                method: 'GET',
                headers: {
                    'accessToken': token
                }
            });
            const res = await response3.json();
            setUsername(res.username);
            // setChipData(participants);
            console.log(participants)
            setParticipantState(participants);
            participants.map(each => {
                if (each.name === res.username) {
                    setMyPermission(each);
                    console.log('my permission: ')
                    console.log(each)
                }
            })
            console.log(participants);
            setMe(res);

            const response2 = await fetch(`http://localhost:3000/api/getUsers`, {
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
            setisLoading(false)
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




    const editParticipants = async (user, newRole) => {
        //setAddParticipantModal(false);
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

    const addParticipant = async (particName, permission) => {
        const bodyData = {
            name: particName,
            permission: permission.split(" ").join("").toLowerCase(),
            projectId: projectId,
            me: me.username
        }

        console.log(bodyData);

        const res = await fetch(`http://localhost:3000/api/addParticipant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });
        const resjson = await res.json();
        if (res.status !== 200) {
            notifyError('Unexpected error Occured !');
        } else {
            notifySuccess(particName + ' was added to the project !');
        }
    }

    const handleDelete = async (deleteName: any) => {
        if (me.in_projects == undefined ? null : me.in_projects.includes(projectId)) {
            setChipData(chipData.filter((eachName) => {
                return eachName != deleteName;
            }));
            const bodyData = {
                projectId: projectId,
                removed: deleteName,
                me: me.username
            }

            const res = await fetch(`http://localhost:3000/api/removeParticipant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData)

            });
            const resjson = await res.json();
            if (res.status != 200) {
                notifyError(resjson.message)
            } else {
                notifyError(deleteName + ' was removed !')
            }

        } else {
            notifyError(deleteName + ' was not removed !')
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


        const res = await fetch(`http://localhost:3000/api/createNewTicket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });
        notifySuccess('New ticket created !');

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

                <SyncLoader color={'#fff9'} loading={isLoading} size={20} css={
                    `position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, 50%);
                    z-index: 9000;
                    .dashboard {
                        background-color: rgba(42, 42, 42, 0.8)
                    }
                    `
                } />

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
                                    <h3>{each.name}</h3>
                                </div>
                            ))
                        }
                    </div>
                    <div className={styles.projectDesc}>
                        <Markdown>{data.description}</Markdown>
                    </div>
                </div>
                <div className={styles.searchContainer}>
                    <input placeholder="Search" type="text" onChange={(e) => {
                        searchHandler(e.target.value);
                    }} />
                </div>
                <Modal
                    className={styles.editParticipantModal}
                    isOpen={addParticipantModal}
                    onRequestClose={() => {
                        //setChipData(participants);
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
                                    //setChipData(participants);
                                    setAddParticipantModal(!addParticipantModal);
                                }}>
                                    <CloseIcon />
                                </div>
                            </div>
                            <div className="participants-info">
                                {
                                    participantState.map((person, index) => (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            border: 'red solid 1px',
                                            justifyContent: 'space-evenly',
                                            backgroundColor: 'rgba(255, 255, 255, 0.705)',
                                            borderRadius: '5px'
                                        }} key={index}>
                                            <TextField disabled={true} defaultValue={person.name} label="Username" />

                                            <TextField
                                                disabled={!participantEdit}
                                                select
                                                label="Permission"
                                                value={role}
                                                onChange={(e) => {
                                                    setRole(e.target.value)
                                                }}
                                            >
                                                {
                                                    roles.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                width: '50px'
                                            }}>
                                                {
                                                    (person.name !== myPermission.name && (myPermission.permission === 'projectlead' || myPermission.permission === 'admin')) ?
                                                        participantEdit ? (
                                                            <>
                                                                <CheckIcon style={{ cursor: 'pointer' }} onClick={(e) => {
                                                                    setParticipantEdit(!participantEdit);
                                                                    console.log(person._id);
                                                                    console.log(participants[index]);
                                                                    console.log(role)
                                                                    editParticipants(participants[index], role);
                                                                }} />
                                                                <DeleteForeverIcon style={{ cursor: 'pointer' }} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EditIcon style={{ cursor: 'pointer' }} onClick={() => {
                                                                    setParticipantEdit(!participantEdit)
                                                                }} />
                                                                <DeleteForeverIcon style={{ cursor: 'pointer' }} />
                                                            </>
                                                        )
                                                        :
                                                        null
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                                {/***
                                                        participantEdit ? (
                                                            <>
                                                                <CheckIcon style={{ cursor: 'pointer' }} onClick={(e) => {
                                                                    setParticipantEdit(!participantEdit);
                                                                    console.log(person._id);
                                                                    console.log(participants[index]);
                                                                    console.log(role)
                                                                    editParticipants(participants[index], role);
                                                                }} />
                                                                <DeleteForeverIcon style={{ cursor: 'pointer' }} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EditIcon style={{ cursor: 'pointer' }} onClick={() => {
                                                                    setParticipantEdit(!participantEdit)
                                                                }} />
                                                                <DeleteForeverIcon style={{ cursor: 'pointer' }} />
                                                            </>
                                                        )
 */}
                            </div>
                            <div style={{
                                borderRadius: '5px',
                                border: 'darkgray solid 1px',
                                display: 'flex',
                                marginTop: '50px',
                                marginBottom: '50px',
                                alignItems: 'center',
                                justifyContent: 'space-evenly'
                            }}>
                                <TextField label="Username" value={newPartName} onChange={(e) => {
                                    setNewPartName(e.target.value);
                                }} />

                                <TextField
                                    select
                                    label="Permission"
                                    value={newPartPermission}
                                    onChange={(e) => {
                                        setNewPartPermission(e.target.value);
                                    }}
                                >
                                    {
                                        roles.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                                <button onClick={() => {
                                    addParticipant(newPartName, newPartPermission);
                                    setParticipantState([...participantState, {
                                        name: newPartName,
                                        permission: newPartPermission,
                                        _id: 123
                                    }])
                                }} disabled={newPartName ? false : true} style={{
                                    display: 'flex',
                                    cursor: 'pointer',
                                    width: '100px',
                                    borderRadius: '5px',
                                    backgroundColor: newPartName ? 'blue' : 'gray',
                                    color: newPartName ? 'white' : 'darkgray',
                                    fontSize: '20px',
                                    height: '37px',
                                    outline: 'none',
                                    border: 'none',
                                    justifyContent: 'space-evenly',
                                    alignItems: 'center'
                                }}><AddIcon /> Add</button>
                            </div>

                            <div className={styles.editParticipantButton}>
                                <button onClick={() => {
                                    setAddParticipantModal(false);
                                }}>Save</button>
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
                            <div className={ticketCatActive == 'open' ? styles.ticketcategActive : styles.ticketcateg} onClick={(e) => {
                                setTicketcatactive('open');
                            }}><h4>Open</h4></div>
                            <div className={ticketCatActive == 'closed' ? styles.ticketcategActive : styles.ticketcateg} onClick={(e) => {
                                setTicketcatactive('closed');
                            }}><h4>Closed</h4></div>

                        </div>
                    </div>

                    <div className={styles.ticketDetails}>
                        {
                            ticketCatActive === 'open' ? (
                                <div className={styles.ticketList}>
                                    {
                                        openTicketsState.map((each: any, id: number) => (
                                            each.currentStatus != 'closed' ? (
                                                <div onClick={() => {
                                                    setisLoading(true)

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
                                                                    display: 'flex',
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
                                                                            display: 'flex',
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
                                        closedTicketsState.map((each: any, id: number) => (
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
            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </LayoutFrame>
    )
}

export async function getServerSideProps(context) {

    var closedTickets = [];
    var openTickets = [];
    const projectId = context.req.__NEXT_INIT_QUERY.projectId ? context.req.__NEXT_INIT_QUERY.projectId : context.req.url.split('/')[2];
    const response = await fetch(`http://localhost:3000/api/getProject`, {
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

    const response2 = await fetch(`http://localhost:3000/api/getProjectTickets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: projectId
        })
    });

    const data2 = await response2.json();
    data2.map(eachTicket => {
        if (eachTicket.currentStatus === 'closed') {
            closedTickets.push(eachTicket)
        } else {
            openTickets.push(eachTicket)
        }
    });


    return {
        props: {
            data: data,
            participants: participants,
            tickets: data2,
            projectId: projectId,
            openTickets: openTickets,
            closedTickets: closedTickets
        }
    }
}

export default index;
