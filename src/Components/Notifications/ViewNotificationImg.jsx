import { Dialog } from 'primereact/dialog';
import { useSelector, useDispatch } from 'react-redux';
import { getNotificationImgThunk, setViewNotification } from '../../features/notifications/notificationSlice';
import { useEffect, useState } from 'react';
import { Carousel } from 'primereact/carousel';

const ViewNotificationImg = () => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('user'));

    const { ViewNotification, notificationImg } = useSelector((state) => state.notification);

    const handleShow = () => {
        return notificationImg.length !== 0 && !ViewNotification;
    };

    useEffect(() => {
        if (user.role !== 'admin' && !ViewNotification) {
            dispatch(getNotificationImgThunk());
        }
    }, [dispatch, ViewNotification]);

    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const imageTemplate = (image) => {
        return (
            <div className="image-item">
                <a target="_blank" href={image.linkImg ? image.linkImg : ''} rel="noreferrer">
                    <img src={image.urlImagen} className="modal-image" alt="Notificación" />
                </a>
            </div>
        );
    };

    return (
        <div>
            <Dialog
                visible={handleShow()}
                style={{ width: '540px', maxHeight: '90vh', boxShadow: 'none' }}
                onHide={() => dispatch(setViewNotification(true))}
                position='center'
                modal
                focusOnShow={false}
                className="image-dialog"
            >
                <Carousel 
                    value={notificationImg} 
                    numVisible={1} 
                    numScroll={1} 
                    responsiveOptions={responsiveOptions} 
                    itemTemplate={imageTemplate} 
                    autoplayInterval={2000} 
                    circular 
                />
            </Dialog>
        </div>
    );
};

export default ViewNotificationImg;
