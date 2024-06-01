package com.domi.domitube.Service;

import jakarta.annotation.PostConstruct;
import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.builder.FFmpegBuilder;
import net.bramp.ffmpeg.probe.FFmpegProbeResult;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class FFmpegService {
    final String directory = System.getenv("DOMI_FFMPEG");

    private FFmpeg ffmpeg;
    private FFprobe ffprobe;

    @PostConstruct
    void Init() throws IOException {
        ffmpeg = new FFmpeg(directory + "/ffmpeg.exe");
        ffprobe = new FFprobe(directory + "/ffprobe.exe");
    }

    public double GetVideoDuration(String path) throws IOException {
        FFmpegProbeResult result = ffprobe.probe(path);
        return result.getFormat().duration;
    }

    public void CreateThumbnail(String video, String image) {
        FFmpegBuilder builder = new FFmpegBuilder()
                .overrideOutputFiles(true)
                .setInput(video)
                .addExtraArgs("-ss", "00:00:01")
                .addOutput(image)
                .setFrames(1)
                .done();

        FFmpegExecutor executer = new FFmpegExecutor(ffmpeg, ffprobe);
        executer.createJob(builder).run();
    }
}
