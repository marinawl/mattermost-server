// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedDate, FormattedMessage, defineMessages} from 'react-intl';

import {BellRingOutlineIcon} from '@mattermost/compass-icons/components';
import type {Channel, ChannelMembership} from '@mattermost/types/channels';
import type {UserProfile as UserProfileType} from '@mattermost/types/users';

import {Permissions} from 'mattermost-redux/constants';
import {NotificationLevel} from 'mattermost-redux/constants/channels';
import {isChannelMuted} from 'mattermost-redux/utils/channel_utils';

import AddGroupsToTeamModal from 'components/add_groups_to_team_modal';
import ChannelNotificationsModal from 'components/channel_notifications_modal';
import EditChannelHeaderModal from 'components/edit_channel_header_modal';
import FormattedMarkdownMessage from 'components/formatted_markdown_message';
import ChannelPermissionGate from 'components/permissions_gates/channel_permission_gate';
import TeamPermissionGate from 'components/permissions_gates/team_permission_gate';
import ProfilePicture from 'components/profile_picture';
import ToggleModalButton from 'components/toggle_modal_button';
import UserProfile from 'components/user_profile';
import EditIcon from 'components/widgets/icons/fa_edit_icon';

import {Constants, ModalIdentifiers} from 'utils/constants';
import {getMonthLong} from 'utils/i18n';
import * as Utils from 'utils/utils';

import AddMembersButton from './add_members_button';
import PluggableIntroButtons from './pluggable_intro_buttons';

type Props = {
    currentUserId: string;
    channel: Channel;
    fullWidth: boolean;
    locale: string;
    channelProfiles: UserProfileType[];
    enableUserCreation?: boolean;
    isReadOnly?: boolean;
    teamIsGroupConstrained?: boolean;
    creatorName: string;
    teammate?: UserProfileType;
    teammateName?: string;
    stats: any;
    usersLimit: number;
    channelMember?: ChannelMembership;
    actions: {
        getTotalUsersStats: () => any;
    };
}

export default class ChannelIntroMessage extends React.PureComponent<Props> {
    componentDidMount() {
        if (!this.props.stats?.total_users_count) {
            this.props.actions.getTotalUsersStats();
        }
    }

    render() {
        const {
            currentUserId,
            channel,
            channelMember,
            creatorName,
            fullWidth,
            locale,
            enableUserCreation,
            isReadOnly,
            channelProfiles,
            teamIsGroupConstrained,
            teammate,
            teammateName,
            stats,
            usersLimit,
        } = this.props;

        let centeredIntro = '';
        if (!fullWidth) {
            centeredIntro = 'channel-intro--centered';
        }

        if (channel.type === Constants.DM_CHANNEL) {
            return createDMIntroMessage(channel, centeredIntro, teammate, teammateName);
        } else if (channel.type === Constants.GM_CHANNEL) {
            return createGMIntroMessage(channel, centeredIntro, channelProfiles, currentUserId, channelMember);
        } else if (channel.name === Constants.DEFAULT_CHANNEL) {
            return createDefaultIntroMessage(channel, centeredIntro, stats, usersLimit, enableUserCreation, isReadOnly, teamIsGroupConstrained);
        } else if (channel.name === Constants.OFFTOPIC_CHANNEL) {
            return createOffTopicIntroMessage(channel, centeredIntro, stats, usersLimit);
        } else if (channel.type === Constants.OPEN_CHANNEL || channel.type === Constants.PRIVATE_CHANNEL) {
            return createStandardIntroMessage(channel, centeredIntro, stats, usersLimit, locale, creatorName);
        }
        return null;
    }
}

const gmIntroMessages = defineMessages({
    muted: {id: 'intro_messages.GM.muted', defaultMessage: 'This group message is currently <b>muted</b>, so you will not be notified.'},
    [NotificationLevel.ALL]: {id: 'intro_messages.GM.all', defaultMessage: 'You\'ll be notified <b>for all activity</b> in this group message.'},
    [NotificationLevel.DEFAULT]: {id: 'intro_messages.GM.all', defaultMessage: 'You\'ll be notified <b>for all activity</b> in this group message.'},
    [NotificationLevel.MENTION]: {id: 'intro_messages.GM.mention', defaultMessage: 'You have selected to be notified <b>only when mentioned</b> in this group message.'},
    [NotificationLevel.NONE]: {id: 'intro_messages.GM.none', defaultMessage: 'You have selected to <b>never</b> be notified in this group message.'},
});

