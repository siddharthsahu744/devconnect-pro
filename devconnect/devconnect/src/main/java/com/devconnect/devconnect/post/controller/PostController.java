package com.devconnect.devconnect.post.controller;

import com.devconnect.devconnect.post.model.Post;
import com.devconnect.devconnect.post.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService service;

    @PostMapping
    public Post create(@RequestBody Post post) {
        return service.create(post);
    }

    @GetMapping
    public List<Post> all() {
        return service.getAll();
    }

    @GetMapping("/user/{id}")
    public List<Post> byUser(@PathVariable Long id) {
        return service.getByUser(id);
    }

}
