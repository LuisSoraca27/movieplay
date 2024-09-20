import React from 'react';
import '../style/isloading.css';
import { ProgressSpinner } from 'primereact/progressspinner';
        

const IsLoading = () => {

    return (
        <div className='container-spinner'>
        <ProgressSpinner style={{width: '60px', height: '60px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
        </div>
    );
};

export default IsLoading;