const getGMIntroMessageSpecificPart = (userProfile: UserProfileType | undefined, membership: ChannelMembership | undefined) => {
    const isMuted = isChannelMuted(membership);
    if (isMuted) {
        return (
            <FormattedMessage
                {...gmIntroMessages.muted}
                values={{
                    b: (chunks) => <b>{chunks}</b>,
                }}
            />
        );
    }
    const channelNotifyProp = membership?.notify_props?.desktop || NotificationLevel.DEFAULT;
    const userNotifyProp = userProfile?.notify_props?.desktop || NotificationLevel.MENTION;
    let notifyLevelToUse = channelNotifyProp;
    if (notifyLevelToUse === NotificationLevel.DEFAULT) {
        notifyLevelToUse = userNotifyProp;
    }
    if (channelNotifyProp === NotificationLevel.DEFAULT && userNotifyProp === NotificationLevel.MENTION) {
        notifyLevelToUse = NotificationLevel.ALL;
    }

    return (
        <FormattedMessage
            {...gmIntroMessages[notifyLevelToUse]}
            values={{
                b: (chunks) => <b>{chunks}</b>,
            }}
        />
    );
};

function createGMIntroMessage(channel: Channel, centeredIntro: string, profiles: UserProfileType[], currentUserId: string, channelMembership?: ChannelMembership) {
    const channelIntroId = 'channelIntro';

    if (profiles.length > 0) {
        const currentUserProfile = profiles.find((v) => v.id === currentUserId);
        const pictures = profiles.
        filter((profile) => profile.id !== currentUserId).
        map((profile) => (
            <ProfilePicture
                key={'introprofilepicture' + profile.id}
                src={Utils.imageURLForUser(profile.id, profile.last_picture_update)}
                size='xl'
                userId={profile.id}
                username={profile.username}
            />
        ));

        return (
            <div
                id={channelIntroId}
                className={'channel-intro ' + centeredIntro}
            >
                <div className='post-profile-img__container channel-intro-img'>
                    {pictures}
                </div>
                <p className='channel-intro-text'>
                    <FormattedMessage
                        id='intro_messages.GM.common'
                        defaultMessage={'This is the start of your group message history with {names}.{br}'}
                        values={{
                            names: channel.display_name,
                            br: <br/>,
                        }}
                    />
                    {getGMIntroMessageSpecificPart(currentUserProfile, channelMembership)}
                </p>
                <div style={{display: 'flex'}}>
                    {createNotificationPreferencesButton(channel, currentUserProfile)}

                    {/*
                        채팅 인트로 안에 있는 Board 버튼 숨김처리
                    */}
                    {/*<PluggableIntroButtons channel={channel}/>*/}
                    {createSetHeaderButton(channel)}
                </div>
            </div>
        );
    }

    return (
        <div
            id={channelIntroId}
            className={'channel-intro ' + centeredIntro}
        >
            <p className='channel-intro-text'>
                <FormattedMessage
                    id='intro_messages.group_message'
                    defaultMessage='This is the start of your group message history with these teammates. Messages and files shared here are not shown to people outside this area.'
                />
            </p>
        </div>
    );
}

