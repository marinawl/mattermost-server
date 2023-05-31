// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {ModalCallUser} from './command_modal_callUser';
import './command_modal.scss';

type Props = {
    match?: {
        path: string;
        url: string;
        isExact: boolean;
        params: object;
    };
}

export const CommandModal = ({match}: Props) => {
    const defUrl = match?.path || '';
    return (
        <Switch>
            <Route
                path={`${defUrl}/callUser`}
                component={ModalCallUser}
            />
        </Switch>
    );
};
