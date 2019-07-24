import React from 'react';
import { ToastContainer } from 'react-toastify';

const ToastConfigContainer = props => {
    return (
        <ToastContainer
            {...props}
            autoClose={5000}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange={false}
            draggable={false}
            pauseOnHover
        />
    );
};

const ToastNotifier = () => {
    return (
        <React.Fragment>
            <ToastConfigContainer enableMultiContainer containerId="top__right" position="top-right" />
            <ToastConfigContainer enableMultiContainer containerId="top__center" position="top-center" />
            <ToastConfigContainer enableMultiContainer containerId="bottom__right" position="bottom-right" />
            <ToastConfigContainer enableMultiContainer containerId="bottom__center" position="bottom-center" />
        </React.Fragment>
    );
};

export default ToastNotifier;
