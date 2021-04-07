import React from 'react';
import LayoutFrame from '../components/LayoutFrame';
import styles from './index.module.scss';
import { useRouter } from 'next/router';

function index() {

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

    var router = useRouter();

    React.useEffect(() => {
        const main = async() => {
            const token = window.localStorage.getItem('accessToken');

            const res = await fetch(`http://ksissuetracker.herokuapp.com/api/getAllTickets`)
            const data = await res.json();

            const response = await fetch(`http://ksissuetracker.herokuapp.com/api/me`, {
                method: 'GET',
                headers: {
                    'accessToken': token
                }
            });
            const res2 = await response.json();  
            setMe(res2); 
            setData(data);  
            settempData(data);                               
        }
        main();
    }, []);

    const [me, setMe] =  React.useState<meInterface>({});
    const [data, setData] = React.useState([]);
    const [tempdata, settempData] = React.useState([]);

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

    const searchHandler = (e) => {      
        setData(tempdata.filter(function(each) {
            return each.title.toLowerCase().match(e.target.value.toLowerCase());
        }));
    }


    return (
        <LayoutFrame>
            <div className={styles.allTickets}>
                <div className={styles.searchContainer}>
                    <input placeholder="Search" type="text" onChange={searchHandler} />
                </div>

                <div className={styles.ticketList}>
                {
                        data.map((each, id) => (
                            me.in_projects == undefined ? null : me.in_projects.includes(each.projectId) ? (
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
                                        <h5>Opened On {each.created_at} by adwaith</h5>
                                    </div>
                                </div>
                            </div>
                            ) : null 
                        ))
                    }

                </div>
                </div>
        </LayoutFrame>
    )
}



export default index;
