# bandcamp-record-player
Play full albums from Bandcamp using a digital record player interface

# Features
- Full screen mode
- Dark and light mode - with toggle
- Skip to next song
- Seek within album
- Skips unplayable songs from Bandcamp album

# Notes

- Bandcamp is an unaffiliated registered trademark. Bandcamp logo is by Bandcamp.
- Fetching Bandcamp album data was inspired by https://github.com/nchlswhttkr/bandcamp-mini-embed
- Note that due to CORS reasons, you will need to run a back-end server of some kind as middleware between bandcamp and your front-end. The script is a simple PHP script using CURL that can be translated to other languages when necessary.
- To add new albums, you will need to retrieve the "albumId". It is most easily found from the embed script you will find on an album page on Bandcamp:
```
(...) src="https://bandcamp.com/EmbeddedPlayer/album=714870486/size=small/ (...)
```

# Preview at:
- https://renevandenberg.github.io/bandcamp-record-player/
- https://bandcamp.theoxygent.nl
