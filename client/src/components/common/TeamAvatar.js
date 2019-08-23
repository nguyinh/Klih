import React from 'react';
import './TeamAvatar.scss';
import { arrayBufferToBase64 } from '../../utils';

const TeamAvatar = (props) => {
    // let className = `klih-button ${props.className}`;
    // if (props.block) {
    //     className += ' block';
    // }

    return <div className='team-image-background'>
        <img 
            src= {
                !props.image ?
                require('../../res/images/profile.png') :
                'data:image/jpeg;base64,' + arrayBufferToBase64(props.image.data.data)
            }
            className='team-avatar'
            alt='Team avatar'/>
    </div>
};

export default TeamAvatar;
