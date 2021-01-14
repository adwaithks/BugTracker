import React from 'react';
import LayoutFrame from '../components/LayoutFrame';
import styles from './index.module.scss';
import fetch from 'isomorphic-unfetch';

function index({ data }) {
    return (
        <LayoutFrame>
            <div className={styles.allTickets}>
                <div className={styles.searchContainer}>
                    <input placeholder="Search" type="text" />
                </div>
                <div className={styles.ticketList}>
                    {
                        data.map((each: any, id: number) => (
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
