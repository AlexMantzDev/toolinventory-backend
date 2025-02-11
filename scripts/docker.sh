docker run -d \
 --name postgres01 \
 -e POSTGRES_USER=alex \
 -e POSTGRES_PASSWORD=pass5851 \
 -e POSTGRES_DB=toolinventory \
 -p 5432:5432 \
 postgres:latest