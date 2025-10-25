# Jekyll GitHub Pages Development Container
FROM ruby:2.7

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    nodejs \
    npm \
    git \
    curl \
    wget \
    vim \
    nano \
    && rm -rf /var/lib/apt/lists/*

# Install a more recent version of Node.js (optional, for better compatibility)
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

# Set the working directory
WORKDIR /site

# Install bundler with the specific version
RUN gem install bundler -v 2.4.22

# Create a non-root user (optional, commented out for simplicity)
# RUN groupadd --gid 1000 developer && \
#     useradd --uid 1000 --gid developer --shell /bin/bash --create-home developer

# Copy Gemfile early for better caching
COPY Gemfile* ./

# Install gems
RUN bundle install

# Expose port 4000 for Jekyll
EXPOSE 4000

# Default command
CMD ["/bin/bash"]