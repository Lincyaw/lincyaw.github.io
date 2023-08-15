all:
	hugo
	rsync -avz ./public nn@100.101.103.133:/home/nn/www
