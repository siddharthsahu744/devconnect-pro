package com.devconnect.devconnect.like.controller;

import com.devconnect.devconnect.like.model.Like;
import com.devconnect.devconnect.like.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeService service;

    @PostMapping("/toggle")
    public Like toggleLike(@RequestParam Long userId,
                           @RequestParam Long postId) {
        return service.toggleLike(userId, postId);
    }

    @GetMapping("/count/{postId}")
    public long countLikes(@PathVariable Long postId) {
        return service.countLikesByPostId(postId);
    }

    @GetMapping("/status")
    public boolean checkLikeStatus(@RequestParam Long userId,
                                   @RequestParam Long postId) {
        return service.hasUserLiked(userId, postId);
    }
}