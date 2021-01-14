import React from 'react';
import LayoutFrame from '../../components/LayoutFrame';
import styles from './index.module.scss';
import Modal from 'react-modal';
import Markdown from 'markdown-to-jsx';
import { useRouter } from 'next/router';
import CloseIcon from '@material-ui/icons/Close';

function index({ data, tickets, projectId }) {
    const [editorContent, setEditorContent] = React.useState('');
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [ticketTitle, setTicketTitle] = React.useState('');
    const [previewTabActive, setPreviewTabActive] = React.useState(false);
    const [dataState, setDataState] = React.useState(data);
    const [ticketCatActive, setTicketcatactive] = React.useState('open');


    const router = useRouter();

    const refreshData = () => {
        router.replace(router.asPath);
    }

    const createNewTicket = async () => {
        const bodyData = {
            title: ticketTitle,
            description: editorContent,
            project: dataState.title,
            author: 'adwaith',
            participants: ['adwaith'],
            projectId: projectId
        }
        const res = await fetch('http://localhost:3000/api/createNewTicket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });
        const finalData = await res.json();
        console.log(finalData);
        setIsOpen(false);
        refreshData();
    }

    return (
        <LayoutFrame>
            <>
                <div className={styles.createNewTicketContainer}>
                    <div className={styles.createButton}>
                        <button onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(!modalIsOpen);
                        }}>Create New Ticket</button>
                    </div>
                </div>
                <div className={styles.projectDetailsContainer}>
                    <div className={styles.projectHead}>
                        <h1>{data.title}</h1>
                    </div>
                    <div className={styles.projectDesc}>
                        <h3>{data.description}</h3>
                    </div>
                    <div className={styles.projectParts}>
                        <h4>Participants:</h4>
                        {
                            data.participants.map((each, id) => (
                                <div key={id} className={styles.partAvatar}>
                                    <h3>{each}</h3>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <Modal
                    className={styles.newTicketModal}
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
                                                    console.log(e.target.value);

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
                            <div className={styles.ticketcateg} onClick={(e) => {
                                setTicketcatactive('open');
                            }}><h4>Open</h4></div>
                            <div className={styles.ticketcateg} onClick={(e) => {
                                setTicketcatactive('closed');
                            }}><h4>Closed</h4></div>
                            <div className={styles.ticketcateg} onClick={(e) => {
                                setTicketcatactive('pending');
                            }}><h4>Pending</h4></div>
                        </div>

                    </div>
                    <div className={styles.ticketDetails}>
                        {
                            ticketCatActive === 'open' ? (
                                <div className={styles.ticketList}>
                                    {
                                        tickets.map((each: any, id: number) => (
                                            each.currentStatus == 'New' ? (
                                                <div key={id} className={styles.eachTicket}>
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
                            ) : ticketCatActive === 'closed' ? (
                                <div className={styles.ticketList}>
                                    {
                                        tickets.map((each: any, id: number) => (
                                            each.currentStatus == 'Closed' ? (
                                                <div key={id} className={styles.eachTicket}>
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
                            ) : (
                                        <div className={styles.ticketList}>
                                            {
                                                tickets.map((each: any, id: number) => (
                                                    each.currentStatus == 'Pending' ? (
                                                        <div key={id} className={styles.eachTicket}>
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
            </>
        </LayoutFrame>
    )
}

export async function getServerSideProps(context) {
    const projectId = context.req.url.split('/')[2];

    const response = await fetch('http://localhost:3000/api/getProject', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: projectId
        })
    });
    const data = await response.json();

    const response2 = await fetch('http://localhost:3000/api/getProjectTickets', {
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
            tickets: data2,
            projectId: projectId
        }
    }
}

export default index;
