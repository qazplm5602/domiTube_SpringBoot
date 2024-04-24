package com.domi.domitube.Repository.Entity;

import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@Table(name = "Video")
public class Video {
    @Id
    String id;

    @ManyToOne
    @Nonnull
    User owner;

    @Column(nullable = false)
    String title;

    @Column
    String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    VideoSecretType secret;

    @Column(nullable = false)
    long views;

    @Column(nullable = false)
    long good;
    @Column(nullable = false)
    long dislike;

    @Column(nullable = false)
    Date created;

    @OneToMany
    List<Comment> comments;

    public enum VideoSecretType {
        Public,
        HalfPublic,
        Private
    }
}

