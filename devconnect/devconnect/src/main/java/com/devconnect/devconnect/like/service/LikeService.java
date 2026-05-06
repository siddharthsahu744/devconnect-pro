package com.devconnect.devconnect.like.service;

import com.devconnect.devconnect.like.model.Like;

public interface LikeService {
    Like toggleLike(Long userId, Long postId);
    long countLikesByPostId(Long postId);
    boolean hasUserLiked(Long userId, Long postId);
}
