# Database Setup Guide

## PostgreSQL Installation and Setup

### 1. Install PostgreSQL

**Windows:**
- Download PostgreSQL from https://www.postgresql.org/download/windows/
- Run the installer and follow the setup wizard
- Remember the password you set for the 'postgres' user

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database and User

Connect to PostgreSQL as the postgres user:
```bash
psql -U postgres
```

Create the database and user:
```sql
-- Create database
CREATE DATABASE cloud_optimization;

-- Create user (optional, you can use postgres user)
CREATE USER cloud_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE cloud_optimization TO cloud_user;

-- Exit psql
\q
```

### 3. Update Environment Configuration

Update the `.env` file with your database credentials:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/cloud_optimization
# OR if you created a custom user:
# DATABASE_URL=postgresql://cloud_user:your_secure_password@localhost:5432/cloud_optimization
```

### 4. Test Database Connection

You can test the connection by running:
```bash
python -c "from app.database import engine; print('Database connection successful!')"
```

## Alternative: Using Docker

If you prefer to use Docker for PostgreSQL:

```bash
# Run PostgreSQL in Docker
docker run --name cloud-postgres \
  -e POSTGRES_DB=cloud_optimization \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:15

# Update .env file accordingly
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/cloud_optimization
```

## Troubleshooting

### Connection Issues
- Ensure PostgreSQL is running: `sudo systemctl status postgresql` (Linux) or check Services on Windows
- Verify the database exists: `psql -U postgres -l`
- Check firewall settings if using remote database

### Permission Issues
- Ensure the user has proper permissions on the database
- Try connecting manually: `psql -U your_user -d cloud_optimization`

### Port Issues
- Default PostgreSQL port is 5432
- Check if another service is using the port: `netstat -an | grep 5432`
