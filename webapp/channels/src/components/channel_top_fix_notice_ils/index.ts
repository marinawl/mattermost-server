// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect, ConnectedProps} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {getCurrentChannel, getCurrentChannelStats} from 'mattermost-redux/selectors/entities/channels';

import {GlobalState} from 'types/store';

import {getSearchNoticeForILS, UserActivityPost} from "mattermost-redux/selectors/entities/posts";
import ChannelTopFixNoticeILS from "./channel_top_fix_notice_ils";
import {getPinnedPostsForILS, showPinnedPosts} from "../../actions/views/rhs";
import {getCurrentUserId} from "mattermost-redux/selectors/entities/common";
import {getUser} from "mattermost-redux/selectors/entities/users";
import {getIsMobileView} from "../../selectors/views/browser";
import {Locations} from "../../utils/constants";

interface OwnProps {
    location: keyof typeof Locations;
}

function mapStateToProps(state: GlobalState, ownProps: OwnProps) {
    const channel = getCurrentChannel(state);

    const newNoticeForILS = getSearchNoticeForILS(state);
    const stats = getCurrentChannelStats(state);
    const user = getUser(state, newNoticeForILS?.[0]?.user_id);
    const isBot = Boolean(user && user.is_bot);

    return {
        location: ownProps.location,
        newNoticeForILS: newNoticeForILS?.[0] || null,
        pinnedPostsCount: stats?.pinnedpost_count || 0,
        channelId: channel ? channel.id : '',
        currentUserId: getCurrentUserId(state),
        isMobileView: getIsMobileView(state),
        isBot
    };
}

const mapDispatchToProps = ({
    getPinnedPostsForILS,
    showPinnedPosts,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export type PropsFromRedux = ConnectedProps<typeof connector>;

export default withRouter(connector(ChannelTopFixNoticeILS));
