# MarkMapMaker

## Environment Variables

- **GEMINI_API_KEY**:  
  Obtain it at [Google AI Studio](https://aistudio.google.com/apikey).
- **Other variables**:  
  Copy them from the `.env-example` file provided.

## Setup Instructions

1. Clone the project and navigate to `project/Maker/MarkMapMaker`.
2. Run `npm install` to install dependencies.
3. Create a `.env` file by copying `.env-example`.
4. Generate your API key and set the `GEMINI_API_KEY` value in the `.env` file.

## Usage

- **Generate a Markmap**  
  ```bash
  node app.js {{topic_name}} {{topic_full_prompt}}
  ```
  - If no `topic_full_prompt` is provided, `topic_name` will be used instead.

- **Delete a Markmap**  
  ```bash
  node delete.js {{topic_name}}
  ```
  - This will delete the topic from all directories and files.
