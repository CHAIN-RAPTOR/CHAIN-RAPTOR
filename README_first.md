# QPN-0+ v2.5.0: A Google Cloud Native Post-Quantum Security Platform

## Project Abstract

QPN-0+ is an architectural blueprint and interactive simulation for a next-generation security platform built on a foundational Zero Trust philosophy. It models a system that integrates NIST-standardized Post-Quantum Cryptography (PQC), a Gemini-powered AI security co-pilot, and a clear deployment path to Google Cloud, providing a comprehensive, defense-in-depth solution for the quantum era.

This repository defines a two-part system:
1.  **The Native Desktop Client:** A user-facing control panel built with a modern web stack that provides an intuitive interface for managing secure connections. This client is fully architected with all necessary placeholders for backend integration.
2.  **The Backend Concentrator:** A high-performance server application designed to terminate thousands of PQC-secured tunnels, architected for deployment on Google Kubernetes Engine (GKE) or as a decoupled, private service.

---

## The Native Desktop Client

The user interface is built as a modern web application and can be packaged into a native desktop executable using frameworks like Electron. This provides a cross-platform client for Windows, macOS, and Linux from a single codebase.

### Building the Client

**Prerequisites:**
*   Node.js and npm

**Steps:**
1.  Clone the repository and navigate to the project root.
2.  Install dependencies: `npm install`
3.  To run in development mode: `npm start`
4.  To build for production: `npm run build`

---

## Connecting the Backend

This frontend is now fully prepared for integration with a live backend. A comprehensive guide with API endpoint specifications, expected data schemas, and authentication flow details is available for the backend engineering team.

**Please refer to `README_backend_integration.md` for all technical integration instructions.**

---

## Production-Grade Backend Concentrator Architecture

The frontend client is designed to connect to a separate, high-performance backend server, the Concentrator. This backend is responsible for all heavy lifting: managing low-level network connections, executing PQC handshakes, and routing traffic. The following describes a feasible, scalable, and robust architecture.

### 1. Core Logic (Go Blueprint)

A complete implementation blueprint for the concentrator is provided in `backend/main.go`. This has been upgraded to be a realistic, code-correct example demonstrating a full PQC handshake using the **Open Quantum Safe (OQS)** library. It serves as the definitive architectural guide for building the production backend.

### 2. Scalability & State Management

To achieve high availability and horizontal scalability, the concentrator application **must be stateless**. Each instance (pod/container) must be able to handle any client's traffic without relying on local session memory.

*   **Session State:** Any required session state (e.g., user-to-IP mappings, connection metadata) should be externalized to a distributed, low-latency data store like **Redis** or **Google Cloud Memorystore**. This allows any concentrator instance to look up session data, enabling seamless scaling and recovery.

### 3. Observability (Logging, Metrics, Tracing)

A production system is blind without robust observability.
*   **Structured Logging:** The application must output logs in a structured format (e.g., JSON). This allows for easy ingestion, parsing, and analysis by log aggregation platforms like **Google Cloud Logging** or the ELK stack.
*   **Metrics:** The application should expose key performance indicators (KPIs) in a Prometheus-compatible format. Metrics should include active connections, handshake latency, data throughput per client, and error rates. This is essential for monitoring, alerting, and capacity planning.
*   **Tracing:** For complex microservices, implement distributed tracing using standards like **OpenTelemetry** to diagnose latency issues across services.

### 4. Security Hardening

*   **Configuration & Secrets:** Application configuration should be managed via environment variables or mounted config files, populated by **Kubernetes ConfigMaps**. Sensitive data (e.g., long-term server private keys, API keys) must be stored and mounted using **Kubernetes Secrets** or a service like **Google Secret Manager**.
*   **Network Policies:** In Kubernetes, use `NetworkPolicy` resources to enforce a Zero Trust network model, explicitly defining which pods can communicate with each other. By default, all ingress/egress should be denied.
*   **Vulnerability Scanning:** Integrate automated container image scanning (e.g., **Google Artifact Registry scanning**) into your CI/CD pipeline to detect and block known vulnerabilities before they reach production.

