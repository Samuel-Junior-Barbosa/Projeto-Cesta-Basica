import React, { useState } from 'react';
import './SwitchProfile.css';
import userIcon from '../../assets/images/user_icon.svg';


const SwitchProfile= () => {
    const [profiles, setProfiles] = useState(['Admin', 'Operador', 'Visitante']);
    const [direction, setDirection] = useState('');
    const [animating, setAnimating] = useState(false);

    const handleClick = (index) => {
        if (animating) {
            return;
        }

        setAnimating(true);
        if (index === 0) {
            setDirection('left');
            setTimeout(() => {
                setProfiles((prev) => [prev[2], prev[0], prev[1]])
                setAnimating(false);
            }, 550);
        }
        else if (index === 2) {
            setDirection('right');
            setTimeout(() => {
                setProfiles((prev) => [prev[1], prev[2], prev[0]]);
                setAnimating(false);
            }, 550);
        }
        else {
            setAnimating(false);
        }
    }
    return (

            <div className="SwitchProfileContainer">
                {profiles.map((item, index) => (
                    <div
                        key={index}
                        className={`profiles position-${index} ${animating ? `animating-${direction}` : ""}`}
                        onClick={() => { handleClick(index)}}
                    >
                        <img className='userIconLogin' src={userIcon} />
                        <label className="labelLoginUserName"> Usuario: <label className="loginUserName">{item}</label> </label>
                    </div>
                ))}
            </div>

    );
}

export default SwitchProfile;