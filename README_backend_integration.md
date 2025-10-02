# QPN-0+ Backend Integration Guide

**Document Version:** 1.2
**Target Audience:** Backend Engineering Team

## 1. Overview

This document provides the technical specifications required to integrate a backend service with the QPN-0+ frontend client. The client is architected to be a "rendering terminal" that relies on the backend for all state, authentication, and real-time data.

The backend is expected to be a stateless, horizontally scalable service. All API endpoints should be prefixed with `/api/v1`. The primary real-time connection is handled via a secure WebSocket.

### Configuration
The frontend expects one environment variable to be available at build time:
-   `REACT_APP_API_BASE_URL`: The base URL for the backend API (e.g., `https://api.qpn-zero.com`).
-   `REACT_APP_WSS_BASE_URL`: The base URL for WebSocket connections (e.g., `wss://api.qpn-zero.com`).

---

## 2. Core Technology & Library Requirements

To meet the security and functionality requirements of the QPN-0+ platform, the backend implementation **must** use the following technologies.

### **2.1 Post-Quantum Cryptography**

-   **Required Library:** **Open Quantum Safe (liboqs)**
-   **Specification:** The backend must use a stable, vetted version of `liboqs` (e.g., version `0.10.0` as specified in the reference `Dockerfile`).
-   **Implementation:** The library will be used to perform all PQC cryptographic operations, specifically:
    -   **Key Encapsulation:** Generating keypairs and encapsulating shared secrets using `Kyber-1024` or `FrodoKEM-1344`.
    -   **Digital Signatures:** Generating keypairs and signing/verifying server identity during the handshake using `Dilithium5`.

### **2.2 Immutable Ledger (Blockchain)**

-   **Required Framework:** **Parity's Substrate**
-   **Specification:** The backend must orchestrate a private, permissioned blockchain to serve as an immutable audit trail for all significant system events.
-   **Implementation:** Every critical event must be packaged as a transaction and committed to the blockchain. This is non-negotiable for ensuring Zero Trust and auditability.

#### **Log Transaction Schema**
Each log entry committed to the blockchain must adhere to the following schema:
```json
{
  "transactionId": "unique_transaction_hash",
  "timestamp": "ISO_8601_timestamp_with_nanoseconds",
  "eventType": "USER_LOGIN_SUCCESS" | "PQC_HANDSHAKE_FAILURE" | "HIGH_CPU_WARNING" | "MESH_ENABLED",
  "level": "INFO" | "WARN" | "ERROR" | "SYSTEM",
  "sourceIp": "192.168.1.101",
  "userId": "operator_01",
  "details": {
    "message": "User successfully authenticated.",
    "pqcAlgorithm": "Kyber-1024",
    "deployment": "Google Cloud Platform"
    // other relevant metadata
  },
  "logSignature": "cryptographic_signature_of_the_payload"
}
```
-   **Transactional Integrity:** To prevent race conditions and ensure proper ordering, the backend must implement a queuing mechanism. Events should be processed sequentially from a queue (e.g., RabbitMQ, Redis Streams) before being signed and committed to the blockchain.

---

## 3. Authentication Flow (REST API)

The client follows a multi-step process for both new user registration and existing user sign-in.

### **3.1 New Operator Registration**

1.  **`POST /auth/register`**
    -   **Description:** Initiates the registration process for a new operator.
    -   **Request Body:**
        ```json
        {
          "organization": "Cyberellum",
          "username": "new_operator",
          "password": "A_Very_Strong_Password_123!"
        }
        ```
    -   **Success Response (200 OK):**
        ```json
        {
          "message": "Registration successful. Proceed to policy agreement."
        }
        ```
    -   **Error Response (400 Bad Request / 409 Conflict):**
        ```json
        { "error": "Username already exists." }
        ```

### **3.2 Operator Sign In**

1.  **`POST /auth/login`**
    -   **Description:** Handles the first step of authentication (username/password).
    -   **Request Body:**
        ```json
        {
          "username": "operator_01",
          "password": "user_password"
        }
        ```
    -   **Success Response (200 OK):** Returns a temporary token required for the 2FA step.
        ```json
        {
          "tempAuthToken": "a_short_lived_token_for_2fa_verification"
        }
        ```
    -   **Error Response (401 Unauthorized):**
        ```json
        { "error": "Invalid username or password." }
        ```

