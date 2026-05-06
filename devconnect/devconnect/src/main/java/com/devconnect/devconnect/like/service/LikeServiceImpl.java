package com.devconnect.devconnect.like.service;


import com.devconnect.devconnect.like.model.Like;
import com.devconnect.devconnect.like.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LikeServiceImpl implements LikeService{
    @Autowired
    private LikeRepository repo;

    @Override
    public Like toggleLike(Long userId, Long postId) {

        Optional<Like> existing = repo.findByUserIdAndPostId(userId, postId);

        if (existing.isPresent()) {
            repo.delete(existing.get());
            return null; // unlike
        }

        Like like = new Like();
        like.setUserId(userId);
        like.setPostId(postId);

        return repo.save(like);
    }

    @Override
    public long countLikesByPostId(Long postId) {
        return repo.countByPostId(postId);
    }

    @Override
    public boolean hasUserLiked(Long userId, Long postId) {
        return repo.existsByUserIdAndPostId(userId, postId);
    }
}
