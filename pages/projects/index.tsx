import React from 'react';
import LayoutFrame from '../components/LayoutFrame';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import GroupIcon from '@material-ui/icons/Group';
import SyncLoader from "react-spinners/SyncLoader";


function index({ data }) {

    const router = useRouter();
    const [isLoading, setisLoading] = React.useState(false);

    const [username, setUsername] = React.useState('');


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
            setisLoading(false)

        }
        main();
    }, []);
    



    return (
        <LayoutFrame>
            <SyncLoader  color={'#fff9'} loading={isLoading} size={20} css={
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
            
            <div className={styles.projectsContainer}>
                {
                    data.map((each) => (
                            username == undefined ? null : each.participants.includes(username) ? (
                                <div onClick={(e) => {
                                    setisLoading(true)
                                    e.preventDefault();
                                    router.push(
                                        '/projects/[projectId]',
                                        `/projects/${each._id}`
                                        );
                                }} className={styles.eachProject} key={each._id}>
                                    <h3>{each.title}</h3>
                                    <div className={styles.descPart}>
                                        {
                                            (each.description.length > 100) ?
                                                <h5>{each.description.slice(0, 110) + "..."}</h5> :
                                                <h4>{each.description}</h4>
                                        }
                                        <div className={styles.participants}>
                                            <GroupIcon className={styles.participantsIcon} />
                                            {
                                                each.participants.map((element, id) => (
                                                    <h5 key={id}>{element}</h5>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            ) : null
                                
                            ))
                }
            </div>
        </LayoutFrame>
    )
}

export async function getServerSideProps(context) {
    const res = await fetch(`http://localhost:3000/api/getMyProjects`);
    const data = await res.json();

    return {
        props: {
            data: data
        }
    }


}

export default index;
