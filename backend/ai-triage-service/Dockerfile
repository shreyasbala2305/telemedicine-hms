# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy required files
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose port
EXPOSE 5006

# Run the application
CMD ["python", "app.py"]
