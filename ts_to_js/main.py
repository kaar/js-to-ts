import json
import os
import sys
from dataclasses import asdict, is_dataclass
from datetime import datetime

import requests

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if is_dataclass(obj):
            return asdict(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)


class ChatCompletion:
    @classmethod
    def create(cls, request):
        """
        Create a chat completion.

        https://platform.openai.com/docs/guides/chat
        """
        status, data = openai_request(request)
        if status == 200:
            return data
        else:
            raise Exception(data["error"]["message"])


def openai_request(data) -> tuple[int, dict]:
    """
    Make a request to the OpenAI API.
    This is equalant to openai.ChatCompletion.create(**data)
    """

    session = requests.Session()
    response = session.request(
        method="post",
        url="https://api.openai.com/v1/chat/completions",
        headers={
            "User-Agent": "OpenAI/v1 PythonBindings/0.27.0",
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json",
        },
        data=json.dumps(data, cls=CustomJSONEncoder),
        files=None,
        stream=False,
        timeout=600,
    )
    return response.status_code, response.json()


def main():
    instruction = {
        "role": "system",
        "content": "Convert the following javascript code to typescript",
    }
    model = "gpt-3.5-turbo"

    data = sys.stdin.read()
    js_code = {"role": "user", "content": data}

    response = ChatCompletion.create(
        {"model": model, "messages": [instruction, js_code]}
    )
    print(response["choices"][0]["message"]["content"])


if __name__ == "__main__":
    main()
