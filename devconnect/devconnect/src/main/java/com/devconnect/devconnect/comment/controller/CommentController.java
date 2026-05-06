package com.devconnect.devconnect.comment.controller;

import com.devconnect.devconnect.comment.model.Comment;
import com.devconnect.devconnect.comment.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    private CommentService service;

    @PostMapping
    public Comment add(@RequestBody Comment comment) {
        return service.addComment(comment);
    }

    @GetMapping("/post/{postId}")
    public List<Comment> getByPost(@PathVariable Long postId) {
        return service.getCommentsByPostId(postId);
    }
}
