"""YouTube upload via the YouTube Data API v3 (optional dependency).

Setup (one time):
1. Google Cloud Console -> create a project -> enable "YouTube Data API v3".
2. OAuth consent screen -> External -> add yourself as a test user.
3. Credentials -> Create OAuth client ID -> Desktop app -> download JSON to
   ~/.jarvis/client_secrets.json
4. First upload opens a browser to authorize; the token is cached after that.
"""

from __future__ import annotations

from pathlib import Path

from .. import config

SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
CLIENT_SECRETS = config.HOME / "client_secrets.json"
TOKEN_FILE = config.HOME / "youtube_token.json"


def _service():
    try:
        from google.auth.transport.requests import Request
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from googleapiclient.discovery import build
    except ImportError as exc:
        raise RuntimeError(
            "YouTube upload needs extra packages. Run: "
            "pip install google-api-python-client google-auth-oauthlib"
        ) from exc

    if not CLIENT_SECRETS.exists():
        raise RuntimeError(
            f"Missing {CLIENT_SECRETS}. Create a Desktop OAuth client in Google "
            "Cloud Console (YouTube Data API v3) and save the JSON there. "
            "See jarvis/tools/youtube.py for the walkthrough."
        )

    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRETS), SCOPES)
            creds = flow.run_local_server(port=0)
        TOKEN_FILE.write_text(creds.to_json(), encoding="utf-8")
    return build("youtube", "v3", credentials=creds)


def upload(
    path: str,
    title: str,
    description: str = "",
    tags: list[str] | None = None,
    privacy: str = "private",
) -> dict:
    """Upload a video. Defaults to private so nothing goes public by accident."""
    if not Path(path).exists():
        raise FileNotFoundError(path)
    if privacy not in {"private", "unlisted", "public"}:
        raise ValueError("privacy must be private, unlisted, or public")

    from googleapiclient.http import MediaFileUpload

    yt = _service()
    body = {
        "snippet": {"title": title[:100], "description": description[:5000], "tags": tags or []},
        "status": {"privacyStatus": privacy, "selfDeclaredMadeForKids": False},
    }
    media = MediaFileUpload(path, chunksize=8 * 1024 * 1024, resumable=True)
    request = yt.videos().insert(part="snippet,status", body=body, media_body=media)
    response = None
    while response is None:
        _, response = request.next_chunk()
    video_id = response["id"]
    return {
        "video_id": video_id,
        "url": f"https://youtu.be/{video_id}",
        "privacy": privacy,
        "title": title,
    }
