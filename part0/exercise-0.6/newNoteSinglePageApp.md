sequenceDiagram
    participant browser
    participant server

    Note right of browser: User types a note and clicks "Save"

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa (note content)
    activate server
    server-->>browser: 201 Created (acknowledgment)
    deactivate server

    Note right of browser: The browser updates the UI without reloading
