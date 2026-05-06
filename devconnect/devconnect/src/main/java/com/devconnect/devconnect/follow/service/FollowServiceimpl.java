package com.devconnect.devconnect.follow.service;

import com.devconnect.devconnect.follow.model.Follow;
import com.devconnect.devconnect.follow.repository.FollowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FollowServiceimpl implements FollowService {
    @Autowired
    private FollowRepository repo;

    @Override
    public Follow toggleFollow(Long followerId, Long followingId) {

        Optional<Follow> existing =
                repo.findByFollowerIdAndFollowingId(followerId, followingId);

        if (existing.isPresent()) {
            repo.delete(existing.get());
            return null; // unfollow
        }

        Follow follow = new Follow();
        follow.setFollowerId(followerId);
        follow.setFollowingId(followingId);

        return repo.save(follow);
    }

    @Override
    public boolean isFollowing(Long followerId, Long followingId) {
        return repo.existsByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Override
    public long countFollowers(Long userId) {
        return repo.countByFollowingId(userId);
    }

    @Override
    public long countFollowing(Long userId) {
        return repo.countByFollowerId(userId);
    }
}