function createDMIntroMessage(channel: Channel, centeredIntro: string, teammate?: UserProfileType, teammateName?: string) {
    const channelIntroId = 'channelIntro';
    if (teammate) {
        const src = teammate ? Utils.imageURLForUser(teammate.id, teammate.last_picture_update) : '';

        let pluggableButton = null;
        let setHeaderButton = null;
        if (!teammate?.is_bot) {
            pluggableButton = <PluggableIntroButtons channel={channel}/>;
            setHeaderButton = createSetHeaderButton(channel);
        }

        return (
            <div
                id={channelIntroId}
                className={'channel-intro ' + centeredIntro}
            >
                <div className='post-profile-img__container channel-intro-img'>
                    <ProfilePicture
                        src={src}
                        size='xl'
                        userId={teammate?.id}
                        username={teammate?.username}
                        hasMention={true}
                    />
                </div>
                <div className='channel-intro-profile d-flex'>
                    <UserProfile
                        userId={teammate?.id}
                        disablePopover={false}
                        hasMention={true}
                    />
                </div>
                <p className='channel-intro-text'>
                    <FormattedMarkdownMessage
                        id='intro_messages.DM'
                        defaultMessage='This is the start of your direct message history with {teammate}.\nDirect messages and files shared here are not shown to people outside this area.'
                        values={{
                            teammate: teammateName,
                        }}
                    />
                </p>
                <div style={{display: 'flex'}}>
                    {/*
                        채팅 인트로 안에 있는 Board 버튼 숨김처리
                    */}
                    {/*<PluggableIntroButtons channel={channel}/>*/}
                    {setHeaderButton}
                </div>
            </div>
        );
    }

    return (
        <div
            id={channelIntroId}
            className={'channel-intro ' + centeredIntro}
        >
            <p className='channel-intro-text'>
                <FormattedMessage
                    id='intro_messages.teammate'
                    defaultMessage='This is the start of your direct message history with this teammate. Direct messages and files shared here are not shown to people outside this area.'
                />
            </p>
        </div>
    );
}

function createOffTopicIntroMessage(channel: Channel, centeredIntro: string, stats: any, usersLimit: number) {
    const isPrivate = channel.type === Constants.PRIVATE_CHANNEL;
    const children = createSetHeaderButton(channel);
    const totalUsers = stats.total_users_count;

    let setHeaderButton = null;
    if (children) {
        setHeaderButton = (
            <ChannelPermissionGate
                teamId={channel.team_id}
                channelId={channel.id}
                permissions={[isPrivate ? Permissions.MANAGE_PRIVATE_CHANNEL_PROPERTIES : Permissions.MANAGE_PUBLIC_CHANNEL_PROPERTIES]}
            >
                {children}
            </ChannelPermissionGate>
        );
    }
    {/*
        채팅 인트로 안에 있는 Board 버튼 숨김처리
    */}
    const channelInviteButton = (
        <AddMembersButton
            setHeader={setHeaderButton}
            totalUsers={totalUsers}
            usersLimit={usersLimit}
            channel={channel}
            // pluginButtons={<PluggableIntroButtons channel={channel}/>}
        />
    );

    return (
        <div
            id='channelIntro'
            className={'channel-intro ' + centeredIntro}
        >
            <h2 className='channel-intro__title'>
                <FormattedMessage
                    id='intro_messages.beginning'
                    defaultMessage='Beginning of {name}'
                    values={{
                        name: channel.display_name,
                    }}
                />
            </h2>
            <p className='channel-intro__content'>
                <FormattedMessage
                    id='intro_messages.offTopic'
                    defaultMessage='This is the start of {display_name}, a channel for non-work-related conversations.'
                    values={{
                        display_name: channel.display_name,
                    }}
                />
            </p>
            {channelInviteButton}
        </div>
    );
}

