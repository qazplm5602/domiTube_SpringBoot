package com.domi.domitube.Repository.Entity;

import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Data
@NoArgsConstructor
//@IdClass(CommentPK.class)
@Table(name = "Comment")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @ManyToOne
    Video video;

    @ManyToOne
    @Nonnull
    User writer;

    @ManyToOne
    Comment reply;

    @Column(nullable = false)
    String content;
}
