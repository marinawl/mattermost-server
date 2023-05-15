// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

import {FilterVariantIcon} from '@mattermost/compass-icons/components';

import Menu from 'components/widgets/menu/menu';
import MenuWrapper from 'components/widgets/menu/menu_wrapper';
import Tooltip from 'components/tooltip';
import OverlayTrigger from 'components/overlay_trigger';

import {SearchFilterType} from '../search/types';
import {IconContainer} from '../advanced_text_editor/formatting_bar/formatting_icon';

import './files_filter_menu.scss';
import {MenuItemSeparator} from '../menu/menu_item_separator';

type Props = {
    selectedFilter: string;
    onFilter: (filter: SearchFilterType) => void;
};

export default function FilesFilterMenu(props: Props): JSX.Element {
    const {formatMessage} = useIntl();
    const toolTip = (
        <Tooltip
            id='files-filter-tooltip'
            className='hidden-xs'
        >
            <FormattedMessage
                id='channel_info_rhs.menu.files.filter'
                defaultMessage='Filter'
            />
        </Tooltip>
    );

    return (
        <div className='FilesFilterMenu'>
            <MenuWrapper>
                <OverlayTrigger
                    className='hidden-xs'
                    delayShow={500}
                    placement='top'
                    overlay={toolTip}
                    rootClose={true}
                >
                    <IconContainer
                        id='filesFilterButton'
                        className='action-icon dots-icon'
                        type='button'
                    >
                        {props.selectedFilter !== 'all' && <i className='icon-dot'/>}
                        <FilterVariantIcon
                            size={18}
                            color='currentColor'
                        />
                    </IconContainer>
                </OverlayTrigger>
                <Menu
                    ariaLabel={'file menu'}
                    openLeft={true}
                >
                    <Menu.ItemAction
                        ariaLabel={'All file types'}
                        text={formatMessage({id: 'channel_info_rhs.menu.files.filter.all_file_type', defaultMessage: 'All file types'})}
                        onClick={() => props.onFilter('all')}
                        icon={props.selectedFilter === 'all' ? <i className='icon icon-check'/> : null}
                    />
                    <MenuItemSeparator/>
                    <Menu.ItemAction
                        ariaLabel={'Documents'}
                        text={formatMessage({id: 'channel_info_rhs.menu.files.filter.documents', defaultMessage: 'Documents'})}
                        onClick={() => props.onFilter('documents')}
                        icon={props.selectedFilter === 'documents' ? <i className='icon icon-check'/> : null}
                    />
                    <Menu.ItemAction
                        ariaLabel={'Spreadsheets'}
                        text={formatMessage({id: 'channel_info_rhs.menu.files.filter.spreadsheets', defaultMessage: 'Spreadsheets'})}
                        onClick={() => props.onFilter('spreadsheets')}
                        icon={props.selectedFilter === 'spreadsheets' ? <i className='icon icon-check'/> : null}
                    />
                    <Menu.ItemAction
                        ariaLabel={'Presentations'}
                        text={formatMessage({id: 'channel_info_rhs.menu.files.filter.presentations', defaultMessage: 'Presentations'})}
                        onClick={() => props.onFilter('presentations')}
                        icon={props.selectedFilter === 'presentations' ? <i className='icon icon-check'/> : null}
                    />
                    <Menu.ItemAction
                        ariaLabel={'Code'}
                        text={formatMessage({id: 'channel_info_rhs.menu.files.filter.code', defaultMessage: 'Code'})}
                        onClick={() => props.onFilter('code')}
                        icon={props.selectedFilter === 'code' ? <i className='icon icon-check'/> : null}
                    />
                    <Menu.ItemAction
                        ariaLabel={'Images'}
                        text={formatMessage({id: 'channel_info_rhs.menu.files.filter.images', defaultMessage: 'Images'})}
                        onClick={() => props.onFilter('images')}
                        icon={props.selectedFilter === 'images' ? <i className='icon icon-check'/> : null}
                    />
                    <Menu.ItemAction
                        ariaLabel={'Audio'}
                        text={formatMessage({id: 'channel_info_rhs.menu.files.filter.audio', defaultMessage: 'Audio'})}
                        onClick={() => props.onFilter('audio')}
                        icon={props.selectedFilter === 'audio' ? <i className='icon icon-check'/> : null}
                    />
                    <Menu.ItemAction
                        ariaLabel={'Videos'}
                        text={formatMessage({id: 'channel_info_rhs.menu.files.filter.videos', defaultMessage: 'Videos'})}
                        onClick={() => props.onFilter('video')}
                        icon={props.selectedFilter === 'video' ? <i className='icon icon-check'/> : null}
                    />
                </Menu>
            </MenuWrapper>
        </div>
    );
}
