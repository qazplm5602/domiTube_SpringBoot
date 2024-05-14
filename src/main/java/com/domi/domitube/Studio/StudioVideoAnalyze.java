package com.domi.domitube.Studio;

import com.domi.domitube.DTO.VideoDataDTO;
import lombok.Data;

@Data
public class StudioVideoAnalyze {
    VideoDataDTO last;
    VideoDataDTO popular;
    VideoDataDTO good;
}
