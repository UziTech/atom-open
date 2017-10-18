# Atom Open

This is an atom package to open URLs with the `atom://` protocol that match the [TextMate URL scheme](http://blog.macromates.com/2007/the-textmate-url-scheme/)

```
atom://open?url=file://<file_path>[&line=<line>[&column=<column>]]
```

### ⚠️ Note ⚠️

This won't actually do anything until [URI handling](https://github.com/atom/atom/pull/11399) gets released in Atom.

## TODO

*   Only open in project window if already open.
*   Open entire project if file is part of a project.
