import React from 'react';
import LayoutFrame from '../components/LayoutFrame';
import styles from './index.module.scss';
import { useRouter } from 'next/router'


function index({ data }) {

    const router = useRouter();
    console.log(data);


    return (
        <LayoutFrame>
            <div className={styles.projectsContainer}>
                {
                    data.map((each) => (
                        <div onClick={(e) => {
                            e.preventDefault();
                            router.push(`/projects/${each._id}`);
                        }} className={styles.eachProject} key={each._id}>
                            <h3>{each.title}</h3>
                            <div className={styles.descPart}>
                                {
                                    (each.description.length > 115) ?
                                        <h5>{each.description.slice(0, 115) + "..."}</h5> :
                                        <h4>{each.description}</h4>
                                }
                                <h5>{each.participants}</h5>
                            </div>
                        </div>
                    ))
                }
            </div>
        </LayoutFrame>
    )
}

export async function getServerSideProps(context) {
    const res = await fetch('http://localhost:3000/api/getMyProjects');
    const data = await res.json();

    return {
        props: {
            data: data
        }
    }


}

export default index;
