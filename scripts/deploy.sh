if ! command -v docker &> /dev/null; then
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    exit 1
fi

docker-compose down --remove-orphans

docker-compose build --no-cache

docker-compose up -d

docker-compose ps