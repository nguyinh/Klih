import React from 'react';
import './PlayerAvatar.scss';
import { arrayBufferToBase64 } from '../../utils';

const PlayerAvatar = (props) => {
    // let className = `klih-button ${props.className}`;
    // if (props.block) {
    //     className += ' block';
    // }
    const base64Flag = 'data:image/jpeg;base64,';
    const decodedImage = base64Flag + arrayBufferToBase64(props.image.data.data);

    return <div className='image-background'>
        <img 
            src= {
                !props.image ?
                require('../../res/images/profile.png') :
                decodedImage
            }
            className='player-avatar'
            alt='Player avatar'/>
    </div>
};

export default PlayerAvatar;
