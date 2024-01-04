# Use an official Python runtime as a parent image
FROM python:3.12-slim-bullseye

# Set the working directory in the container to /app
WORKDIR /app

# Add the current directory contents into the container at /app
ADD . /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
  gcc \
  python3-dev


# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run the command to start the Flask server
CMD ["flask", "--app", "server/app.py", "--debug", "run", "--host", "0.0.0.0", "--port", "8000"]