function createDefaultIntroMessage(
    channel: Channel,
    centeredIntro: string,
    stats: any,
    usersLimit: number,
    enableUserCreation?: boolean,
    isReadOnly?: boolean,
    teamIsGroupConstrained?: boolean,
) {
    let teamInviteLink = null;
    const totalUsers = stats.total_users_count;
    const isPrivate = channel.type === Constants.PRIVATE_CHANNEL;

    let setHeaderButton = null;
    let pluginButtons = null;
    if (!isReadOnly) {
        pluginButtons = <PluggableIntroButtons channel={channel}/>;
        const children = createSetHeaderButton(channel);
        if (children) {
            setHeaderButton = (
                <ChannelPermissionGate
                    teamId={channel.team_id}
                    channelId={channel.id}
                    permissions={[isPrivate ? Permissions.MANAGE_PRIVATE_CHANNEL_PROPERTIES : Permissions.MANAGE_PUBLIC_CHANNEL_PROPERTIES]}
                >
                    {children}
                </ChannelPermissionGate>
            );
        }
    }

    if (!isReadOnly && enableUserCreation) {
        teamInviteLink = (
            <TeamPermissionGate
                teamId={channel.team_id}
                permissions={[Permissions.INVITE_USER]}
            >
                <TeamPermissionGate
                    teamId={channel.team_id}
                    permissions={[Permissions.ADD_USER_TO_TEAM]}
                >
                    {/*
                        채팅 인트로 안에 있는 Board 버튼 숨김처리
                    */}
                    {!teamIsGroupConstrained &&
                        <AddMembersButton
                            setHeader={setHeaderButton}
                            totalUsers={totalUsers}
                            usersLimit={usersLimit}
                            channel={channel}
                            // pluginButtons={pluginButtons}
                        />
                    }
                    {teamIsGroupConstrained &&
                    <ToggleModalButton
                        className='intro-links color--link'
                        modalId={ModalIdentifiers.ADD_GROUPS_TO_TEAM}
                        dialogType={AddGroupsToTeamModal}
                        dialogProps={{channel}}
                    >
                        <i
                            className='fa fa-user-plus'
                        />
                        <FormattedMessage
                            id='intro_messages.addGroupsToTeam'
                            defaultMessage='Add other groups to this team'
                        />
                    </ToggleModalButton>
                    }
                </TeamPermissionGate>
            </TeamPermissionGate>
        );
    }

    return (
        <div
            id='channelIntro'
            className={'channel-intro ' + centeredIntro}
        >
            <h2 className='channel-intro__title'>
                <FormattedMessage
                    id='intro_messages.beginning'
                    defaultMessage='Beginning of {name}'
                    values={{
                        name: channel.display_name,
                    }}
                />
            </h2>
            <p className='channel-intro__content'>
                {!isReadOnly &&
                    <FormattedMarkdownMessage
                        id='intro_messages.default'
                        defaultMessage='**Welcome to {display_name}!**\n \nPost messages here that you want everyone to see. Everyone automatically becomes a permanent member of this channel when they join the team.'
                        values={{
                            display_name: channel.display_name,
                        }}
                    />
                }
                {isReadOnly &&
                    <FormattedMarkdownMessage
                        id='intro_messages.readonly.default'
                        defaultMessage='**Welcome to {display_name}!**\n \nMessages can only be posted by system admins. Everyone automatically becomes a permanent member of this channel when they join the team.'
                        values={{
                            display_name: channel.display_name,
                        }}
                    />
                }
            </p>
            {teamInviteLink}
            {/*
                채팅 인트로 안에 있는 Board 버튼 숨김처리
            */}
            {/*{teamIsGroupConstrained && pluginButtons}*/}
            {teamIsGroupConstrained && setHeaderButton}
            <br/>
        </div>
    );
}

