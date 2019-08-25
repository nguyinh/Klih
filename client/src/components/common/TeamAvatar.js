import React from 'react';
import './TeamAvatar.scss';
// import { arrayBufferToBase64 } from '../../utils';
import {
    Icon
} from 'rsuite';

const TeamAvatar = ({image, adding, edit, loading}) => {
    return <>
        <div className={
            'team-image-background' + 
            (adding ? ' adding' : '') +
            (loading ? ' loading' : '')}>
            {
                loading ?
                    // Loader spinner
                    <Icon 
                        icon='circle-o-notch' 
                        spin 
                        size="lg"
                        className='team-image-spinner'/> :
                    <>
                        {/* Team image */}
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
                        {/* Edit icon */}
                        {
                            edit &&
                            <img 
                                src={require('../../res/images/edit.png')}
                                className='edit-icon'
                                alt='Edit icon'/>
                        }
                    </>
            }
        </div>
    </>
};

export default TeamAvatar;
