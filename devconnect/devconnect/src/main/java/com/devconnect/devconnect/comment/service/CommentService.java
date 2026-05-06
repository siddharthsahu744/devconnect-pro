package com.devconnect.devconnect.comment.service;

import com.devconnect.devconnect.comment.model.Comment;

import java.util.List;

public interface CommentService {
    Comment addComment(Comment comment);

    List<Comment> getCommentsByPostId(Long postId);
}
