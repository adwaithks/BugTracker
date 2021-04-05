import React from 'react';
import styles from './index.module.scss';
import {useRouter} from 'next/router';
import Modal from 'react-modal';
import LayoutFrame from '../components/LayoutFrame';
import { Doughnut, Bar } from 'react-chartjs-2';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';



const index = ({data}) => {

    interface analyticsInterface {
        acceptedTickets?: number,
        issuesReceivedChart?: [number],
        issuesReceivedNum?: number,
        newTickets?: number,
        overallTickettypeChart?: [number],
        pendingTickets?: number,
        resolvedTickets?: number,
        triagedTickets?: number,
        unresolvedTickets?: number
    }

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


    const [username, setUsername] = React.useState('')
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [editorContent, setEditorContent] = React.useState('');
    const [projectTitle, setProjectTitle] = React.useState('');
    const [chipData, setChipData] = React.useState([]);
    const [analytics, setAnalytics] = React.useState<analyticsInterface>({});
    const [me, setMe] = React.useState<meInterface>({});
    const [burgerIcon, setBurgerIcon] = React.useState(false); //false - not open
    const [burgerIconVisibility, setBurgerIconVisibility] = React.useState(false); //false - not open

    const router = useRouter();
    
    React.useEffect(() => {

    if (window.innerWidth > 1101) {
        setBurgerIconVisibility(false)
    }

    if (window.innerWidth < 950) {
        setBurgerIconVisibility(true); //(true);
    }
    const resizeListener = () => {
        if (window.innerWidth > 1101) {
            setBurgerIconVisibility(false);
        }

    if (window.innerWidth < 950) {
        setBurgerIconVisibility(true); //(true);
    }
      };
      window.addEventListener('resize', resizeListener);
      
        const main = async () => {
            const token = window.localStorage.getItem('accessToken');
            const response = await fetch(`http://ksissuetracker.herokuapp.com/api/me`, {
                method: 'GET',
                headers: {
                    'accessToken': token
                }
            });
            if (response.status !== 200) {
                router.push('/login');
            }
            
            const res = await response.json();
            setMe(res);

            const res2 = await fetch(`http://ksissuetracker.herokuapp.com/api/getAnalytics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    user: res.username
                })
            });
            const response2 = await res2.json();
            console.log(res)
            setAnalytics(response2);                 
            setUsername(res.username);
            setChipData([res.username])
        }
        main();

        return () => {
            window.removeEventListener('resize', resizeListener);
        }
    }, []);

    

    var colors = {
        'new': ['greenyellow', 'black'],
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
        'unresolved': ['darkred', 'black'],
        'pending': ['purple', 'white'],
        'accepted': ['green', 'white']
    }

    const handleDelete = (deleteName: any) => () => {
        setChipData(chipData.filter((eachName) => {
            return eachName != deleteName;
        }));
    };

    const createNewProject = async () => {
        const data = {
            title: projectTitle,
            description: editorContent,
            author: username,
            analytics: [0, 0, 0, 0, 0, 0]
        }

        setIsOpen(false);
        await fetch(`http://ksissuetracker.herokuapp.com/api/createNewProject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                router.push(`/projects/${data._id}`)
            })
            .catch(err => {
                console.log(err);
            });
            
        }

    return (
        <LayoutFrame>
            <div className={styles.newTicketContainer}>
            {
                        burgerIconVisibility ? (
                            <div className={styles.burgerIconContainer}>
                    
                    
                    <MenuIcon className={styles.burgerIcon} onClick={() => {setBurgerIcon(!burgerIcon)}} />
                    {
                        (burgerIcon) ? (
                    <div className={styles.burgerIconOptions}>
                        <h4 onClick={() =>{router.push('/dashboard')}}>Dashboard</h4>
                        <h4 onClick={() =>{router.push('/alltickets')}}>All Tickets</h4>
                        <h4 onClick={() => {router.push('/projects')}}>My Projects</h4>
                        <h4 onClick={() => {
                            window.localStorage.removeItem('accessToken');
                            router.push('/login');
                            }}>Logout</h4>
                    </div>
                        ) : null
                    }
                    
                </div>
                        ) : null
                    }
                
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
                                    setEditorContent(e.target.value);
                                }}>
                                </textarea>
                            </div>

                            <div className={styles.participantsContainer}>
                             {/**   <div className={styles.participantLabel}>
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
                                                onDelete={each === username ? undefined : handleDelete(each)}
                                                className={styles.chip}
                                            />
                                        ))
                                    }
                                </div>**/}
                                <div className={styles.newProjectCreateButton}>
                                    <button onClick={createNewProject}>Create New Project</button>
                                </div>
                            </div>
                        </div>


                    </>

                }

            </Modal>
            <div className={styles.ticketAnalyse}>

                <div className={styles.openTickets}>
                    <div className={styles.purple}></div>
                    <div className={styles.openTicketsContent}>
                        <h1>{analytics.newTickets ? analytics.newTickets : 0}</h1>
                        <h3>New Tickets</h3>
                    </div>
                </div>
                <div className={styles.newTickets}>
                    <div className={styles.blue}></div>
                    <div className={styles.newTicketsContent}>
                        <h1>{analytics!.triagedTickets ? analytics!.triagedTickets : 0}</h1>
                        <h3>Triaged Tickets</h3>
                    </div>
                </div>

                <div className={styles.resolvedTickets}>
                    <div className={styles.green}></div>
                    <div className={styles.resolvedTicketsContent}>
                        <h1>{analytics.resolvedTickets ? analytics.resolvedTickets : 0}</h1>
                        <h3>Resolved Tickets</h3>
                    </div>
                </div>

                <div className={styles.unresolvedTickets}>
                    <div className={styles.red}></div>
                    <div className={styles.unresolvedTicketsContent}>
                        <h1>{analytics.unresolvedTickets ? analytics.unresolvedTickets : 0}</h1>
                        <h3>UnResolved Tickets</h3>
                    </div>
                </div>

            </div>
            <div className={styles.ticketGraphs}>
                <div className={styles.overallTicketTypes}>
                    <div className={styles.overallTicketTypesHeading}>
                        <h3>Overall Ticket Type</h3>
                    </div>
                    <div className={styles.overallTicketTypesGraph}>
                        <Bar data={{
                            labels: ['New', 'Triaged', 'Accepted', 'Pending', 'Resolved', 'Unresolved'],
                            datasets: [{
                                label: 'overall issues',
                                data: analytics.overallTickettypeChart ? analytics.overallTickettypeChart : 0,
                                backgroundColor: [
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(183, 255, 40, 0.2)',
                                    'rgba(241, 0, 0, 0.2)'

                                ],
                                borderColor: [
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(183, 255, 4, 1)',
                                    'rgba(241, 0, 0, 1)'

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
                        <h1>{analytics.issuesReceivedNum ? analytics.issuesReceivedNum : 0}</h1>
                    </div>
                    <div className={styles.issuesReceivedGraph}>
                        <Doughnut data={{
                            labels: ['New', 'Triaged', 'Accepted', 'Pending', 'Resolved', 'Unresolved'],
                            datasets: [{
                                label: 'issues received',
                                data: analytics.issuesReceivedChart ? analytics.issuesReceivedChart : 0,
                                backgroundColor: [
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(183, 255, 40, 0.2)',
                                    'rgba(241, 0, 0, 0.2)'

                                ],
                                borderColor: [
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(183, 255, 4, 1)',
                                    'rgba(241, 0, 0, 1)'

                                ],
                                borderWidth: 2
                            }]
                        }} />
                    </div>
                </div>
               
            </div>
            <div className={styles.latestTickets}>
                <div className={styles.latestTicketsGlass}>
                <div className={styles.latestTicketsHead}>
                <h3>Latest Tickets</h3>
                </div>
                <div className={styles.latestTicketsContainer}>
                    {
                        data.map((each, id) => (
                            me.in_projects == undefined ? null : me.in_projects.includes(each.projectId) ? (
<div onClick={() => {
                                router.push(`/projects/${each.projectId}/ticket/${each._id}`)
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
                                        <h5>Opened On {each.created_at} by adwaith</h5>
                                    </div>
                                </div>
                            </div>
                            ) : null 
                        ))
                    }
                
                </div>
                </div>
                
                </div>
                </LayoutFrame>
    )
}


export async function getServerSideProps(context) {
    const res = await fetch(`http://ksissuetracker.herokuapp.com/api/latestTickets`, {
        method: 'GET'
    });
    const response = await res.json();

    
    return { 
        props: {
            data: response,
        }
    }
}

export default index;
