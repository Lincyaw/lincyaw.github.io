all:
	hugo
	rsync -avz ./public azureuser@20.2.240.114:/home/azureuser/www
