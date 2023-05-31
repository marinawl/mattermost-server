// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

export const ModalCallUser = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const content = decodeURIComponent(urlParams.get('content')!);
    const imgUrl = decodeURIComponent(urlParams.get('imgUrl')!);
    const name = decodeURIComponent(urlParams.get('name')!);

    const onWindowClose = () => {
        window.close();
    };
    return (
        <div className={'modal-call-user'}>
            <div className={'modal-call-user-profile'}>
                <img
                    src={imgUrl}
                    alt=''
                    loading={'lazy'}
                />
            </div>
            <div className={'modal-call-user-caller'}>
                <p>
                    <strong>{name || ''}</strong>{'님 호출'}
                </p>
            </div>

            <div className={'modal-call-user-content'}>{content || ''}</div>

            <button
                id={'modal-close-btn'}
                onClick={onWindowClose}
            >
                {'확인'}
            </button>
        </div>
    );
};
