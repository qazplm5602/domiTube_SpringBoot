package com.domi.domitube.DTO;

import com.domi.domitube.Repository.Entity.Video;
import lombok.Builder;

import java.time.ZoneOffset;

@Builder
public class VideoDataDTO {
    public String id;
    public String title;
    public String description;
    public String channel;
    public long views;
    public long good;
    public long bad;
    public long create;
    public double time;

    static public VideoDataDTO ConvertVideo(Video video) {
        return VideoDataDTO.builder()
                .id(video.getId())
                .title(video.getTitle())
                .description(video.getDescription())
                .channel(video.getOwner().getId())
                .views(video.getViews())
                .good(video.getGood())
                .bad(video.getDislike())
                .time(video.getTime())
                .create(video.getCreated().toInstant(ZoneOffset.of("+09:00")).toEpochMilli())
        .build();
    }
}
