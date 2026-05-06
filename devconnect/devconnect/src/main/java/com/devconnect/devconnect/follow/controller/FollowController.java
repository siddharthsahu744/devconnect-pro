package com.devconnect.devconnect.follow.controller;

import com.devconnect.devconnect.follow.model.Follow;
import com.devconnect.devconnect.follow.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/follow")
public class FollowController {
    @Autowired
    private FollowService service;

    @PostMapping("/toggle")
    public Follow toggle(@RequestParam Long followerId,
                         @RequestParam Long followingId) {
        return service.toggleFollow(followerId, followingId);
    }

    @GetMapping("/status")
    public boolean checkStatus(@RequestParam Long followerId,
                               @RequestParam Long followingId) {
        return service.isFollowing(followerId, followingId);
    }

    @GetMapping("/followers/{userId}")
    public long getFollowersCount(@PathVariable Long userId) {
        return service.countFollowers(userId);
    }

    @GetMapping("/following/{userId}")
    public long getFollowingCount(@PathVariable Long userId) {
        return service.countFollowing(userId);
    }
}
