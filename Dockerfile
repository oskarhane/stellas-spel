FROM nginx:alpine

# Copy the static files
COPY . /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Make port configurable
ENV PORT=80

# Expose the port
EXPOSE ${PORT}

# Start Nginx
CMD sed -i "s/\$PORT/$PORT/g" /etc/nginx/nginx.conf && nginx -g 'daemon off;'
