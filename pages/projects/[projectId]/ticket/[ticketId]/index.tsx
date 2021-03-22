import React from 'react';
import { useRouter } from 'next/router';
import LayoutFrame from '../../../../components/LayoutFrame';
import styles from './index.module.scss';
import Modal from 'react-modal';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CloseIcon from '@material-ui/icons/Close';

function index({ data }) {

    const [editorContent, setEditorContent] = React.useState('');
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [chipData, setChipData] = React.useState(data.tags);
    const [ticketId, setTicketId] = React.useState(data._id);
    const [selectValue, setSelectValue] = React.useState(data.currentStatus);
    const [selectOpen, setSelectOpen] = React.useState(false);
    const [label, setLabel] = React.useState('');
    const [temp, setTemp] = React.useState('');
    const [reportSelectionModal, setReportSelectionModal] = React.useState(false);

    const addLabel = (event: React.MouseEvent<HTMLButtonElement>) => {
        setIsOpen(!modalIsOpen);
    };
    console.log(selectValue)
    var router = useRouter();
    var colors = {
        'new': ['greenyellow', 'black'],
        'open': ['green', 'white'],
        'discussion': ['gray', 'white'],
        'bug': ['red', 'white'],
        'critical': ['darkred', 'white'],
        'help wanted': ['lightgreen', 'black'],
        'needs example': ['yellow', 'black'],
        'documentation': ['dark gray', 'white'],
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
        console.log(selectValue)
        if (temp !== 'closed') {
            await fetch('http://localhost:3000/api/reportCurrentState', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    id: ticketId,
                    currentState: temp
                })
            });
            refreshData();
        } else {
            closeTicket();
            refreshData();
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
            id: ticketId
        }
        await fetch('http://localhost:3000/api/closeTicket', {
            method: 'POST',
            body: JSON.stringify(bodyData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
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
        const data2 = {
            id: ticketId,
            labelBool: true,
            user: 'Adwaith',
            reply: `Adwaith added labels` + chipData,
            tagData: chipData,
            name: 'Adwaith'
        }
        const res = await fetch('http://localhost:3000/api/setLabels', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)
        });
        const res2 = await fetch('http://localhost:3000/api/submitReply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data2)
        })
        setIsOpen(false);
        refreshData();
    }


    const handleDelete = (deleteName: any) => () => {
        setChipData(chipData.filter((eachName) => {
            return eachName != deleteName;
        }));
    }

    const submitReply = async (id, labelBool) => {
        if (!editorContent) {
            return;
        }
        const data = {
            labelBool: labelBool,
            reply: editorContent,
            name: 'adwaith',
            id: id
        }
        console.log(data);

        const res = await fetch('http://localhost:3000/api/submitReply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const p = await res.json();
        setEditorContent('');
        setIsOpen(false);
        refreshData();
    }

    return (
        <LayoutFrame>
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
                        display:'flex',
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
                                <button onClick={()=>{
                                    setSelectValue(temp);
                                    setReportSelectionModal(!reportSelectionModal)
                                    setCurrentState();
                                    }} className={styles.proceed}>Proceed</button>
                                <button onClick={()=>{setReportSelectionModal(!reportSelectionModal)}} className={styles.cancel}>Cancel</button>
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
                            <h4>{data.description}</h4>
                        </div>
                    </div>
                </div>
                {
                    data.replies.map((each) => (

                        each.label ? (
                            <div key={each._id} className={styles.ticketConversation}>
                                <div className={styles.ticketConversationHead}>
                                    <h4>{each.user} added a label on {each.date}</h4>
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
                                        <h4>{each.reply}</h4>
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
                                            onDelete={each === 'adwaith' ? undefined : handleDelete(each)}
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
                                    <div>
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
                                                ['New', 'Triaged', 'Closed', 'Accepted', 'Pending', 'Unresolved'].map(each => (
                                                    (each !== selectValue.toLowerCase()) ? (
                                                        <MenuItem value={each}>{each}</MenuItem>
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
                                <button onClick={() => { submitReply(data._id, false) }}>Comment</button>
                                <button className={styles.ticketcloseButton} onClick={() => { closeTicket() }}>Close Ticket</button>
                            </div>
                        ) : (
                            null

                        )

                    }


                </div>
            </div>
        </LayoutFrame>
    )
}

export async function getServerSideProps(context) {
    const ticketId = context.req.url.split('/')[4];
    const response = await fetch('http://localhost:3000/api/getTicket', {
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
