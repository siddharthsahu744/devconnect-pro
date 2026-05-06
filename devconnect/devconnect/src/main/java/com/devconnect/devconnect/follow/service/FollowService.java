package com.devconnect.devconnect.follow.service;

import com.devconnect.devconnect.follow.model.Follow;

public interface FollowService {
    Follow toggleFollow(Long followerId, Long followingId);
    boolean isFollowing(Long followerId, Long followingId);
    long countFollowers(Long userId);
    long countFollowing(Long userId);
}
