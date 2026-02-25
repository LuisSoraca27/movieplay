import React from 'react';
import '../style/isloading.css';
import { Spinner } from "@heroui/react";

const IsLoading = () => {
    return (
        <div className='container-spinner'>
            <Spinner size="lg" color="primary" />
        </div>
    );
};

export default IsLoading;