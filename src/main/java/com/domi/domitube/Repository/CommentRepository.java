package com.domi.domitube.Repository;

import com.domi.domitube.Repository.Entity.Comment;
import com.domi.domitube.Repository.Entity.Video;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Object> {
    @Transactional
    @Modifying
    @Query("DELETE FROM Comment c WHERE c.reply.id = :id")
    void DeleteChildrenComment(@Param("id") long parent);

    @Query("SELECT c FROM Comment c WHERE c.reply = NULL AND c.video = :video ORDER BY c.created DESC")
    List<Comment> GetVideoCommentsNoReply(@Param("video") Video video, Pageable page);

}