2.  **`POST /auth/verify-2fa`**
    -   **Description:** Verifies the 2FA code to complete the login process.
    -   **Request Body:**
        ```json
        {
          "tempAuthToken": "the_token_from_the_previous_step",
          "twoFactorCode": "123456"
        }
        ```
    -   **Success Response (200 OK):** Returns a long-lived session token (e.g., JWT).
        ```json
        {
          "sessionToken": "a_long_lived_jwt_session_token",
          "user": {
            "username": "operator_01",
            "organization": "Cyberellum"
          }
        }
        ```
    -   **Error Response (401 Unauthorized):**
        ```json
        { "error": "Invalid 2FA code." }
        ```
    -   **Note:** The `sessionToken` must be sent in the `Authorization: Bearer <token>` header for all subsequent authenticated requests.

---

## 4. Session Initialization (REST API)

This step simulates the complex, multi-signature wallet unlocking process.

1.  **`POST /session/initialize`**
    -   **Description:** Called after successful 2FA. The backend performs its security checks (endpoint compliance, MPC co-signing).
    -   **Headers:** `Authorization: Bearer <sessionToken>`
    -   **Request Body:**
        ```json
        {
            "deploymentEnvironment": "Google Cloud Platform"
        }
        ```
    -   **Success Response (200 OK):**
        ```json
        { "status": "initialized", "message": "Secure terminal ready." }
        ```
    -   **Error Response (403 Forbidden):**
        ```json
        { "error": "Endpoint compliance check failed: Conflicting VPN detected." }
        ```

---

## 5. Main Client Connection (WebSocket)

The core VPN tunnel simulation, including logs and telemetry, is handled via a single, long-lived WebSocket connection.

-   **Endpoint:** `WSS /connect`
-   **Connection:** The client will attempt to connect to this endpoint after the session is initialized. It will pass the `sessionToken` as a query parameter or subprotocol for authentication.

### **Messages from Server to Client**

The server should push messages to the client in the following format:
```json
{
  "type": "log_entry" | "traffic_update" | "connection_status",
  "payload": { ... }
}
```

-   **`log_entry` Payload:**
    ```json
    {
      "level": "INFO" | "WARN" | "ERROR" | "SYSTEM",
      "message": "Log message from the server."
    }
    ```
-   **`traffic_update` Payload:**
    ```json
    {
      "up": 850.5,   // kbps
      "down": 2300.1, // kbps
      "totalUp": 102.5, // MB
      "totalDown": 540.2 // MB
    }
    ```
-   **`connection_status` Payload:** Used for handshake steps.
    ```json
    {
      "status": "connecting",
      "message": "Performing PQC handshake (Kyber-1024)..."
    }
    ```

---

## 6. AI Assistant (REST API)

To protect the Gemini API key, all AI-related requests are proxied through the backend.

-   **`POST /ai/assist`**
    -   **Description:** Forwards a user's prompt and relevant context to the AI model.
    -   **Headers:** `Authorization: Bearer <sessionToken>`
    -   **Request Body:**
        ```json
        {
          "prompt": "Analyze the logs for any suspicious activity.",
          "context": {
            "logs": "...", // A string snapshot of recent logs
            "traffic": "..." // A string summary of current traffic stats
          }
        }
        ```
    -   **Success Response (200 OK):**
        ```json
        { "response": "Based on the logs, I've detected a high number of failed login attempts..." }
        ```

---

## 7. Dashboard Data (REST API & WebSocket)

### **7.1 External API Status (REST)**
-   **`GET /status/dependencies`**
    -   **Description:** Provides the real-time status of the backend's external dependencies.
    -   **Headers:** `Authorization: Bearer <sessionToken>`
    -   **Success Response (200 OK):**
        ```json
        [
          { "name": "Gemini API", "status": "OPERATIONAL" },
          { "name": "Q-MAS Orchestrator", "status": "DEGRADED" },
          { "name": "NIST PQC Standards", "status": "OPERATIONAL" },
          { "name": "Threat Intel Feed (TBD)", "status": "ERROR" }
        ]
        ```
        (Status can be `OPERATIONAL`, `DEGRADED`, `ERROR`)

### **7.2 Server Mode Telemetry (WebSocket)**
-   **Endpoint:** `WSS /server/telemetry`
-   **Description:** Allows the client in "Server Mode" to subscribe to real-time concentrator metrics.
-   **Server to Client Message:** The server should push telemetry updates periodically.
    ```json
    {
      "type": "telemetry_update" | "client_list_update",
      "payload": { ... }
    }
    ```
    -   **`telemetry_update` Payload:**
        ```json
        {
            "activeConnections": 150,
            "cpuLoad": 65.5,
            "memUsage": 45.2,
            "totalDataProcessed": 1024.7, // GB
            "handshakesPerSec": 25
        }
        ```
    -   **`client_list_update` Payload:**
        ```json
        [
          { "id": "client_1", "ip": "1.2.3.4", "pqcAlgorithm": "Kyber-1024", "connectedSince": 1678886400000 },
          { "id": "client_2", "ip": "5.6.7.8", "pqcAlgorithm": "FrodoKEM-1344", "connectedSince": 1678886500000 }
        ]
        ```