function createStandardIntroMessage(channel: Channel, centeredIntro: string, stats: any, usersLimit: number, locale: string, creatorName: string) {
    const uiName = channel.display_name;
    let memberMessage;
    const channelIsArchived = channel.delete_at !== 0;
    const totalUsers = stats.total_users_count;

    if (channelIsArchived) {
        memberMessage = '';
    } else if (channel.type === Constants.PRIVATE_CHANNEL) {
        memberMessage = (
            <FormattedMessage
                id='intro_messages.onlyInvited'
                defaultMessage=' Only invited members can see this private channel.'
            />
        );
    } else {
        memberMessage = (
            <FormattedMessage
                id='intro_messages.anyMember'
                defaultMessage=' Any member can join and read this channel.'
            />
        );
    }

    const date = (
        <FormattedDate
            value={channel.create_at}
            month={getMonthLong(locale)}
            day='2-digit'
            year='numeric'
        />
    );

    let createMessage;
    if (creatorName === '') {
        if (channel.type === Constants.PRIVATE_CHANNEL) {
            createMessage = (
                <FormattedMessage
                    id='intro_messages.noCreatorPrivate'
                    defaultMessage='This is the start of the {name} private channel, created on {date}.'
                    values={{name: (uiName), date}}
                />
            );
        } else if (channel.type === Constants.OPEN_CHANNEL) {
            createMessage = (
                <FormattedMessage
                    id='intro_messages.noCreator'
                    defaultMessage='This is the start of the {name} channel, created on {date}.'
                    values={{name: (uiName), date}}
                />
            );
        }
    } else if (channel.type === Constants.PRIVATE_CHANNEL) {
        createMessage = (
            <span>
                <FormattedMessage
                    id='intro_messages.creatorPrivate'
                    defaultMessage='This is the start of the {name} private channel, created by {creator} on {date}.'
                    values={{
                        name: (uiName),
                        creator: (creatorName),
                        date,
                    }}
                />
            </span>
        );
    } else if (channel.type === Constants.OPEN_CHANNEL) {
        createMessage = (
            <span>
                <FormattedMessage
                    id='intro_messages.creator'
                    defaultMessage='This is the start of the {name} channel, created by {creator} on {date}.'
                    values={{
                        name: (uiName),
                        creator: (creatorName),
                        date,
                    }}
                />
            </span>
        );
    }

    let purposeMessage;
    if (channel.purpose && channel.purpose !== '') {
        if (channel.type === Constants.PRIVATE_CHANNEL) {
            purposeMessage = (
                <span>
                    <FormattedMessage
                        id='intro_messages.purposePrivate'
                        defaultMessage=" This private channel's purpose is: {purpose}"
                        values={{purpose: channel.purpose}}
                    />
                </span>
            );
        } else if (channel.type === Constants.OPEN_CHANNEL) {
            purposeMessage = (
                <span>
                    <FormattedMessage
                        id='intro_messages.purpose'
                        defaultMessage=" This channel's purpose is: {purpose}"
                        values={{purpose: channel.purpose}}
                    />
                </span>
            );
        }
    }

    const isPrivate = channel.type === Constants.PRIVATE_CHANNEL;
    let setHeaderButton = null;
    const children = createSetHeaderButton(channel);
    if (children) {
        setHeaderButton = (
            <ChannelPermissionGate
                teamId={channel.team_id}
                channelId={channel.id}
                permissions={[isPrivate ? Permissions.MANAGE_PRIVATE_CHANNEL_PROPERTIES : Permissions.MANAGE_PUBLIC_CHANNEL_PROPERTIES]}
            >
                {children}
            </ChannelPermissionGate>
        );
    }

    /*
    * 채팅 인트로 안에 있는 Board 버튼 숨김처리
    * */
    const channelInviteButton = (
        <AddMembersButton
            totalUsers={totalUsers}
            usersLimit={usersLimit}
            channel={channel}
            setHeader={setHeaderButton}
            // pluginButtons={<PluggableIntroButtons channel={channel}/>}
        />
    );

    return (
        <div
            id='channelIntro'
            className={'channel-intro ' + centeredIntro}
        >
            <h2 className='channel-intro__title'>
                <FormattedMessage
                    id='intro_messages.beginning'
                    defaultMessage='Beginning of {name}'
                    values={{
                        name: (uiName),
                    }}
                />
            </h2>
            <p className='channel-intro__content'>
                {createMessage}
                {memberMessage}
                {purposeMessage}
                <br/>
            </p>
            {channelInviteButton}
        </div>
    );
}

function createSetHeaderButton(channel: Channel) {
    const channelIsArchived = channel.delete_at !== 0;
    if (channelIsArchived) {
        return null;
    }

    return (
        <ToggleModalButton
            modalId={ModalIdentifiers.EDIT_CHANNEL_HEADER}
            ariaLabel={Utils.localizeMessage('intro_messages.setHeader', 'Set a Header')}
            className={'intro-links color--link channelIntroButton'}
            dialogType={EditChannelHeaderModal}
            dialogProps={{channel}}
        >
            <EditIcon/>
            <FormattedMessage
                id='intro_messages.setHeader'
                defaultMessage='Set a Header'
            />
        </ToggleModalButton>
    );
}

function createNotificationPreferencesButton(channel: Channel, currentUser?: UserProfileType) {
    const isGM = channel.type === 'G';
    if (!isGM || !currentUser) {
        return null;
    }

    return (
        <ToggleModalButton
            modalId={ModalIdentifiers.CHANNEL_NOTIFICATIONS}
            ariaLabel={Utils.localizeMessage('intro_messages.notificationPreferences', 'Notification Preferences')}
            className={'intro-links color--link channelIntroButton'}
            dialogType={ChannelNotificationsModal}
            dialogProps={{channel, currentUser}}
        >
            <BellRingOutlineIcon size={16}/>
            <FormattedMessage
                id='intro_messages.notificationPreferences'
                defaultMessage='Notification Preferences'
            />
        </ToggleModalButton>
    );
}
