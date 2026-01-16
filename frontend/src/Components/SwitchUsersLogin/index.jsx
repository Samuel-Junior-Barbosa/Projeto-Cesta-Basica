import React, { useEffect, useState } from 'react';
import './SwitchProfile.css';
import userIcon from '../../assets/images/user_icon.svg';
import { getCurrentUser } from '../hooks/Authenticator/auth';


const SwitchProfile= () => {
    const [profiles, setProfiles] = useState(['', 'Admin', 'Operador', 'Visitante']);
    const [direction, setDirection] = useState('');
    const [animating, setAnimating] = useState(false);
    const [currentUserSelected, setCurrentUserSelected ] = useState('')

    const handleClick = ( value ) => {
        let nameuser = String( value.target.value )
        setCurrentUserSelected( nameuser )
        localStorage.setItem("userSelected", nameuser)
    }

    const getLastUserSelected = () => {
        let userSelected = localStorage.getItem("userSelected")
        setCurrentUserSelected( userSelected )
        return userSelected
    }

    useEffect(() => {
        getLastUserSelected()
    })
    return (

            <div className="SwitchProfileContainer">
                <img className='userIconLogin' src={userIcon} />
                <div className='divLabelName'>
                    <label className="labelLoginUserName"> Usuario:
                        
                    </label>
                    <select className='selectCurrentUser'
                        onChange={(e) => {
                            handleClick( e )
                        }}
                        value = {currentUserSelected}
                    >
                        {profiles.map((item, index) => (
                            <option
                                key = {index}
                            >
                                {item}
                            </option>
                        ))}
                    </select>

                </div>

            </div>

    );
}

export default SwitchProfile;