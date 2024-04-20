package com.domi.domitube.Repository.Entity;

import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "User")
public class User {
    @Id
    String id;

    @Column(length = 15, nullable = false)
    String name;

    @Column(length = 100, nullable = false)
    String password;

    @Column(nullable = false)
    Boolean image;

    @Column(nullable = false)
    Boolean banned;

    @Column(nullable = false)
    Boolean banner;

    @OneToMany
    List<Video> videos;
}