---

## Deployment on Google Kubernetes Engine (GKE)

The backend concentrator is architected to be a stateless, containerized application, making it ideal for scalable deployment on GKE. The following files provide the blueprint for this deployment.

### 1. Containerization (`Dockerfile`)
```Dockerfile
# Use the official Go image as a builder
FROM golang:1.22-alpine as builder

# Install liboqs dependencies
RUN apk add --no-cache cmake gcc g++ linux-headers make ninja

# Clone and build a specific, vetted version of liboqs
RUN git clone --branch 0.10.0 https://github.com/open-quantum-safe/liboqs.git && \
    cd liboqs && mkdir build && cd build && \
    cmake -GNinja -DBUILD_SHARED_LIBS=ON .. && \
    ninja && ninja install

WORKDIR /app
COPY go.mod ./
COPY go.sum ./
RUN go mod download
COPY . .

# Build the Go application with security flags
RUN CGO_ENABLED=1 go build -ldflags="-w -s" -o qpn-concentrator .

# Use a minimal, hardened base image for the final container
FROM alpine:latest
# Create a non-root user for the application
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the liboqs shared library and the built binary from the builder stage
COPY --from=builder /usr/local/lib/liboqs.so.10 /usr/local/lib/
COPY --from=builder /app/qpn-concentrator /qpn-concentrator

# Switch to the non-root user
USER appuser

EXPOSE 443
ENTRYPOINT ["/qpn-concentrator"]
```

### 2. GKE Deployment & Service (`deployment.yaml`, `service.yaml`)
These manifests deploy and expose the container. The `replicas` count can be managed by a **Horizontal Pod Autoscaler (HPA)** based on CPU or memory usage for true elasticity.

---

## Backend Implementation To-Do List & Recommendations

This checklist is for the engineering team building the production concentrator. Adhering to these points is critical for a secure, stable, and maintainable service, **especially for decoupled or private VPS deployments.**

*   **[ ] 1. Harden Dependency Management:** The build process for `liboqs` must be deterministic. Pin the library to a specific, vetted version tag in your build scripts, not the `main` branch.
*   **[ ] 2. Enforce Stateless Application Design:** Confirm that the Go application logic is fully stateless. All data required to process a request must be contained within the request itself or fetched from an external datastore (like Redis).
*   **[ ] 3. Implement Externalized Configuration:** The Go application must load all configuration from environment variables or a specified config file path. **Do not hardcode IP addresses, ports, or credentials.**
*   **[ ] 4. Expose Health Check Endpoints:** The application must provide HTTP endpoints for health checks (e.g., `/healthz` for liveness, `/readyz` for readiness). Kubernetes/GKE uses these to manage pod health. For a VPS, a process manager like `systemd` can use these to automatically restart a failed service.
*   **[ ] 5. Implement Structured Logging:** All log output must be in JSON format to standard output. This is non-negotiable for effective log aggregation and analysis in any environment.
*   **[ ] 6. Ensure Graceful Shutdown:** The server must listen for termination signals (`SIGINT`, `SIGTERM`) and perform a graceful shutdown. This means it should stop accepting new connections, finish processing active requests within a deadline, and then exit. This is critical for zero-downtime deployments.
*   **[ ] 7. Strategy for Decoupled/VPS Deployments:**
    *   **Process Management:** Use a robust process manager like `systemd` to manage the application binary as a service, ensuring it runs on boot and is automatically restarted on failure.
    *   **TLS Termination:** Use a battle-tested reverse proxy like **Nginx** or **Caddy** in front of the Go application. The proxy will handle TLS termination (managing certificates via Let's Encrypt) and forward traffic to the concentrator process. This is more secure and efficient than handling TLS directly in the Go application.
*   **[ ] 8. Expose Prometheus Metrics:** The Go application should expose an HTTP endpoint (e.g., `/metrics`) with key operational metrics in the Prometheus exposition format. This allows for easy integration with a Prometheus/Grafana monitoring stack, which is the industry standard for any deployment environment.