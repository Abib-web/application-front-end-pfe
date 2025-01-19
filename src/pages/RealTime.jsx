import React from 'react';
import NavBar from '../components/NavBar/NavBar';
import DeviceDetails from '../components/DeviceList/DeviceDetails';

const RealTime = () => {

    return (
        <div className="home-content">
            <NavBar />
            <div className="body-content">
                <DeviceDetails />
            </div>
        </div>
    );
};

export default RealTime;