---

## 8. Multi-Agent System & SME Agent Setup

The backend is an orchestrated system of specialized, independent agents. Each agent is a separate microservice responsible for a specific domain. They communicate via a central message bus.

### **8.1 Core System-Wide Dependencies**
-   **Message Bus:** **RabbitMQ** is required for asynchronous, decoupled communication between all agents. All inter-agent commands and data handoffs must be performed via RabbitMQ topics.
-   **Containerization:** All agents must be packaged as **Docker** containers for consistent deployment.
-   **Orchestration:** **Kubernetes** is the target environment for managing the lifecycle of all agent containers.

### **8.2 Specialized SME Agent Dependencies & Instructions**

#### **1. Orchestrator Agent**
-   **Purpose:** The central nervous system. Routes tasks to appropriate SME agents, manages the secure connection to the LLM fabric (Vertex AI), and interfaces with the primary API gateway.
-   **Key Dependencies:** Go, Google Cloud SDK, RabbitMQ Client Library for Go.
-   **Setup Instructions:**
    ```bash
    # 1. Install Go
    # 2. Authenticate Google Cloud SDK
    gcloud auth application-default login
    # 3. Set up environment variables for RabbitMQ connection and Google Cloud Project
    export RABBITMQ_URL="amqp://guest:guest@localhost:5672/"
    export GOOGLE_PROJECT_ID="your-gcp-project-id"
    # 4. Build and run the orchestrator binary
    go build -o orchestrator ./cmd/orchestrator
    ./orchestrator
    ```

#### **2. SecOps Agent**
-   **Purpose:** Performs deep packet inspection, real-time threat analysis, and vulnerability scanning.
-   **Key Dependencies:** Python, `libpcap` for packet capture, `scapy` for packet manipulation, `Trivy` for vulnerability scanning, RabbitMQ Client Library (`pika`).
-   **Setup Instructions:**
    ```bash
    # 1. Install system dependencies (on Debian/Ubuntu)
    sudo apt-get update && sudo apt-get install -y libpcap-dev python3-pip
    # 2. Install Python libraries
    pip3 install pika scapy
    # 3. Install Trivy scanner
    # (Follow official installation guide for your OS)
    # 4. Run the agent
    python3 secops_agent.py
    ```

#### **3. Quantum/Blockchain Agent**
-   **Purpose:** Manages all interactions with the private Substrate blockchain. Signs and commits log transactions. Provides an interface to the `liboqs` library for other agents.
-   **Key Dependencies:** Rust, Substrate toolchain, `oqs-rs` (Rust bindings for liboqs), RabbitMQ Client Library (`lapin`).
-   **Setup Instructions:**
    ```bash
    # 1. Install Rust and Substrate toolchain
    curl https://get.substrate.io -sSf | bash -s -- --fast
    source ~/.cargo/env
    # 2. Add oqs-rs dependency to your Cargo.toml
    # 3. Build and run the Substrate node and the agent service
    cargo build --release
    ./target/release/substrate-node --dev
    ./target/release/blockchain-agent
    ```

#### **4. DevOps/AIOps Agent**
-   **Purpose:** Monitors system health, manages infrastructure-as-code deployments, and analyzes performance metrics for anomalies.
-   **Key Dependencies:** Python, Prometheus Client Library, Google Cloud Client Libraries, Terraform, RabbitMQ Client Library (`pika`).
-   **Setup Instructions:**
    ```bash
    # 1. Install system dependencies
    # (Install Terraform, Google Cloud SDK)
    # 2. Install Python libraries
    pip3 install pika prometheus-client google-cloud-monitoring
    # 3. Configure cloud credentials
    # (gcloud auth application-default login)
    # 4. Run the agent
    python3 aiops_agent.py
    ```

#### **5. Data Scientist Agent**
-   **Purpose:** Performs long-term analysis, model training, and predictive analytics on data from the blockchain ledger.
-   **Key Dependencies:** Python, `pandas`, `numpy`, `scikit-learn`, `tensorflow`, libraries for connecting to the Substrate node (e.g., `py-substrate-interface`), RabbitMQ Client Library (`pika`).
-   **Setup Instructions:**
    ```bash
    # 1. Set up a Python virtual environment
    python3 -m venv .venv && source .venv/bin/activate
    # 2. Install data science and blockchain libraries
    pip install pandas numpy scikit-learn tensorflow py-substrate-interface pika
    # 3. Run the agent for analysis tasks
    python3 datasci_agent.py --mode=train --dataset=logs_2025_q1.csv
    ```