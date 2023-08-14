all:
	hugo
	rsync -avz ./public nn@azure:/home/nn/www
