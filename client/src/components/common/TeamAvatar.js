import React from 'react';
import './TeamAvatar.scss';
import { arrayBufferToBase64 } from '../../utils';

const TeamAvatar = ({image, adding}) => {
    // let className = `klih-button ${props.className}`;
    // if (props.block) {
    //     className += ' block';
    // }

    return <div className={'team-image-background' + (adding ? ' adding' : '')}>
        <img 
            src= {
                adding ? 
                    require('../../res/images/plus.png') :
                    !image ?
                        require('../../res/images/profile.png') :
                        'data:image/jpeg;base64,' + arrayBufferToBase64(image.data.data)
            }
            className={'team-avatar'}
            alt='Team avatar'/>
    </div>
};

export default TeamAvatar;
