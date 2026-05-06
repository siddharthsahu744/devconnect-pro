package com.devconnect.devconnect.comment.repository;

import com.devconnect.devconnect.comment.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}
