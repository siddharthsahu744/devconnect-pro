package com.devconnect.devconnect.post.service;

import com.devconnect.devconnect.post.model.Post;
import com.devconnect.devconnect.post.repository.PostRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Service
public class PostService {
    @Autowired
    private PostRepository repo;

    public Post create(Post post) {
        post.setCreatedAt(LocalDateTime.now());
        return repo.save(post);
    }

    public List<Post> getAll() {
        return repo.findAll();
    }

    public List<Post> getByUser(Long userId) {
        return repo.findByUserId(userId);
    }

}
