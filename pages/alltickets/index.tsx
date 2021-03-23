import React from 'react';
import LayoutFrame from '../components/LayoutFrame';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';

function index({ data }) {

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
        'closed': ['red', 'white'],
        'triage': ['orange', 'black'],
        'close': ['red', 'white'],
        'default': ['white', 'black'],
        'resolved': ['greenyellow', 'black'],
        'unresolved': ['darkred', 'black'],
        'pending': ['purple', 'white'],
        'accepted': ['green', 'white']
    }


    return (
        <LayoutFrame>
            <div className={styles.allTickets}>
                <div className={styles.searchContainer}>
                    <input placeholder="Search" type="text" />
                </div>
                <div className={styles.ticketList}>
                    {
                        data.map((each: any, id: number) => (
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
                                        <h5>Opened On {each.created_at} by Adwaith KS</h5>
                                    </div>
                                </div>
                            </div>
                        ))
                    }

                </div>
            </div>
        </LayoutFrame>
    )
}

export async function getServerSideProps(context) {
    const res = await fetch(`http://localhost:3000/api/getAllTickets`)
    const data = await res.json();

    if (!data) {
        return {
            notFound: true,
        }
    }

    return {
        props: { data },
    }
}

export default index;
