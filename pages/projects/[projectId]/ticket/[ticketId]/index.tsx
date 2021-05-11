import React, { useContext } from 'react';
import { UserContext } from '../../../../../context/UserContext';
import { useRouter } from 'next/router';
import { ParticipantsContext } from '../../../../../context/ParticipantsContext';
import LayoutFrame from '../../../../../components/LayoutFrame';
import styles from './index.module.scss';
import Modal from 'react-modal';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CloseIcon from '@material-ui/icons/Close';
import Markdown from 'markdown-to-jsx';
import SyncLoader from "react-spinners/SyncLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function index({ data }) {

    const { username, setUsername } = useContext(UserContext);
    const [isLoading, setisLoading] = React.useState(false);
    const [editorContent, setEditorContent] = React.useState('');
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [chipData, setChipData] = React.useState(data.tags);
    const [chipDatatemp, setChipDatatemp] = React.useState([]);
    const [ticketId, setTicketId] = React.useState(data._id);
    const [selectValue, setSelectValue] = React.useState(data.currentStatus);
    const [selectOpen, setSelectOpen] = React.useState(false);
    const [label, setLabel] = React.useState('');
    const [temp, setTemp] = React.useState('');
    const [prevState, setPrevState] = React.useState('');
    const [reportCloseModal, setReportCloseModal] = React.useState(false);
    const [reportSelectionModal, setReportSelectionModal] = React.useState(false);
    const { myPermission } = useContext(ParticipantsContext);


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

    const addLabel = (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsOpen(!modalIsOpen);
    };

    React.useEffect(() => {
        setisLoading(true)
        const main = async () => {
            const token = window.localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:3000/api/me`, {
                method: 'GET',
                headers: {
                    'accessToken': token
                }
            });
            const res = await response.json();
            setUsername(res.username);
            setisLoading(false);
        }
        main();
    }, []);


    var router = useRouter();
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


    const setCurrentState = async () => {
        if (temp !== 'closed') {

            await fetch(`http://localhost:3000/api/reportCurrentState`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: ticketId,
                    currentState: temp,
                    prevState: selectValue
                })
            });
            refreshData();
            notifySuccess('New ticket state ' + temp + ' !');
        } else {
            closeTicket();
        }

    }

    const selectOnChange = (e) => {
        setReportSelectionModal(true);
        setTemp(e.target.value);
    }

    const selectOnClose = () => {
        setSelectOpen(false)
    }

    const selectOnOpen = () => {
        setSelectOpen(true)
    }


    const closeTicket = async () => {
        const bodyData = {
            id: ticketId,
            currentState: 'closed',
            prevState: selectValue
        }

        await fetch(`http://localhost:3000/api/closeTicket`, {
            method: 'POST',
            body: JSON.stringify(bodyData),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = {
            reply: `${username} closed the ticket`,
            name: username,
            id: ticketId,
            action: 2
        }

        await fetch(`http://localhost:3000/api/submitReply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        notifyError('Ticket successfully closed !');
        refreshData();

    }

    const refreshData = () => {
        router.replace(router.asPath);
    }

    const setLabels = async () => {
        const bodyData = {
            id: ticketId,
            tagData: chipData
        }
        let tempString = '';
        chipDatatemp.forEach((each) => {
            tempString = tempString + `<strong>${each}</strong>`
        });

        const data2 = {
            id: ticketId,
            action: 1,
            name: username,
            reply: `${username} added label ` + tempString,
            tagData: chipData,
        }
        await fetch(`http://localhost:3000/api/setLabels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });
        await fetch(`http://localhost:3000/api/submitReply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data2)
        });
        notifySuccess('Added new label(s) !');
        setIsOpen(false);
        setChipDatatemp([]);
        refreshData();
    }


    const handleDelete = (deleteName: any) => () => {
        setChipData(chipData.filter((eachName) => {
            return eachName != deleteName;
        }));
    }

    const submitReply = async (id, action) => {
        if (!editorContent) {
            return;
        }
        const data = {
            action: action,
            reply: editorContent,
            name: username,
            id: id
        }

        await fetch(`http://localhost:3000/api/submitReply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        setEditorContent('');
        setIsOpen(false);
        refreshData();
    }

    return (
        <LayoutFrame>
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
            <div className={styles.headingheader}>
                <div className={styles.heading}>
                    <h5>#{data._id}</h5>
                    <h2>{data.title}</h2>
                    <h4>Opened on {data.created_at} by {data.author}</h4>
                </div>

                <div className={styles.labelsInHead}>
                    <h5 style={{
                        paddingLeft: '25px',
                        paddingRight: '25px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px',
                        border: 'black solid 1px',
                        borderRadius: '10px',
                        backgroundColor: colors[data.currentStatus ? data.currentStatus.toLowerCase() : 'default'][0] || 'orange',
                        color: colors[data.currentStatus ? data.currentStatus.toLowerCase() : 'default'][1] || 'white'
                    }}>{data.currentStatus}</h5>
                    {
                        data.tags.map((each, keyId) => (
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


            <Modal
                className={styles.reportSelectModal}
                isOpen={reportSelectionModal}
                onRequestClose={() => {
                    setReportSelectionModal(!reportSelectionModal)
                }}
                styles={{
                    overlay: {
                        background: 'rgb(0, 0, 0)'
                    }
                }}
            >
                <>
                    <div className={styles.modalCloseIconContainer}>
                        <div className={styles.modalCloseIcon} onClick={() => {
                            setReportSelectionModal(!reportSelectionModal)
                        }}>
                            <CloseIcon />
                        </div>
                    </div>
                    <div className={styles.reportModalInfo}>
                        <div className={styles.reportSelectHeading}>
                            <h3>Do you want to change the current state of report to {temp}?</h3>
                        </div>
                        <div className={styles.reportSelectBtnGroup}>
                            <button onClick={() => {
                                setPrevState(selectValue);
                                setSelectValue(temp);
                                setReportSelectionModal(!reportSelectionModal);
                                setCurrentState();
                            }} className={styles.proceed}>Proceed</button>
                            <button onClick={() => { setReportSelectionModal(!reportSelectionModal) }} className={styles.cancel}>Cancel</button>
                        </div>
                    </div>
                </>
            </Modal>


            <Modal
                className={styles.reportSelectModal}
                isOpen={reportCloseModal}
                onRequestClose={() => {
                    setReportCloseModal(!reportCloseModal)
                }}
                styles={{
                    overlay: {
                        background: 'rgb(0, 0, 0)'
                    }
                }}
            >
                <>
                    <div className={styles.modalCloseIconContainer}>
                        <div className={styles.modalCloseIcon} onClick={() => {
                            setReportCloseModal(!reportCloseModal)
                        }}>
                            <CloseIcon />
                        </div>
                    </div>
                    <div className={styles.reportModalInfo}>
                        <div className={styles.reportSelectHeading}>
                            <h3>Are you sure you want to close the ticket and mark it as resolved?</h3>
                        </div>
                        <div className={styles.reportSelectBtnGroup}>
                            <button onClick={() => {
                                setReportCloseModal(!reportCloseModal)
                                closeTicket()
                            }} className={styles.proceed}>Proceed</button>
                            <button onClick={() => { setReportCloseModal(!reportCloseModal) }} className={styles.cancel}>Cancel</button>
                        </div>
                    </div>

                </>
            </Modal>

            <div className={styles.ticketConversationList}>
                <div key={data._id} className={styles.ticketConversation}>
                    <div className={styles.ticketConversationHead}>
                        <h4>Issue opened on {data.created_at} by {data.author}</h4>
                    </div>
                    <div className={styles.ticket}>
                        <div className={styles.avatarContainer}>
                            <div className={styles.avatar}><h4>{data.author.slice(0, 1).toUpperCase()}</h4></div>
                        </div>
                        <div className={styles.ticketContent}>
                            <Markdown>{data.description}</Markdown>
                        </div>
                    </div>
                </div>
                {
                    data.replies.map((each) => (

                        each.label ? (
                            <div key={each._id} className={styles.ticketConversation}>
                                <div className={styles.ticketConversationHead}>
                                    <h4>{each.user} added label on {each.date}</h4>
                                </div>

                            </div>
                        ) : (
                            <div key={each._id} className={styles.ticketConversation}>
                                <div className={styles.ticketConversationHead}>
                                    <h4>{each.user} commented on {each.date}</h4>
                                </div>
                                <div className={styles.ticket}>
                                    <div className={styles.avatarContainer}>
                                        <div className={styles.avatar}><h4>{each.user.slice(0, 1).toUpperCase()}</h4></div>
                                    </div>
                                    <div className={styles.ticketContent}>
                                        <Markdown>{each.reply}</Markdown>
                                    </div>
                                </div>
                            </div>
                        )


                    ))
                }
                <Modal
                    className={styles.labelModal}
                    isOpen={modalIsOpen}
                    onRequestClose={() => {
                        setIsOpen(!modalIsOpen)
                    }}
                    styles={{
                        overlay: {
                            background: 'rgb(0, 0, 0)'
                        }
                    }}
                >
                    <>
                        <div className={styles.modalCloseIconContainer}>
                            <div className={styles.modalCloseIcon} onClick={() => {
                                setIsOpen(!modalIsOpen)
                            }}>
                                <CloseIcon />
                            </div>
                        </div>

                        <div className={styles.labelsSection}>
                            <div className={styles.inputContainer}>
                                <input type="text" value={label} onChange={(e) => { setLabel(e.target.value) }} placeholder="Enter a label name" />
                                <button onClick={() => {
                                    setChipData(() => [...chipData, label]);
                                    setChipDatatemp(() => [...chipDatatemp, label]);
                                    setLabel('');
                                }}>Add</button>
                            </div>

                            <div className={styles.chipContainer}>
                                {
                                    chipData.map((each, key) => (
                                        <Chip
                                            variant="outlined"
                                            key={key}
                                            label={each}
                                            onDelete={each === username ? undefined : handleDelete(each)}
                                            className={styles.chip}
                                        />
                                    ))
                                }
                            </div>
                            <div className={styles.assignButtonContainer}><button onClick={(e) => {
                                setLabels();
                            }}>Assign Label</button></div>
                        </div>
                    </>

                </Modal>
                <div className={styles.replyArea}>
                    {
                        (data.currentStatus != 'closed') ? (
                            <div className={styles.projectDesc}>
                                <div className={styles.reportStateContainer}>
                                    <div>

                                    </div>
                                    <div className={styles.currentStatus}>
                                        <h4>Current Status</h4>
                                        <FormControl className={styles.reportStateFormControl}>
                                            <Select
                                                placeholder="Change TicketState"
                                                className={styles.reportStateSelect}
                                                open={selectOpen}
                                                onClose={selectOnClose}
                                                onOpen={selectOnOpen}
                                                value={selectValue}
                                                onChange={selectOnChange}>
                                                <MenuItem value="">{selectValue}</MenuItem>
                                                {
                                                    ['New', 'Triaged', 'Accepted', 'Pending', 'Unresolved'].map((each, id) => (
                                                        (each !== selectValue.toLowerCase()) ? (
                                                            <MenuItem key={id} value={each}>{each}</MenuItem>
                                                        ) : (null)
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                                <textarea placeholder="Description (Markdown supported)" className={styles.editor} value={editorContent} onChange={(e) => {
                                    setEditorContent(e.target.value);
                                }}>
                                </textarea>
                            </div>
                        ) : null
                    }


                    {
                        (data.currentStatus != 'closed') ? (
                            <div className={styles.buttonContainer}>
                                <button className={styles.labelButton} onClick={addLabel}>Add Labels</button>
                                <button onClick={() => { submitReply(data._id, 0) }}>Comment</button>
                                {
                                    myPermission.permission === 'triager' ? null : (
                                        <button className={styles.ticketcloseButton} onClick={() => {
                                            setReportCloseModal(true);
                                        }}>Close Ticket</button>
                                    )
                                }
                                
                            </div>
                        ) : (
                            null

                        )

                    }


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
    const ticketId = context.req.__NEXT_INIT_QUERY.ticketId ? context.req.__NEXT_INIT_QUERY.ticketId : context.req.url.split('/')[4];
    const response = await fetch(`http://localhost:3000/api/getTicket`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: ticketId
        })
    });
    const data = await response.json();


    return {
        props: {
            data: data,
        }
    }
}

export default index;
