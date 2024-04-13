package com.domi.domitube.Repository.Entity;

import jakarta.annotation.Nonnull;
import jakarta.persistence.*;

@Entity
@Table(name = "Comment")
public class Comment {
    @Id
    @ManyToOne
    Video video;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @ManyToOne
    @Nonnull
    User writer;

    @ManyToOne
    Comment reply;

    @Column(nullable = false)
    String content;
}
