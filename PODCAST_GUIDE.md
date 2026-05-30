# EduPocket Podcast Guide

Podcast episodes are MDX files in `content/podcasts`.

## Create an episode

```bash
pnpm new:podcast "Episode Title"
```

The script creates a draft episode and auto-detects the next episode number.

## Audio files

Local audio files go in:

```text
public/audio/
```

Use lowercase slug filenames:

```text
public/audio/how-to-learn-with-ai-without-becoming-lazy.mp3
```

Set frontmatter:

```md
audioSrc: "/audio/how-to-learn-with-ai-without-becoming-lazy.mp3"
duration: "08:42"
```

External audio URLs are supported by setting `audioSrc` to a full `https://` URL.

## Missing audio behavior

If a local audio file is missing, EduPocket does not crash. The player shows:

```text
Audio file is not attached yet. The episode notes are still available.
```

## Transcript support

Set `transcript: true` to show the transcript guide area. The full transcript can be added in the MDX body.

## Publishing checklist

- Episode title is specific.
- Description explains the learning value.
- `episode`, `season`, `duration`, and `language` are correct.
- Audio file exists or missing-audio state is intentional.
- Tags connect to related content.
- `published: true` is set only when ready.
