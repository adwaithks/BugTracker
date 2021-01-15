import React from 'react';
import { useRouter } from 'next/router';
import LayoutFrame from '../../../../components/LayoutFrame';
import styles from './index.module.scss';

function index({ data }) {

    const [editorContent, setEditorContent] = React.useState('');
    var router = useRouter();

    const refreshData = () => {
        router.replace(router.asPath);
    }

    const submitReply = async (id) => {
        const data = {
            reply: editorContent,
            name: 'adwaith',
            id: id
        }
        const res = await fetch('http://localhost:3000/api/submitReply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const p = await res.json();
        setEditorContent('');
        refreshData();
    }

    return (
        <LayoutFrame>
            <div className={styles.heading}>
                <h5>#{data._id}</h5>
                <h2>{data.title}</h2>
                <h4>Opened on {data.created_at} by {data.author}</h4>
            </div>
            <div className={styles.ticketConversationList}>
                <div key={data._id} className={styles.ticketConversation}>
                    <div className={styles.avatarContainer}>
                        <div className={styles.avatar}><h4>{data.author.slice(0, 1).toUpperCase()}</h4></div>
                    </div>
                    <div className={styles.ticketContent}>
                        <h4>{data.description}</h4>
                    </div>
                </div>
                {
                    data.replies.map((each) => (
                        <div key={each._id} className={styles.ticketConversation}>
                            <div className={styles.avatarContainer}>
                                <div className={styles.avatar}><h4>{each.user.slice(0, 1).toUpperCase()}</h4></div>
                            </div>
                            <div className={styles.ticketContent}>
                                <h4>{each.reply}</h4>
                            </div>
                        </div>
                    ))
                }
                <div className={styles.replyArea}>
                    <div className={styles.projectDesc}>

                        <textarea placeholder="Description (Markdown supported)" className={styles.editor} value={editorContent} onChange={(e) => {
                            console.log(e.target.value);
                            setEditorContent(e.target.value);
                        }}>
                        </textarea>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button onClick={() => { submitReply(data[0]._id) }}>Submit reply</button>
                    </div>
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
