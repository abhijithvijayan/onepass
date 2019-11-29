import React from 'react';
import { ToastContainer } from 'react-toastify';

const ToastConfigContainer = props => (
    <ToastContainer
        {...props}
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange={false}
        draggable={false}
        pauseOnHover
    />
);

const ToastNotifier = () => (
    <>
        <ToastConfigContainer enableMultiContainer containerId="top__right" position="top-right" />
        <ToastConfigContainer enableMultiContainer containerId="top__center" position="top-center" />
        <ToastConfigContainer enableMultiContainer containerId="bottom__right" position="bottom-right" />
        <ToastConfigContainer enableMultiContainer containerId="bottom__center" position="bottom-center" />
    </>
);

export default ToastNotifier;
