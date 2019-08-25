import React from 'react';
import './TeamAvatar.scss';
import { arrayBufferToBase64 } from '../../utils';

const TeamAvatar = ({image, adding, edit}) => {
    return <>
        <div className={'team-image-background' + (adding ? ' adding' : '')}>
            <img 
                src= {
                    adding ? 
                        require('../../res/images/plus.png') :
                        !image ?
                            require('../../res/images/team.png') :
                            'data:image/jpeg;base64,' + image.data
                }
                className='team-avatar'
                alt='Team avatar'/>
            {
                edit &&
                <img 
                    src={require('../../res/images/edit.png')}
                    className='edit-icon'
                    alt='Edit icon'/>
            }
        </div>
    </>
};

export default TeamAvatar;
