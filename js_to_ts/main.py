import json
import logging
import os
import sys

import requests

logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger(__name__)


OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")


class ChatCompletion:
    @classmethod
    def create(cls, request):
        """
        Create a chat completion.

        https://platform.openai.com/docs/guides/chat
        """
        LOGGER.debug("request: %s", json.dumps(request, indent=2))
        status, data = openai_request(request)
        LOGGER.debug("response: %s", json.dumps(data, indent=2))
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
        data=json.dumps(data),
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

    if "--debug" in sys.argv:
        LOGGER.setLevel(logging.DEBUG)
        sys.argv.remove("--debug")

    # If argument
    if len(sys.argv) > 1:
        file_name = sys.argv[1]
        with open(file_name, "r") as f:
            input = f.read()

        data = f"{file_name}:\n"
        data += input
    else:
        data = sys.stdin.read()

    js_code = {"role": "user", "content": data}

    response = ChatCompletion.create(
        {"model": model, "messages": [instruction, js_code], "temperature": 0.2}
    )
    print(response["choices"][0]["message"]["content"])


if __name__ == "__main__":
    main()
