# 1. Copiar env
cp .env.example .env

# 2. Levantar todo (primera vez: construye imagen + BD)
docker-compose up --build

# 3. En otra terminal, migrar la BD y crear el admin
docker-compose exec web sh -c "npx prisma migrate deploy && npx prisma db seed"