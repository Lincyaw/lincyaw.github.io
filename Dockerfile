# Use Ruby 2.7 which is compatible with GitHub Pages
FROM ruby:2.7

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /site

# Copy Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install bundler and gems
RUN gem install bundler -v 2.4.22 && bundle install

# Copy the site source
COPY . .

# Expose port 4000
EXPOSE 4000

# Command to serve the site
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]