import React, { useContext } from 'react';
import LayoutFrame from '../../../components/LayoutFrame';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import { ParticipantsContext } from '../../../context/ParticipantsContext';
import { UserContext } from '../../../context/UserContext';
import Markdown from 'markdown-to-jsx';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import CloseIcon from '@material-ui/icons/Close';
import { ToastContainer, toast, Id } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EachParticipant from '../../../components/EachParticipant';
import SyncLoader from "react-spinners/SyncLoader";
import AddIcon from '@material-ui/icons/Add';

const index = ({ data, participants, tickets, projectId, openTickets, closedTickets }) => {

    const roles = [
        {
            value: 'Triager',
            label: 'Triager'
        },    
        {
        value: 'Engineer',
        label: 'Engineer'
        },
        {
            value: 'Project Lead',
            label: 'Project Lead'
        },
    ]

    const { myPermission, setMyPermission, participantState, setParticipantState } = useContext(ParticipantsContext);
    const { email, setEmail } = useContext(UserContext);

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


    const [openTicketsState, setOpenTickets] = React.useState(openTickets);
    const [closedTicketsState, setClosedTickets] = React.useState(closedTickets);
    const [tempopenTicketsState, tempsetOpenTickets] = React.useState(openTickets);
    const [tempclosedTicketsState, tempsetClosedTickets] = React.useState(closedTickets);
    const [isLoading, setisLoading] = React.useState(false);
    const [editorContent, setEditorContent] = React.useState('');
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [ticketTitle, setTicketTitle] = React.useState('');
    const [newPartPermission, setNewPartPermission] = React.useState('Triager');
    const [previewTabActive, setPreviewTabActive] = React.useState(false);
    const [dataState, setDataState] = React.useState(data);
    const [ticketCatActive, setTicketcatactive] = React.useState('open');
    const [addParticipantModal, setAddParticipantModal] = React.useState(false);
    const [newPartName, setNewPartName] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [me, setMe] = React.useState<meInterface>({});

    React.useEffect(() => {
        const main = async () => {
            setisLoading(true)
            const token = window.localStorage.getItem('accessToken');
            const response3 = await fetch(`http://ksissuetracker.herokuapp.com/api/me`, {
                method: 'GET',
                headers: {
                    'accessToken': token
                }
            });
            const res = await response3.json();
            if (!res.in_projects.includes(projectId)) {
                router.push('/dashboard', undefined, {
                    shallow: true
                });
                window.alert('Unauthorised!')
            }
            setUsername(res.username);
            setEmail(res.email);
            setParticipantState(participants);
            participants.map(each => {
                if (each.name === res.username) {
                    setMyPermission(each);
                }
            })
            setMe(res);

            const response2 = await fetch(`http://ksissuetracker.herokuapp.com/api/getUsers`, {
                method: 'POST',
                headers: {
                    'accessToken': token
                },
                body: JSON.stringify({
                    projectId: projectId
                })
            });
            const res2 = await response2.json();
            setisLoading(false)
        }
        main();
    }, [modalIsOpen]);

    const router = useRouter();

    const refreshData = () => {
        router.replace(router.asPath);
    }

    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
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




    const addParticipant = async (particEmail, permission) => {
        if (!particEmail.includes('@')) {
            notifyError('Enter a valid emailId !')
            return
        }
        const bodyData = {
            name: particEmail,
            myEmail: email,
            permission: permission.split(" ").join("").toLowerCase(),
            projectId: projectId,
        }

        const res = await fetch(`http://ksissuetracker.herokuapp.com/api/addParticipant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });
        const response_participant = await res.json();
        if (res.status == 404) {
            notifyError(response_participant.message);
        } else if (res.status == 200) {
            setParticipantState([...participantState, response_participant]);
            notifySuccess(particEmail + ' was added to the project !');
            refreshData();
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


        const res = await fetch(`http://ksissuetracker.herokuapp.com/api/createNewTicket`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });
        if (res.status === 200) {
            notifySuccess('New ticket created !');
            refreshData();
        }
        setIsOpen(false);
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
                        }}>Edit Participants</button>
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
                                    setAddParticipantModal(!addParticipantModal);
                                }}>
                                    <CloseIcon />
                                </div>
                            </div>
                            <div className={styles.editParticipantsHeadContainer}>
                                <h2 className={styles.editParticipantsHead}><GroupAddIcon className={styles.groupAddIcon} />Edit Participants</h2>
                            </div>
                            <div className={styles.participantsInfo}>
                                {
                                    participantState.map((person, index) => {
                                        return (
                                            <>
                                                {
                                                    (!isEmpty(person)) ? (
                                                        <EachParticipant key={index} notifySuccess={notifySuccess} notifyError={notifyError} refreshData={refreshData} person={person} index={index} projectId={projectId} />
                                                    ) : null
                                                }
                                            </>
                                        )
                                    })
                                }
                            </div>
                            <div className={styles.addParticpantHeadContainer}>
                                <h3>Add Participant</h3>
                            </div>
                            {
                                (myPermission.permission === 'projectlead' || myPermission.permission === 'admin') ? (
                                    <div className={styles.addParticipantsBox}>

                                <input className={styles.eachParticipantTextField} placeholder="EmailId" value={newPartName} onChange={(e) => {
                                    setNewPartName(e.target.value);
                                }} />

                                <select className={styles.roleSelect} onChange={(e) => {
                                    setNewPartPermission(e.target.value);
                                }}>
                                    {
                                        roles.map(option => (
                                            <option className={styles.roleSelect} value={option.value}>{option.label}</option>
                                        ))
                                    }
                                </select>
                                <button onClick={() => {
                                    addParticipant(newPartName, newPartPermission);
                                    setNewPartName('');
                                }} disabled={newPartName ? false : true} style={{
                                    display: 'flex',
                                    cursor: 'pointer',
                                    width: '120px',
                                    borderRadius: '5px',
                                    backgroundColor: newPartName ? 'blue' : 'gray',
                                    color: newPartName ? 'white' : 'darkgray',
                                    fontSize: '20px',
                                    height: '35px',
                                    outline: 'none',
                                    border: 'none',
                                    justifyContent: 'space-evenly',
                                    alignItems: 'center'
                                }}><AddIcon /> Add</button>
                            </div>
                                ) : <h3>You dont have the permission to add user to this project.</h3>

                            }
                            

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
                                            <button onClick={() => {
                                                createNewTicket();
                                            }}>Create a new ticket</button>
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
    const response = await fetch(`http://ksissuetracker.herokuapp.com/api/getProject`, {
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

    const response2 = await fetch(`http://ksissuetracker.herokuapp.com/api/getProjectTickets`, {
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
