// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {RouteComponentProps} from 'react-router-dom';

import type {PropsFromRedux} from './index';
import PostProfilePicture from "../post_profile_picture";
import Timestamp, {RelativeRanges} from "../timestamp";
import moment, {Moment} from 'moment-timezone';
import FileAttachmentListContainer from "../file_attachment_list";
import PostUserProfile from "../post/user_profile";
import * as PostUtils from "../../utils/post_utils";
import IconSpeaker from 'images/icons/ils_icon_speaker_fill.svg';
import IconCampaign from 'images/icons/ils_icon_campaign_fill.svg';

export type Props = PropsFromRedux & RouteComponentProps<{
    postid?: string;
}>;

type State = {
    isExtend: boolean | null;
};

export default class ChannelTopFixNoticeILS extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isExtend: null,
        }
    }

    componentDidUpdate(prevProps: Props) {
        console.log(prevProps, this.props)

        if(this.props.channelId && this.props.pinnedPostsCount > 0) {
            if(!this.props.newNoticeForILS || (JSON.stringify(this.props.newNoticeForILS) !== JSON.stringify(prevProps.newNoticeForILS))) {
                this.props.getPinnedPostsForILS(this.props.channelId)
            }
        }
    }

    handleOnExtend() {
        this.setState({isExtend: !(this.state.isExtend || false)});
    }

    render() {
        const isSystemMessage = false;
        const {isExtend} = this.state;

        return (
            this.props.newNoticeForILS ? (
                <div className={`channel_top_fix_notice_form ${isExtend !== null ? (isExtend ? 'channel_top_fox_notice_fade_in_dropdown' : 'channel_top_fox_notice_fade_out_dropdown') : ''}`}>
                    <div className={'channel_top_fix_notice_title'} onClick={() => this.props.showPinnedPosts()}>
                        {/*<i
                            aria-hidden='true'
                            className='icon icon-bullhorn channel-header__pin'
                        />*/}
                        <img src={IconCampaign} alt=""/>

                        <div>
                            {this.props.newNoticeForILS && (
                                <PostProfilePicture
                                    compactDisplay={false}
                                    post={this.props.newNoticeForILS}
                                    userId={this.props.newNoticeForILS?.user_id}
                                />
                            )}

                            <div className={'channel_top_fix_notice_content'}>
                                {this.props.newNoticeForILS && (
                                    <PostUserProfile
                                        {...this.props}
                                        isSystemMessage={isSystemMessage}
                                        post={this.props.newNoticeForILS}
                                    />
                                )}

                                <p>
                                    {(this.props.newNoticeForILS?.file_ids && this.props.newNoticeForILS?.file_ids.length > 0 && !this.props.newNoticeForILS?.message) && (
                                        '첨부파일만 등록된 공지사항입니다.'
                                    )}
                                    {this.props.newNoticeForILS?.message}
                                </p>

                                {this.props.newNoticeForILS?.file_ids && this.props.newNoticeForILS?.file_ids.length > 0 &&
                                    <FileAttachmentListContainer
                                        post={this.props.newNoticeForILS}
                                        compactDisplay={false}
                                        notUseSingleViewILS={true}
                                        // handleFileDropdownOpened={true}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                    <div className={`channel_top_fix_notice_etc`} onClick={this.handleOnExtend.bind(this)}>
                        <span>{moment(this.props.newNoticeForILS?.update_at).format('YYYY-MM-DD HH:mm')}</span>

                        <i
                            aria-hidden='true'
                            className={`icon icon-chevron-down ${isExtend ? 'icon-chevron-rotate-down' : 'icon-chevron-rotate-up'}`}
                        />
                    </div>
                </div>
            ) : <></>
        );
    }
}
