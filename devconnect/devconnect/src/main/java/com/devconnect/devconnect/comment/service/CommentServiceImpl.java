package com.devconnect.devconnect.comment.service;

import com.devconnect.devconnect.comment.model.Comment;
import com.devconnect.devconnect.comment.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService{
    @Autowired
    private CommentRepository repo;

    @Override
    public Comment addComment(Comment comment) {
        return repo.save(comment);
    }

    @Override
    public List<Comment> getCommentsByPostId(Long postId) {
        return repo.findAll()
                .stream()
                .filter(c -> c.getPostId().equals(postId))
                .collect(Collectors.toList());
    }
}
