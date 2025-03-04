// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';

import type {PluginConfiguration} from 'types/plugins/user_settings';

import PluginSetting from './plugin_setting';

import SettingDesktopHeader from '../setting_desktop_header';
import SettingMobileHeader from '../setting_mobile_header';

type Props = {
    updateSection: (section: string) => void;
    activeSection: string;
    closeModal: () => void;
    collapseModal: () => void;
    settings: PluginConfiguration;
}

const PluginTab = ({
    activeSection,
    closeModal,
    collapseModal,
    settings,
    updateSection,
}: Props) => {
    const intl = useIntl();

    const headerText = intl.formatMessage(
        {id: 'user.settings.plugins.title', defaultMessage: '{pluginName} Settings'},
        {pluginName: settings.uiName},
    );

    return (
        <div>
            <SettingMobileHeader
                closeModal={closeModal}
                collapseModal={collapseModal}
                text={headerText}
            />
            <div className='user-settings'>
                <SettingDesktopHeader text={headerText}/>
                <div className='divider-dark first'/>
                {settings.sections.map(
                    (v) =>
                        (<React.Fragment key={v.title}>
                            <PluginSetting
                                pluginId={settings.id}
                                activeSection={activeSection}
                                section={v}
                                updateSection={updateSection}
                            />
                            <div className='divider-light'/>
                        </React.Fragment>),
                )}
                <div className='divider-dark'/>
            </div>
        </div>
    );
};

export default PluginTab;
