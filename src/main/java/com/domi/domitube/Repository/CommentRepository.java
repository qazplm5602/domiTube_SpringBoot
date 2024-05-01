package com.domi.domitube.Repository;

import com.domi.domitube.Repository.Entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Object> {
    @Transactional
    @Modifying
    @Query("DELETE FROM Comment c WHERE c.reply.id = :id")
    void DeleteChildrenComment(@Param("id") long parent);
}
