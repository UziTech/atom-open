# Atom Open

[![Build Status](https://travis-ci.com/UziTech/atom-open.svg?branch=master)](https://travis-ci.com/UziTech/atom-open)
[![Build status](https://ci.appveyor.com/api/projects/status/jpgf8gpx0nqwubrb/branch/master?svg=true)](https://ci.appveyor.com/project/UziTech/atom-open)

This is an atom package to open URLs with the `atom://` protocol that match the [TextMate URL scheme](http://blog.macromates.com/2007/the-textmate-url-scheme/)

```
atom://open?url=file://<file_path>[&line=<line>[&column=<column>]][&devMode][&safeMode][&newWindow]
```

## Parameters

*   **url**: The path to the file you want to open. Can start with `file://` to comply with the TextMate standard.
*   **file**: Synonym to **url**
*   **line**: The line to set the cursor on
*   **column**: The column to set the cursor on
*   **devMode**: If exists will open in dev mode
*   **safeMode**: If exists will open in safe mode
*   **newWindow**: If exists will open in a new window even if the file is already open in a window

## Settings

*   **Confirm**: Confirm before opening the file
*   **Open Project**: Open the project folder as well as the file if the file is part of a project
