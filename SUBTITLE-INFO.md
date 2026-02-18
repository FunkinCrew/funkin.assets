Hi this is Eric with a quick guide.

1. Write your `.ass` file in your program of choice. I use Aegisub.
2. Combine the subtitles in, making sure to define the language of the subtitle track, something like so:

```
ffmpeg -i input.mp4 -i input.srt -c:v copy -c:s copy -metadata:s:1 language=English -metadata:s:s:0 language=English output.mkv
```

Note that output MUST be MKV because the MP4 file format doesn't support advanced subtitles.
