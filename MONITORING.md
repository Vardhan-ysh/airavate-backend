# 📊 Monitoring & Metrics Setup

This project includes comprehensive monitoring with **Prometheus** for metrics collection and **Grafana** for visualization.

## 🚀 Quick Start

The monitoring stack starts automatically with the development environment:

```bash
npm run dev
```

## 📈 Monitoring Stack

### **Prometheus** (Port 9090)
- **URL**: http://localhost:9090
- **Purpose**: Metrics collection and storage
- **Metrics Endpoint**: http://localhost:3000/metrics

### **Grafana** (Port 3001)
- **URL**: http://localhost:3001
- **Login**: admin / admin123
- **Purpose**: Data visualization and dashboards

## 🔍 Available Metrics

### **HTTP Metrics**
- `airavate_backend_http_requests_total` - Total HTTP requests
- `airavate_backend_http_request_duration_seconds` - Request duration histogram

### **System Metrics**
- `airavate_backend_active_connections` - Active connections
- `airavate_backend_database_connections` - Database connections
- `airavate_backend_process_cpu_seconds_total` - CPU usage
- `airavate_backend_process_resident_memory_bytes` - Memory usage

### **Authentication Metrics**
- `airavate_backend_auth_attempts_total` - Authentication attempts

### **Business Metrics**
- `airavate_backend_user_registrations_total` - User registrations
- `airavate_backend_api_calls_total` - API calls by endpoint

## 🛠️ Manual Control

```bash
# Start monitoring services
npm run monitoring:start

# Stop monitoring services
npm run monitoring:stop

# View monitoring logs
npm run monitoring:logs

# Check metrics endpoint
npm run metrics
```

## 📊 Dashboard Features

The pre-configured Grafana dashboard includes:
- HTTP request rate and duration
- Active connections
- Memory and CPU usage
- Database connection health
- Authentication success/failure rates

## 🔧 Configuration Files

- `monitoring/docker-compose.yml` - Docker services
- `monitoring/prometheus.yml` - Prometheus configuration
- `monitoring/grafana/` - Grafana provisioning
- `src/config/metrics.ts` - Metrics definitions
- `src/middleware/metrics.middleware.ts` - Metrics collection
