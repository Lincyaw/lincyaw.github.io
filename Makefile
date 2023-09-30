all:
	hugo
	rsync -avz ./public azureuser@100.78.214.97:/home/azureuser/www
