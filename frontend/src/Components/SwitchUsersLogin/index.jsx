import React, { useEffect, useLayoutEffect, useState } from 'react';
import './SwitchProfile.css';
import userIcon from '../../assets/images/user_icon.svg';
import getUserListOnLogin from '../../Functions/Authentication/GetUserListOnLogin';


const SwitchProfile= () => {
    //const [profiles, setProfiles] = useState(['', 'Admin', 'Operador', 'Visitante']);
    const [profiles, setProfiles] = useState(['NENHUM']);
    const [direction, setDirection] = useState('');
    const [animating, setAnimating] = useState(false);
    const [currentUserSelected, setCurrentUserSelected ] = useState('')

    const handleClick = ( value ) => {
        let nameuser = String( value.target.value )
        setCurrentUserSelected( nameuser )
        localStorage.setItem("user", nameuser)
    }

    const getLastUserSelected = () => {
        let userSelected = localStorage.getItem("user")
        if( !userSelected ) {
            userSelected = 'NENHUM'
        }
        setCurrentUserSelected( userSelected )
        return userSelected
    }

    useEffect(() => {
        getLastUserSelected()
    })

    useEffect(() => {
        
        async function get_user_data() {
            const response = await getUserListOnLogin()
            //console.log(" response user list: ", response)
            if( response.status == 0 ) {
                let tmp_profiles = [...profiles]
                for( let i = 0; i < response.content.length; i ++ ) {
                    tmp_profiles.push( response.content[i][1] )
                }
            
                setProfiles(tmp_profiles)
                
            }
        }

        get_user_data()
        
        
    }, [])

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