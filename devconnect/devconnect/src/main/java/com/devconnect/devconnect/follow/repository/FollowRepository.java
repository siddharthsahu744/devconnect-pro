package com.devconnect.devconnect.follow.repository;

import com.devconnect.devconnect.follow.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByFollowerIdAndFollowingId(Long followerId, Long followingId);
    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);
    long countByFollowerId(Long followerId);
    long countByFollowingId(Long followingId);
}
