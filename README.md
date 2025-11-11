# Digital Wallet Architectures Research

This repository presents a comparative implementation of two distributed system architectures for a digital wallet application:

1. **Saga Pattern (Distributed Transactions)**
2. **Event-Driven Architecture with Event Sourcing and CQRS**

The project demonstrates how both models handle consistency, fault recovery, and scalability under similar technical conditions.  
It was developed as part of an applied research study on distributed system design and performance evaluation.

## Overview

The goal of this project is to compare two architectural approaches for distributed financial transactions:

- **Saga Pattern** — ensures distributed atomicity using compensating transactions.
- **Event-Driven CQRS** — leverages event sourcing to achieve reproducibility and scalability through separate read and write paths.

Each implementation simulates the same digital wallet use case, where users can transfer balances between accounts.

## Technology Stack

| **Component**         | **Technology Used**                                                  | **Purpose**                                                  |
| --------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Backend Framework** | [Nest.js](https://nestjs.com)                                        | Service layer and modular microservice architecture          |
| **Database**          | [PostgreSQL](https://www.postgresql.org)                             | Transaction storage, event store, and read-model persistence |
| **Message Queue**     | [RabbitMQ](https://www.rabbitmq.com)                                 | Asynchronous event communication                             |
| **Cache / PubSub**    | [Redis](https://redis.io)                                            | Caching layer for read models and Pub/Sub messaging          |
| **Containerization**  | [Docker Compose](https://docs.docker.com/compose/)                   | Local orchestration of services                              |
| **Testing Tool**      | [k6](https://k6.io)                                                  | Load and stress testing                                      |
| **Monitoring**        | [Prometheus](https://prometheus.io) + [Grafana](https://grafana.com) | Metrics visualization and analysis                           |

## Installation and Setup

### Clone the Repository

```bash
git clone git@github.com:MaxCojocari/dw-research.git
cd dw-research
```

### Install Dependencies

Each architecture is independent. Install dependencies for both:

```bash
cd saga && npm install
cd ../event-driven-cqrs && npm install
```

### Run Services via Docker Compose

#### Saga-Based Distributed Transactions

```bash
cd saga
docker-compose -f docker-compose.prod.yml up -d --build
```

#### Event-Driven CQRS Architecture

```bash
cd ../event-driven-cqrs
docker-compose -f docker-compose.prod.yml up -d --build
```

Each setup will spin up the necessary services:

- PostgreSQL
- RabbitMQ
- Redis
- Application containers

## Architectural Overview

### Saga-Based Distributed Transactions

The Saga implementation coordinates local database transactions through a centralized Wallet Service.
Each wallet transaction executes two local operations (debit and credit) across PostgreSQL shards.
In case of failure, compensating transactions reverse partial updates.

<img width="682" height="485" alt="image" src="https://github.com/user-attachments/assets/e482f6bf-bc1f-4c47-a885-223fce2e6c75" />

### Event-Driven CQRS Architecture

The CQRS implementation separates write and read responsibilities.
The Command Service handles incoming operations, persists events in PostgreSQL (event store), and publishes them via RabbitMQ.
The Projection Service processes these events to update read-optimized materialized views, which the Query Service then serves to clients.

<img width="1077" height="571" alt="image" src="https://github.com/user-attachments/assets/dc0425a7-6104-4b1d-bf8e-b5c945f34f6a" />

## API Endpoints

Both architectures expose a REST API for wallet transactions and balance queries.

| **Method** | **Endpoint**                   | **Description**                       |
| ---------- | ------------------------------ | ------------------------------------- |
| `POST`     | `/wallets/balanceTransfer`     | Transfers balance between two wallets |
| `GET`      | `/wallets/{accountId}/balance` | Retrieves current wallet balance      |

Example request:

```json
POST /wallets/balanceTransfer
{
    "fromAccount": "user1",
    "toAccount": "user2",
    "amount": 10.234,
    "currency": "USD"
}
```

## Testing and Evaluation

### Load Testing

The repository includes k6 scripts under `/load-testing` for evaluating:

- Throughput (TPS)
- Latency
- Fault recovery time
- Resource utilization

Run:

```bash
k6 run load-testing/script.js
```

### Monitoring

Metrics are collected via Prometheus and visualized in Grafana dashboards:

```bash
docker-compose up prometheus grafana
```
