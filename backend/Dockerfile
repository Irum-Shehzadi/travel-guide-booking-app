# Python runtime environment image
FROM python:3.11-slim

# Set working directory
WORKDIR /code

# Copy requirements file first to leverage Docker cache
COPY ./requirements.txt /code/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the rest of the backend files
COPY . /code

# Run the FastAPI app (main.py handles reading the port from environment variables)
CMD ["python", "main.py"]
