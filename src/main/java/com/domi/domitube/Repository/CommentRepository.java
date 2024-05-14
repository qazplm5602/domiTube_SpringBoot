package com.domi.domitube.Repository;

import com.domi.domitube.Repository.Entity.Comment;
import com.domi.domitube.Repository.Entity.User;
import com.domi.domitube.Repository.Entity.Video;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Object> {
    @Transactional
    @Modifying
    @Query("DELETE FROM Comment c WHERE c.reply.id = :id")
    void DeleteChildrenComment(@Param("id") long parent);

    @Query("SELECT c FROM Comment c WHERE c.reply is NULL AND c.video = :video ORDER BY c.created DESC")
    List<Comment> GetVideoCommentsNoReply(@Param("video") Video video, Pageable page);

    @Query("SELECT new map(c.reply.id AS id, count(c) AS amount) FROM Comment c WHERE c.reply is not NULL AND c.reply.id IN :ids GROUP BY c.reply")
    List<Map<String, Object>> GetCommentReplyAmounts(@Param("ids") List<Long> comments);

    @Query("SELECT c FROM Comment c WHERE c.reply = :comment ORDER BY c.created DESC")
    List<Comment> GetReplysComment(@Param("comment") Comment comment);

    @Query("SELECT new map(c.reply as target, count(c) as amount) FROM Comment c WHERE c.video.owner = :user AND c.reply is not NULL GROUP BY c.reply ORDER BY count(c) DESC")
    List<Map<String, Object>> GetCommentsTopReply(@Param("user") User user, Pageable pageable);
}
